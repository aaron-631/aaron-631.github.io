# The wall · Firebase setup (one-time, ~4 minutes)

The `/wall/` page reuses the **my-planner** Firebase project (`my-planner-66a3e`) —
same Firestore, same Google sign-in, zero new infrastructure. Two console steps make it live.

## 1. Authorise the portfolio domain (for Google sign-in)

Firebase console → project **my-planner-66a3e** → **Authentication → Settings →
Authorized domains** → *Add domain*:

```
aaron-631.github.io
```

(`localhost` is already authorised for dev.)

## 2. Add the wall's Firestore rules

Firebase console → **Firestore Database → Rules**. Keep everything you already have for
my-planner and **add this block inside** `match /databases/{database}/documents { … }`:

```
// ── portfolio wall ─────────────────────────────────────────────
// public recommendations: world-readable, create-only, signed-in authors,
// hard field limits. private feedback: writable but never readable.
match /wall/{entry} {
  allow read: if resource.data.kind == 'rec';
  allow create: if request.auth != null
    && request.resource.data.kind in ['rec', 'feedback']
    && request.resource.data.uid == request.auth.uid
    && request.resource.data.name is string
    && request.resource.data.name.size() >= 2
    && request.resource.data.name.size() <= 60
    && request.resource.data.role is string
    && request.resource.data.role.size() <= 80
    && request.resource.data.text is string
    && request.resource.data.text.size() >= 20
    && request.resource.data.text.size() <= 600
    && request.resource.data.score is number
    && request.resource.data.score >= 0
    && request.resource.data.score <= 100
    && request.resource.data.keys().hasOnly(['kind','uid','name','role','text','score','ts']);
  allow update, delete: if false; // entries are permanent from the client side
}
```

Publish. The wall is live immediately — no redeploy of the site needed.

## What this design gives you

- **Real names**: entries require Google sign-in; the name is taken from the account.
- **No takedowns by authors, no edits by you** — `update`/`delete` are denied to everyone,
  which is exactly the "unedited" promise the page makes. To remove abuse, delete the
  document in the Firestore console (server access bypasses rules).
- **Private feedback stays private**: `kind == 'feedback'` docs are create-only and fail
  every client read. You read them in the Firestore console.
- **The client can't inflate its own ranking much**: scores are clamped 0–100 by rules, and
  once the `ai-worker` is deployed the score is produced by Gemini before the write.

## Reading private feedback

Firestore console → `wall` collection → filter `kind == feedback`.
