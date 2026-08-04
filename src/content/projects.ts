// Projects. VantaLLM is the flagship dossier; the rest are detailed cards.
// `proof` entries power the [proof] chips, every claim carries a receipt.

export interface Proof {
  label: string;
  detail: string; // shown on expand
  href?: string;
}

export interface Project {
  id: string;
  name: string;
  status: 'private' | 'public' | 'live';
  oneliner: { build: string; break: string };
  stack: string[];
  points: { build: string[]; break: string[] };
  proofs: Proof[];
  links: { label: string; href: string }[];
  flagship?: boolean;
}

export const projects: Project[] = [
  {
    id: 'vantallm',
    name: 'VantaLLM',
    status: 'private',
    flagship: true,
    oneliner: {
      build:
        'A from-scratch framework for training decoder-only LLMs. I designed the architecture and made the technical calls, with AI tooling in the loop the way modern teams work. Every piece of it, I can sit down and explain: why it is there, what broke, how we fixed it.',
      break:
        'A cybersecurity-native LLM stack: my own cybersec tokenizer, adversarial eval hooks, persona-conditioned serving. I built it knowing someone like me would try to break it.',
    },
    stack: [
      'PyTorch',
      'DeepSpeed ZeRO-2/3',
      'MoE · grouped-GEMM',
      'GQA · RoPE · RMSNorm · SwiGLU',
      'FastAPI · SSE',
      'Custom BPE (151,003 vocab)',
    ],
    points: {
      build: [
        'Ran the 567M config for 30,000 steps on a single 20GB A100. The same code scales to a 125B bring-up profile by editing a JSON file. No forks, no branches.',
        'When ZeRO-3 param-gathers hung the run, we replaced a 128-expert Python loop with three batched tensors. Debugging that is where the real understanding came from.',
        'KV-cache decode is bit-identical to no-cache decode, and the tokenizer round-trips SQLi payloads and CVE strings exactly. I test the boring things because the boring things break.',
      ],
      break: [
        'The tokenizer is trained on security corpora, so vocab covers CVE strings, payloads, and exploit syntax that general tokenizers shred into garbage.',
        'Adversarial eval hooks run against every checkpoint: injection resistance, jailbreak probes, extraction attempts.',
        'The multi-node launcher fails fast on NAT and duplicate-IP setups instead of hanging at 0% GPU. Paranoia as a design principle.',
      ],
    },
    proofs: [
      {
        label: 'param count',
        detail:
          "python -c \"...parameter_count()['TOTAL']\" → 567,068,416. The '567M' is exact to the digit.",
      },
      {
        label: '86/86 tests',
        detail:
          'Phase 1 unit 41/41 · phase 2 integration 20/20 · phase 3 live FastAPI+SSE 25/25, plus 6/6 batched-MoE equivalence (max |Δ| = 5.22e-08 vs naive loop).',
      },
      {
        label: 'training run',
        detail: '30,000 steps, 567M params, single A100 20GB, DDP. Validated public reference path.',
      },
      {
        label: 'CI',
        detail: 'GitHub Actions: full pytest suite + architecture demo + distributed validator, green on main.',
      },
    ],
    links: [{ label: 'private · walkthrough on request', href: 'mailto:aaronchakraborty631@gmail.com?subject=VantaLLM%20walkthrough' }],
  },
  {
    id: 'argus',
    name: 'Project Argus',
    status: 'public',
    flagship: true,
    oneliner: {
      build:
        'A two-layer security platform for AI agents. V1 is a local-first release gate: it audits an agent repo, tools, permissions, secrets, MCP servers, network config, before anything ships. V2 is a runtime gateway that sits between the agent and its model, enforcing deterministic policies on every request and response.',
      break:
        'The full attack lifecycle, productised: versioned prompt-injection, jailbreak and data-extraction probes against live endpoints, read-only recon of real MCP servers, and a runtime gateway that blocks the attacks V1 predicted. Built by someone who breaks these systems by hand first.',
    },
    stack: [
      'Python 3.11 · asyncio',
      'Pydantic',
      'MCP · stdio + streamable HTTP',
      'Docker · Compose',
      'Prometheus metrics',
      'AES-256-GCM',
    ],
    points: {
      build: [
        '27 canonical rules with explicit capability contracts, AST analysis for Python, structured parsing for JSON/YAML/TOML, text rules for the rest. A structured rule is never silently run against the wrong file type.',
        'mcp-probe inspects live MCP servers read-only: initialize + paginated tools/list, zero tool calls. It has scanned the official filesystem server and the configs of Claude Code, Codex CLI, and Gemini CLI.',
        'Quality gate on every push: 53 tests, Black, Flake8, mypy, and schema checks, all green. Reports are reproducible JSON + Markdown artifacts a CI pipeline can gate on.',
      ],
      break: [
        'The V2 gateway blocks prompt injection with a 403 before the request ever reaches the model, holds dangerous tool calls (delete*) outright, and forces human approval (HTTP 428) on business-impacting ones like send_external_email.',
        'Responses get inspected too: credential-looking output is stopped with a 502, sensitive fields are redacted, and every decision lands in a hash-chained audit log that tampering would break.',
        'Real-world verification run: pointed at the official pinned MCP filesystem server, 14 tools discovered, 0 tool calls made, 2 HIGH findings, verdict BLOCK. Documented end-to-end in the repo.',
      ],
    },
    proofs: [
      { label: 'source', detail: 'Full codebase, tests, CI, and the WORKFLOW.md architecture walkthrough, public on GitHub.', href: 'https://github.com/aaron-631/PROJECT-ARGUS' },
      {
        label: 'risk model',
        detail:
          'R = (S_base × C_env) × P_conf, clamped to documented bounds. Deployment profiles make context explicit: banking_agent c_env=1.0, human-in-loop 0.5, public FAQ 0.1. A semantic judge can only nudge confidence, it can never erase a canonical failure.',
      },
      {
        label: 'quality gate',
        detail: '53 tests passing plus Black, Flake8, mypy, and schema-generation checks, enforced in GitHub Actions on every push.',
      },
      {
        label: 'live MCP run',
        detail:
          'Official @modelcontextprotocol filesystem server, version-pinned: 14 tools enumerated across 1 page with 0 tool calls, 2 HIGH findings, exit verdict BLOCK. The whole run is recorded in WORKFLOW.md.',
      },
    ],
    links: [{ label: 'github.com/aaron-631/PROJECT-ARGUS', href: 'https://github.com/aaron-631/PROJECT-ARGUS' }],
  },
  {
    id: 'reconforge',
    name: 'ReconForge',
    status: 'public',
    oneliner: {
      build: 'Recon automation that turns hours of manual enumeration into one command with structured, reproducible output.',
      break: 'The toolkit I actually use: nmap + rustscan + ffuf orchestration with intelligent FFUF calibration and wildcard-DNS auto-detection.',
    },
    stack: ['Bash', 'Python', 'Nmap', 'Rustscan', 'FFUF', 'jq'],
    points: {
      build: [
        'Cut manual recon toil by ~60% with modular network + web enumeration.',
        'Dual-format Markdown + HTML reporting from structured JSON. Timestamped, reproducible artifacts.',
      ],
      break: [
        'FFUF auto-calibration and wildcard-DNS detection to kill false positives before they waste your time.',
        'User-Agent rotation and rate-aware scanning defaults, because sloppy recon gets you blocked.',
      ],
    },
    proofs: [{ label: 'source', detail: 'Public on GitHub with full documentation.', href: 'https://github.com/aaron-631/ReconForge' }],
    links: [{ label: 'github.com/aaron-631/ReconForge', href: 'https://github.com/aaron-631/ReconForge' }],
  },
  {
    id: 'search-arena',
    name: 'Search Arena',
    status: 'live',
    oneliner: {
      build: 'Six classical AI search algorithms you can watch think, race against each other, and play against yourself.',
      break: 'Full-stack, shipped, and live, with a challenge-link system that validates puzzle solvability via inversion parity.',
    },
    stack: ['React 18', 'Vite', 'D3.js', 'Firebase', 'Capacitor', 'GitHub Actions'],
    points: {
      build: [
        'Animated step-by-step playback with D3 search-tree rendering for BFS, DFS, Greedy, A*, backtracking, hill climbing.',
        'Firebase-backed real-time leaderboard; CI/CD to Vercel; Android build via Capacitor.',
      ],
      break: [
        'Challenge links are validated server-side via inversion parity, so you cannot share an unsolvable board.',
        'Firebase rules locked down after I tried attacking my own leaderboard. Worked, then fixed.',
      ],
    },
    proofs: [
      { label: 'live demo', detail: 'Deployed and public.', href: 'https://search-arena.vercel.app' },
      { label: 'source', detail: 'Public on GitHub.', href: 'https://github.com/aaron-631/search-arena' },
    ],
    links: [
      { label: 'search-arena.vercel.app', href: 'https://search-arena.vercel.app' },
      { label: 'source', href: 'https://github.com/aaron-631/search-arena' },
    ],
  },
  {
    id: 'my-planner',
    name: 'my-planner',
    status: 'private',
    oneliner: {
      build:
        'A weekly planner I actually live in: drag-and-drop scheduling on a half-hour grid, synced in real time through Firestore, with Google and Outlook calendars flowing in and Gemini turning plain English into placed events.',
      break:
        'Built the way a security person builds a personal tool: Google sign-in as federated identity, calendar scopes kept read-only, and the Gemini key is BYOK, it lives in your browser’s localStorage and never touches a server I run.',
    },
    stack: ['React 19', 'Firebase Auth · Firestore', 'Gemini 2.5 Flash', 'Google Calendar API', 'Microsoft Graph'],
    points: {
      build: [
        'Say "gym at 7 pm then deep work till midnight" and Gemini 2.5 Flash returns schema-validated JSON, typed events with start, duration, and category, that lands straight on the grid. Structured output, not string parsing.',
        'Every edit syncs live through Firestore onSnapshot, so the planner is the same on every device, and a share link lets anyone view a week read-only.',
        'Pulls existing events from both Google Calendar and Microsoft Outlook (Graph API) into one board, deduped against what you already planned.',
      ],
      break: [
        'Bring-your-own-key by design: the Gemini API key is stored client-side only. No proxy server, no logging, nothing for an attacker to steal from me.',
        'OAuth scopes are deliberately minimal, calendar read, profile, nothing more. The same least-privilege habit Argus enforces on other people’s agents.',
      ],
    },
    proofs: [
      {
        label: 'structured output',
        detail:
          'Gemini responses are constrained by a responseSchema (typed ARRAY of OBJECTs: label, startHour, duration, type, targetDays), malformed events cannot reach the grid.',
      },
      { label: 'real-time sync', detail: 'Firestore onSnapshot listeners keep every open device consistent; optimistic writes keep the UI instant.' },
    ],
    links: [{ label: 'private · demo on request', href: 'mailto:aaronchakraborty631@gmail.com?subject=my-planner%20demo' }],
  },
];

// Smaller things, one line each, "more in the lab".
export const lab = [
  { name: 'security-module', note: 'AES-256-GCM encryption + input-validation layer for a mental-health app (SIH 2025).', href: 'https://github.com/aaron-631/security-module' },
  { name: 'SAP BTP capstone', note: 'Employee-data iFlow on SAP Integration Suite · SAP Certified Backend Developer.', href: 'https://github.com/aaron-631/SAP-BTP-Integration-Capstone' },
] as const;

// The Yatra disclosure, its own section. Real security work, real timeline.
export const disclosure = {
  id: 'disclosure',
  title: 'Reflected XSS · Yatra.com “Diya” AI chatbot',
  summary:
    'Found a reflected cross-site scripting vulnerability in the AI chatbot of a major Indian travel platform. Reported it responsibly. Their security team acknowledged and remediated it.',
  timeline: [
    { step: 'discovered', note: 'reflected XSS in the Diya chatbot input path' },
    { step: 'reported', note: 'responsible disclosure to the Yatra security team' },
    { step: 'acknowledged', note: 'triaged and confirmed by the vendor' },
    { step: 'remediated', note: 'fix deployed to production' },
  ],
  moral:
    "AI features widen the attack surface. I learned that by exploiting one, not by reading about it. It's also why Argus exists: the bug class I found by hand is the one my tool now catches before deployment.",
} as const;
