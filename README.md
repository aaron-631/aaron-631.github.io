# aaron-631.github.io

Personal site of **Aaron Chakraborty** — AI/ML Security Engineer. I build AI systems, and I break them.

Live at [aaron-631.github.io](https://aaron-631.github.io).

## Stack

- [Astro](https://astro.build) + Tailwind CSS v4 — fully static output, zero client framework
- IBM Plex Mono · Newsreader · Inter, self-hosted via Fontsource
- Vanilla TypeScript for the interactive layer — no dependencies

## The interesting parts

- **BUILD / BREAK dual-lens** — a toggle that re-frames the entire site between my two identities: the engineer who trains LLMs from scratch, and the researcher who attacks them. Same facts, two lenses (`data-mode` + CSS custom properties).
- **VantaShell** — the terminal is real navigation. Press `~` anywhere. `help`, `cat projects/vantallm.md`, `scan me`, tab completion, and a few undocumented commands.
- **Argus recruiter scan** — my actual AI-agent risk evaluator ([Project Argus](https://github.com/aaron-631/PROJECT-ARGUS)), pointed at myself. `R = S_base × C_env × P_conf → HIRE`.
- **Proof chips** — every claim on the site carries its receipt. Exact param counts, test tallies, disclosure timelines. Claims are cheap.

## Develop

```bash
npm install
npm run dev      # local dev at :4321
npm run build    # static build to dist/
```

Deploys automatically to GitHub Pages via Actions on push to `main`.
