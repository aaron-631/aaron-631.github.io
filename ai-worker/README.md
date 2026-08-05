# aaron-ai · the site's AI proxy

One tiny Cloudflare Worker that holds the Gemini API key so the static site never has to.

**Why this exists:** aaron-631.github.io is fully static. Any API key shipped in its
JavaScript is public, anyone can lift it from devtools and burn the quota (or the bill).
So the browser talks to this worker, the worker talks to Gemini, and the key lives only
in Cloudflare's secret store. CORS is locked to the portfolio's origin.

## What it powers

| Endpoint | Used by | Behaviour without the worker |
| --- | --- | --- |
| `POST /score` | ranking preview, 0 to 100 | local heuristic ranks instead |
| `POST /wall` | the wall's authoritative write | client writes directly, score capped at 50 |
| `POST /ask` | VantaShell's `ask` command, grounded Q&A about Aaron | shell says the brain is offline |

Every feature degrades gracefully: if this worker is down, slow, or never deployed, the
site works exactly as before. AI is an enhancement, never a dependency.

## Why `/wall` writes to Firestore

The ranking score used to be computed in the browser and written straight to Firestore,
so anyone could open devtools and post `score: 100` to pin themselves to the top of the
wall permanently. Firestore rules cannot verify a signature, so the fix is to let
something the visitor cannot impersonate perform the write.

`/wall` verifies the caller's Firebase ID token (real RS256 signature check against
Google's JWKS, see `token.test.js`), scores the text itself, and writes with a service
account, which bypasses rules. Rules separately cap any direct client write at 50, so the
fallback path stays honest when the worker is unavailable. Two layers, no single point of
trust in the browser.

## Deploy (once, ~3 minutes, free tier)

```bash
cd ai-worker
npx wrangler login                              # opens the browser, needs a free Cloudflare account
npx wrangler secret put GEMINI_API_KEY          # paste the key when prompted
npx wrangler secret put FIREBASE_SERVICE_ACCOUNT  # paste the WHOLE service account JSON
npx wrangler deploy                             # prints the URL
```

The service account JSON comes from Firebase console, project **my-planner-66a3e**,
Project settings, Service accounts, Generate new private key. Without it `/wall` returns
`unconfigured` and the site quietly falls back to capped client writes, so nothing breaks
while the secret is missing.

Then paste that URL into `src/lib/ai.ts`:

```ts
export const AI_ENDPOINT = 'https://aaron-ai.<you>.workers.dev';
```

Rebuild and push. The wall ranks with Gemini and the terminal answers questions.

## Key hygiene

- The key in `.dev.vars` was shared in plaintext chat. Treat it as semi-exposed:
  after deploying, **rotate it** in Google AI Studio and update the Cloudflare secret.
- In Google AI Studio / Cloud Console, restrict the key to the Generative Language API.
- Optional hardening: add a Cloudflare rate-limiting rule (e.g. 20 req/min per IP) on
  the worker route, free tier covers it.

## Local test

```bash
cd ai-worker && npx wrangler dev
curl -s localhost:8787/ask -H 'content-type: application/json' \
  -d '{"question":"what did aaron train?"}'
```
