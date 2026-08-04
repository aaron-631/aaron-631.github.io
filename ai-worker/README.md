# aaron-ai · the site's AI proxy

One tiny Cloudflare Worker that holds the Gemini API key so the static site never has to.

**Why this exists:** aaron-631.github.io is fully static. Any API key shipped in its
JavaScript is public — anyone can lift it from devtools and burn the quota (or the bill).
So the browser talks to this worker, the worker talks to Gemini, and the key lives only
in Cloudflare's secret store. CORS is locked to the portfolio's origin.

## What it powers

| Endpoint | Used by | Behaviour without the worker |
| --- | --- | --- |
| `POST /score` | the wall — moderates each entry and ranks it 0–100 | local heuristic ranks instead |
| `POST /ask` | VantaShell's `ask` command — grounded Q&A about Aaron | shell says the brain is offline |

Every feature degrades gracefully: if this worker is down, slow (>4s for scoring), or
never deployed, the site works exactly as before. AI is an enhancement, never a dependency.

## Deploy (once, ~3 minutes, free tier)

```bash
cd ai-worker
npx wrangler login                      # opens the browser, needs a free Cloudflare account
npx wrangler secret put GEMINI_API_KEY  # paste the key when prompted
npx wrangler deploy                     # prints the URL, e.g. https://aaron-ai.<you>.workers.dev
```

Then paste that URL into `src/lib/ai.ts`:

```ts
export const AI_ENDPOINT = 'https://aaron-ai.<you>.workers.dev';
```

Rebuild + push. Done — the wall ranks with Gemini and the terminal answers questions.

## Key hygiene

- The key in `.dev.vars` was shared in plaintext chat. Treat it as semi-exposed:
  after deploying, **rotate it** in Google AI Studio and update the Cloudflare secret.
- In Google AI Studio / Cloud Console, restrict the key to the Generative Language API.
- Optional hardening: add a Cloudflare rate-limiting rule (e.g. 20 req/min per IP) on
  the worker route — free tier covers it.

## Local test

```bash
cd ai-worker && npx wrangler dev
curl -s localhost:8787/ask -H 'content-type: application/json' \
  -d '{"question":"what did aaron train?"}'
```
