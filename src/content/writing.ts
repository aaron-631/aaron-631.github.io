// Curated posts, my real voice, verbatim where possible.

export interface Post {
  quote: string;
  context: string;
  href: string;
  source: 'X' | 'LinkedIn';
}

export const writing: Post[] = [
  {
    quote:
      "I'm 20, training a custom MoE LLM from scratch. Not fine-tuning GPT. Not wrapping an API.",
    context: 'the thread that started it · 7,800+ impressions',
    href: 'https://x.com/AaronChakr47884',
    source: 'X',
  },
  {
    quote:
      'Most LLM tutorials stop too early. They end right where the real problems begin.',
    context: 'on the gap between toy checkpoints and real training runs',
    href: 'https://www.linkedin.com/in/aaron-chakraborty-309197287/recent-activity/all/',
    source: 'LinkedIn',
  },
  {
    quote:
      'Hit a wall nobody talks about: the 500GB fp32 master partition lands on-GPU with params-only offload. Here’s what actually fixes it.',
    context: 'distributed-training war stories, posted mid-crash',
    href: 'https://x.com/AaronChakr47884',
    source: 'X',
  },
  {
    quote:
      'If you build loosely with AI tools: how do you maintain actual knowledge ownership of what you build?',
    context: 'a question I keep asking, and answering with documentation',
    href: 'https://x.com/AaronChakr47884',
    source: 'X',
  },
];

export const arsenal = {
  'ai/ml systems': [
    'PyTorch', 'DeepSpeed ZeRO-2/3', 'Transformer internals · MoE, GQA, RoPE, RMSNorm, SwiGLU',
    'Distributed training · DDP, multi-node NCCL', 'BPE tokenizer design', 'Training pipelines & data sharding',
    'FastAPI inference · SSE streaming', 'Adversarial / AI evaluation',
  ],
  offensive: [
    'Web app pentesting · Burp Suite, OWASP Top 10', 'Prompt injection · jailbreak evaluation',
    'Recon · Nmap, Rustscan, Amass, FFUF', 'Exploitation · Metasploit, SQLMap, Hydra',
    'Traffic analysis · Wireshark', 'Reverse engineering · Ghidra', 'CVSS scoring & risk reporting',
  ],
  engineering: [
    'Python', 'Java', 'JavaScript / TypeScript', 'SQL', 'Bash', 'C',
    'Docker', 'Git · GitHub Actions CI/CD', 'React 18 · Vite', 'Firebase', 'D3.js', 'Linux',
  ],
} as const;

// The "now" block, what I'm actually doing these days. Feels alive, dates it.
export const now = {
  updated: 'August 2026',
  items: [
    'apprenticing at DBS Tech India (SEED)',
    'pushing VantaLLM toward a released base model',
    'placement season prep · DSA reps before breakfast',
    'still posting every failure and fix on X',
  ],
} as const;
