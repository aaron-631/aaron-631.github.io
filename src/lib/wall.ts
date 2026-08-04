// The wall's data layer — Firebase, loaded lazily so the page itself stays
// instant. The SDK only downloads when the wall scrolls into view.
//
// Reuses the my-planner Firebase project. This config is public by design
// (every Firebase web app ships it); security lives in the Firestore rules —
// see FIREBASE_SETUP.md at the repo root.

import { aiScore } from './ai';

const firebaseConfig = {
  apiKey: 'AIzaSyDZmBzzGck4G52LPt-Vgy2SLuJqJZzXvQA',
  authDomain: 'my-planner-66a3e.firebaseapp.com',
  projectId: 'my-planner-66a3e',
  storageBucket: 'my-planner-66a3e.firebasestorage.app',
  messagingSenderId: '673639396222',
  appId: '1:673639396222:web:233a57d8d6f42ba841b92f',
};

export interface WallEntry {
  id: string;
  name: string;
  role: string;
  text: string;
  score: number;
  ts: number; // millis, 0 while the server timestamp is pending
}

export interface WallUser {
  uid: string;
  name: string;
  photo: string;
}

// lazy singletons — firebase modules are dynamic imports, split into their
// own chunk by the bundler and fetched only on the wall page
let dbP: Promise<import('firebase/firestore').Firestore> | null = null;
let authP: Promise<import('firebase/auth').Auth> | null = null;

async function app() {
  const { initializeApp, getApps } = await import('firebase/app');
  return getApps()[0] ?? initializeApp(firebaseConfig);
}

function db() {
  return (dbP ??= (async () => {
    const [a, { getFirestore }] = await Promise.all([app(), import('firebase/firestore')]);
    return getFirestore(a);
  })());
}

function auth() {
  return (authP ??= (async () => {
    const [a, { getAuth }] = await Promise.all([app(), import('firebase/auth')]);
    return getAuth(a);
  })());
}

/** Live subscription to the wall — fires on every change, best-first. */
export async function subscribeWall(cb: (entries: WallEntry[]) => void): Promise<() => void> {
  const [d, fs] = await Promise.all([db(), import('firebase/firestore')]);
  const q = fs.query(fs.collection(d, 'wall'), fs.where('kind', '==', 'rec'), fs.limit(120));
  return fs.onSnapshot(
    q,
    (snap) => {
      const entries: WallEntry[] = snap.docs.map((doc) => {
        const v = doc.data();
        return {
          id: doc.id,
          name: String(v.name ?? ''),
          role: String(v.role ?? ''),
          text: String(v.text ?? ''),
          score: Number(v.score ?? 50),
          ts: v.ts?.toMillis?.() ?? 0,
        };
      });
      // best writing first; ties go to the newest voice
      entries.sort((a, b) => b.score - a.score || b.ts - a.ts);
      cb(entries);
    },
    () => cb([]) // rules not deployed yet / offline — render the empty state
  );
}

export async function signIn(): Promise<WallUser> {
  const [a, fa] = await Promise.all([auth(), import('firebase/auth')]);
  const cred = await fa.signInWithPopup(a, new fa.GoogleAuthProvider());
  const u = cred.user;
  return { uid: u.uid, name: u.displayName ?? 'Anonymous', photo: u.photoURL ?? '' };
}

export async function currentUser(): Promise<WallUser | null> {
  const [a, fa] = await Promise.all([auth(), import('firebase/auth')]);
  return new Promise((resolve) => {
    const off = fa.onAuthStateChanged(a, (u) => {
      off();
      resolve(u ? { uid: u.uid, name: u.displayName ?? 'Anonymous', photo: u.photoURL ?? '' } : null);
    });
  });
}

/* Deterministic quality heuristic (0–100) — the fallback ranker, and the
   floor while the AI verdict is unavailable. Rewards specific, composed
   writing; penalises drive-by one-liners and shouting. */
export function heuristicScore(text: string): number {
  const t = text.trim();
  let s = 50;
  const len = t.length;
  if (len >= 120 && len <= 450) s += 18;
  else if (len >= 60) s += 8;
  else s -= 15;
  const specifics = /vantallm|argus|reconforge|planner|ctf|iot lab|kiit|security|llm|model|mentor|taught|shipped|built|debug|team|intern|swiftsafe|dbs/gi;
  s += Math.min(15, (t.match(specifics)?.length ?? 0) * 3);
  const sentences = t.split(/[.!?]+/).filter((x) => x.trim().length > 12).length;
  s += Math.min(9, sentences * 3);
  if (/(.)\1{4,}/.test(t)) s -= 12; // keysmash
  const letters = t.replace(/[^a-z]/gi, '');
  const caps = t.replace(/[^A-Z]/g, '');
  if (letters.length > 20 && caps.length / letters.length > 0.5) s -= 12;
  s -= Math.min(10, Math.max(0, (t.match(/!/g)?.length ?? 0) - 2) * 3);
  return Math.max(5, Math.min(96, Math.round(s)));
}

export interface SubmitResult {
  ok: boolean;
  reason?: string;
}

/** Write an entry. kind 'rec' shows on the wall live; 'feedback' goes only to Aaron. */
export async function submitEntry(
  user: WallUser,
  kind: 'rec' | 'feedback',
  role: string,
  text: string
): Promise<SubmitResult> {
  const body = text.trim();
  if (body.length < 20) return { ok: false, reason: 'a little more, please — 20 characters minimum.' };
  if (body.length > 600) return { ok: false, reason: 'keep it under 600 characters — the wall rewards sharp writing.' };

  // AI moderation + ranking when the brain is online; heuristic otherwise
  let score = heuristicScore(body);
  const ai = await aiScore(user.name, role, body);
  if (ai) {
    if (!ai.ok) return { ok: false, reason: ai.note || 'that one didn’t pass moderation.' };
    score = Math.max(5, Math.min(100, Math.round(ai.score)));
  }

  const [d, fs] = await Promise.all([db(), import('firebase/firestore')]);
  await fs.addDoc(fs.collection(d, 'wall'), {
    kind,
    name: user.name.slice(0, 60),
    role: role.trim().slice(0, 80),
    text: body,
    uid: user.uid,
    score,
    ts: fs.serverTimestamp(),
  });
  return { ok: true };
}
