# The wall · Firebase setup (one-time, ~4 minutes)

The `/wall/` page reuses the **my-planner** Firebase project (`my-planner-66a3e`),
the same Firestore, same Google sign-in, zero new infrastructure. Two console steps make it live.

## 1. Authorise the portfolio domain (for Google sign-in)

Firebase console → project **my-planner-66a3e** → **Authentication → Settings →
Authorized domains** → *Add domain*:

```
aaron-631.github.io
```

(`localhost` is already authorised for dev.)

## 2. Add the wall's Firestore rules

**Do not paste a wall-only ruleset into the console.** This Firebase project backs two
apps, the wall and my-planner, under one set of rules. Replacing the whole ruleset with
just the wall block takes the planner offline, and vice versa.

The single source of truth for both apps is `~/my-planner/firestore.rules`. Copy that
entire file into Firebase console → **Firestore Database → Rules** and publish. It is
covered by an emulator test suite, `npm run test:rules` in that repo.

Publish. The wall is live immediately, no redeploy of the site needed.

## What this design gives you

- **Real names**: entries require Google sign-in; the name is taken from the account.
- **No takedowns by authors, no edits by you**: `update`/`delete` are denied to everyone,
  which is exactly the "unedited" promise the page makes. To remove abuse, delete the
  document in the Firestore console (server access bypasses rules).
- **Private feedback stays private**: `kind == 'feedback'` docs are create-only and fail
  every client read. You read them in the Firestore console.
- **The client cannot forge its sort position**: `ts` must equal the server clock, so a
  far-future timestamp cannot win every tie. Scores are still clamped 0 to 100 by rules
  but are computed client-side, so a determined submitter can still send a high score.
  Signing the score in the `ai-worker` is the fix if that ever matters.

## Reading private feedback

Firestore console → `wall` collection → filter `kind == feedback`.
