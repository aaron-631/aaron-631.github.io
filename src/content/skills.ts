// The toolkit, explained like I'd explain it to a friend who doesn't code.
// Every skill answers two questions: what is it, and where did I actually use it.

export interface Skill {
  id: string;
  name: string;
  // matches stack-chip / arsenal labels so pages can wire popovers automatically
  match: string[];
  what: string; // plain words, no jargon
  used: string; // where + how, specific
  href: string; // the receipt
}

export const skills: Skill[] = [
  {
    id: 'pytorch',
    name: 'PyTorch',
    match: ['pytorch'],
    what: 'The main library people use to build and train neural networks in Python. If modern AI is a workshop, this is the workbench.',
    used: 'VantaLLM is written in it end to end: all 567 million parameters, the attention layers, the training loop, everything.',
    href: '/projects/#vantallm',
  },
  {
    id: 'deepspeed',
    name: 'DeepSpeed',
    match: ['deepspeed'],
    what: "A library that splits a model too big for one GPU across many, so it fits in memory at all. Without it, big models simply don't train.",
    used: 'Kept the VantaLLM 567M run alive on a single 20GB card, and it is what the 125B bring-up profile leans on.',
    href: '/projects/#vantallm',
  },
  {
    id: 'transformers',
    name: 'Transformer internals',
    match: ['moe', 'grouped-gemm', 'gqa', 'rope', 'rmsnorm', 'swiglu', 'transformer'],
    what: "The architecture behind ChatGPT-style models. MoE means only a few 'expert' parts of the model wake up for each word, so a big model stays fast.",
    used: 'I designed VantaLLM around these pieces: 16 experts with top-2 routing, grouped-query attention, rotary embeddings. Then debugged why each one broke.',
    href: '/projects/#vantallm',
  },
  {
    id: 'tokenizer',
    name: 'BPE tokenizer design',
    match: ['bpe', 'tokenizer', '151,003'],
    what: 'A tokenizer chops text into the pieces a model can read. Most are trained on everyday text and mangle technical strings.',
    used: 'Trained a custom 151,003-token vocabulary on security corpora, so VantaLLM reads exploit payloads and CVE strings without shredding them.',
    href: '/projects/#vantallm',
  },
  {
    id: 'fastapi',
    name: 'FastAPI',
    match: ['fastapi', 'sse'],
    what: 'A Python toolkit for building the web APIs that let apps talk to your code. SSE is the trick that streams a reply word by word, like ChatGPT typing.',
    used: "VantaLLM's serving layer: live token streaming, persona routing, and 25/25 passing tests against the running server.",
    href: '/projects/#vantallm',
  },
  {
    id: 'python',
    name: 'Python',
    match: ['python', 'asyncio', 'pydantic'],
    what: 'My first language for almost everything: AI, security tooling, automation. Readable enough to think in.',
    used: 'VantaLLM, Argus, the security-module, half of ReconForge. If I built it, Python is probably in it.',
    href: '/projects/',
  },
  {
    id: 'burp',
    name: 'Burp Suite',
    match: ['burp'],
    what: 'The standard tool for intercepting the traffic between your browser and a website, and tampering with it to find security holes.',
    used: 'My daily driver across 20+ real security assessments at Panacea Infosec, and the hunt that found the Yatra chatbot XSS.',
    href: '/work/#disclosure',
  },
  {
    id: 'nmap',
    name: 'Nmap',
    match: ['nmap', 'rustscan'],
    what: 'Maps which doors (ports) are open on a server, and guesses what is running behind each one. Step one of almost every security test.',
    used: 'ReconForge orchestrates it with rustscan so an hour of manual scanning becomes one command with a clean report.',
    href: '/projects/#reconforge',
  },
  {
    id: 'ffuf',
    name: 'FFUF',
    match: ['ffuf'],
    what: 'A rapid-fire guessing tool that finds hidden pages and files on websites by trying thousands of names per second.',
    used: 'ReconForge auto-calibrates it and detects wildcard DNS, so it stops drowning you in false positives.',
    href: '/projects/#reconforge',
  },
  {
    id: 'wireshark',
    name: 'Wireshark',
    match: ['wireshark', 'traffic analysis'],
    what: 'Lets you watch raw network traffic packet by packet. Like reading the mail as it moves through the post office.',
    used: 'Threat analysis during my internship at The Red Users: capturing traffic, spotting what should not be there.',
    href: '/work/',
  },
  {
    id: 'exploitation',
    name: 'Exploitation toolkit',
    match: ['metasploit', 'sqlmap', 'hydra', 'exploitation'],
    what: 'Metasploit, SQLMap, Hydra: the tools that turn "this might be vulnerable" into proof, safely and with permission.',
    used: 'eJPTv2 certification at 91%, Pentathon 2025 (AIR 45), and controlled testing on live engagements.',
    href: '/work/',
  },
  {
    id: 'prompt-injection',
    name: 'Prompt injection & jailbreaks',
    match: ['prompt injection', 'jailbreak', 'adversarial'],
    what: 'Tricking an AI into ignoring its rules by hiding instructions in what looks like normal input. The new class of bug nobody had five years ago.',
    used: 'Argus probes AI agents with whole attack families of these before deployment. VantaLLM checkpoints get the same treatment.',
    href: '/projects/#argus',
  },
  {
    id: 'docker',
    name: 'Docker',
    match: ['docker'],
    what: 'Packs an app and everything it needs into one portable box that runs the same on any machine. Ends "works on my laptop" arguments.',
    used: 'Argus ships in a container so a scan runs identically on my machine, a CI runner, or yours.',
    href: '/projects/#argus',
  },
  {
    id: 'crypto',
    name: 'AES-256-GCM',
    match: ['aes-256', 'encryption'],
    what: 'A modern encryption standard: a lock for data that also detects if anyone tampered with the box.',
    used: 'Argus vaults sensitive scan artifacts with it, and I built a full encryption layer for a mental-health app at SIH 2025.',
    href: '/projects/#argus',
  },
  {
    id: 'react',
    name: 'React',
    match: ['react', 'vite'],
    what: 'The most popular library for building interactive web interfaces. Most of the apps you use daily have it somewhere.',
    used: 'Search Arena: six AI search algorithms you can watch think, race, and play against. Live on the web and built for Android.',
    href: '/projects/#search-arena',
  },
  {
    id: 'd3',
    name: 'D3.js',
    match: ['d3'],
    what: 'A library for drawing data in the browser: charts, graphs, animations. The hard-mode option that gives you full control.',
    used: "Search Arena's animated search-tree view: you literally watch the algorithm explore, step by step.",
    href: '/projects/#search-arena',
  },
  {
    id: 'firebase',
    name: 'Firebase',
    match: ['firebase'],
    what: "Google's backend-in-a-box: database, login, hosting, all managed for you so a small team can ship fast.",
    used: "Search Arena's real-time leaderboard (which I attacked myself, then locked down), my-planner's live sync, and the recommendations wall on this site.",
    href: '/projects/#search-arena',
  },
  {
    id: 'gemini',
    name: 'Gemini API',
    match: ['gemini'],
    what: "Google's LLM, callable from code. The interesting part is structured output: you hand it a schema and it must answer in valid typed JSON.",
    used: 'my-planner turns "gym at 7 then deep work" into schema-validated calendar events, and this site uses it to rank the recommendations wall.',
    href: '/projects/#my-planner',
  },
  {
    id: 'typescript',
    name: 'TypeScript / JavaScript',
    match: ['typescript', 'javascript'],
    what: 'The language every website runs on. TypeScript adds guardrails that catch mistakes before users ever see them.',
    used: 'Search Arena, and this site: the terminal you can open with ~, the mode switch, all of it hand-written, no framework bloat.',
    href: '/projects/#search-arena',
  },
  {
    id: 'bash',
    name: 'Bash / Linux',
    match: ['bash', 'linux', 'jq'],
    what: 'The language of the Linux command line. Gluing tools together with it is half of real-world security and infra work.',
    used: 'ReconForge is built on it, and Linux is where I live: training runs, CTFs, everything.',
    href: '/projects/#reconforge',
  },
  {
    id: 'ci',
    name: 'Git & CI/CD',
    match: ['git', 'github actions', 'ci/cd', 'ci'],
    what: 'Version control plus robots that automatically test and deploy your code every time you change it.',
    used: "VantaLLM's full test suite runs green on every push. This site deploys itself the same way.",
    href: '/projects/#vantallm',
  },
  {
    id: 'sql',
    name: 'SQL',
    match: ['sql'],
    what: 'The language for asking databases questions. Also, when handled badly by a website, a classic way in for attackers.',
    used: 'Both sides: database coursework at 9.42 CGPA, and SQL-injection testing on live VAPT engagements.',
    href: '/work/',
  },
];

export function findSkill(label: string): Skill | undefined {
  const l = label.toLowerCase();
  return skills.find((s) => s.match.some((m) => l.includes(m)));
}
