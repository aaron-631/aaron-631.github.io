// Projects. VantaLLM is the flagship dossier; the rest are detailed cards.
// `proof` entries power the [proof] chips — every claim carries a receipt.

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
    oneliner: {
      build:
        'A modular async platform that evaluates AI-agent configurations before deployment. Typed contracts, deterministic rules, reproducible reports.',
      break:
        'Pre-deployment risk evaluation for LLM endpoints: prompt-injection, jailbreak and data-extraction attack families, scored before anything ships.',
    },
    stack: ['Python', 'asyncio', 'Pydantic', 'AES-256-GCM', 'Docker', 'YAML'],
    points: {
      build: [
        '15 deterministic rules over MCP schemas, tool permissions, workflows, secrets, and network config.',
        'Token-bucket rate limiting with 429 backpressure across concurrent eval streams; AES-256-GCM vaulting for sensitive artifacts.',
      ],
      break: [
        'Probabilistic risk model R = S_base × C_env × P_conf. One data-driven metric to drive go/no-go decisions.',
        'The bug class I found by hand in production (see the disclosure below) is the one Argus now catches automatically.',
      ],
    },
    proofs: [
      { label: 'source', detail: 'Full codebase, tests, and CI public on GitHub.', href: 'https://github.com/aaron-631/PROJECT-ARGUS' },
      { label: 'risk model', detail: 'R = (S_base × C_env) × P_conf, clamped to documented bounds; reports label canonical vs semantic methodology.' },
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
];

// Smaller things, one line each — "more in the lab".
export const lab = [
  { name: 'security-module', note: 'AES-256-GCM encryption + input-validation layer for a mental-health app (SIH 2025).', href: 'https://github.com/aaron-631/security-module' },
  { name: 'SAP BTP capstone', note: 'Employee-data iFlow on SAP Integration Suite · SAP Certified Backend Developer.', href: 'https://github.com/aaron-631/SAP-BTP-Integration-Capstone' },
] as const;

// The Yatra disclosure — its own section. Real security work, real timeline.
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
