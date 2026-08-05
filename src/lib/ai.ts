// The AI brain, optional, and deliberately not embedded in this static site.
//
// A Gemini API key shipped in client JS is public the moment anyone opens
// devtools, so all AI calls go through a tiny proxy (see ai-worker/) that
// holds the key server-side. Deploy it, paste its URL below, and every AI
// feature lights up. Leave it empty and the site quietly falls back to
// deterministic behaviour, nothing breaks, nothing slows down.

export const AI_ENDPOINT = 'https://aaron-ai.aaron631.workers.dev';

export const aiEnabled = () => AI_ENDPOINT.length > 0;

async function post<T>(path: string, body: unknown, timeoutMs: number): Promise<T | null> {
  if (!aiEnabled()) return null;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    const res = await fetch(`${AI_ENDPOINT}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    clearTimeout(t);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null; // offline, blocked, or slow, the caller has a fallback
  }
}

export interface AiScore {
  ok: boolean; // false → the text failed moderation
  score: number; // 0 to 100 quality ranking for the wall
  note?: string;
}

/** Ask Gemini to moderate + rank a wall entry. Null → use the local heuristic. */
export function aiScore(name: string, role: string, text: string): Promise<AiScore | null> {
  return post<AiScore>('/score', { name, role, text }, 4000);
}

export interface WallWriteResult {
  ok: boolean;
  reason?: string; // 'unconfigured' | 'auth' | 'moderation' | 'rate' | 'short' | 'long' | 'name'
  note?: string;
  score?: number;
}

/**
 * Submit an entry through the worker, which verifies the ID token, scores the
 * text server-side and writes it with a service account. This is what makes the
 * ranking trustworthy: a score decided in the browser can simply be edited.
 * Null means the worker was unreachable, so the caller writes directly instead.
 */
export function aiSubmitWall(
  idToken: string,
  kind: 'rec' | 'feedback',
  role: string,
  text: string
): Promise<WallWriteResult | null> {
  // Longer than /score: this call also does a token exchange and a write.
  return post<WallWriteResult>('/wall', { idToken, kind, role, text }, 10000);
}

/** Grounded Q&A about Aaron for the terminal's `ask` command. */
export async function aiAsk(question: string): Promise<string | null> {
  const r = await post<{ answer?: string }>('/ask', { question }, 12000);
  return r?.answer ?? null;
}
