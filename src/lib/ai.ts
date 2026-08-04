// The AI brain — optional, and deliberately not embedded in this static site.
//
// A Gemini API key shipped in client JS is public the moment anyone opens
// devtools, so all AI calls go through a tiny proxy (see ai-worker/) that
// holds the key server-side. Deploy it, paste its URL below, and every AI
// feature lights up. Leave it empty and the site quietly falls back to
// deterministic behaviour — nothing breaks, nothing slows down.

export const AI_ENDPOINT = ''; // e.g. 'https://aaron-ai.<subdomain>.workers.dev'

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
    return null; // offline, blocked, or slow — the caller has a fallback
  }
}

export interface AiScore {
  ok: boolean; // false → the text failed moderation
  score: number; // 0–100 quality ranking for the wall
  note?: string;
}

/** Ask Gemini to moderate + rank a wall entry. Null → use the local heuristic. */
export function aiScore(name: string, role: string, text: string): Promise<AiScore | null> {
  return post<AiScore>('/score', { name, role, text }, 4000);
}

/** Grounded Q&A about Aaron for the terminal's `ask` command. */
export async function aiAsk(question: string): Promise<string | null> {
  const r = await post<{ answer?: string }>('/ask', { question }, 12000);
  return r?.answer ?? null;
}
