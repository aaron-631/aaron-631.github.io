// Single source of truth for identity, links, and hard numbers.
// Written in my voice. If it sounds like a resume, rewrite it.

export const profile = {
  name: 'Aaron Chakraborty',
  title: 'AI/ML Security Engineer',
  tagline: 'Systems Builder · B.Tech CSE',
  location: 'Bhubaneswar, India',
  email: 'aaronchakraborty631@gmail.com',
  education: {
    degree: 'B.Tech Computer Science',
    school: 'KIIT, Bhubaneswar',
    years: '2023–2027',
    cgpa: '9.42',
  },
  // Hero copy per mode. Same person, two lenses.
  hero: {
    build: {
      headline: 'I train language models from scratch.',
      sub: "I'm 20. Not fine-tuning GPT, not wrapping an API — a 567M-parameter MoE transformer I wrote layer by layer in PyTorch, trained on an A100 I had to fight to get access to.",
    },
    break: {
      headline: 'Then I attack them.',
      sub: "Prompt injection, jailbreaks, data extraction. I found an XSS in a real company's production AI chatbot and told them before anyone else did. Then I built a tool so it doesn't happen to the next one.",
    },
  },
  chips: [
    { label: '567M params trained', href: '#vantallm' },
    { label: 'AIR 45 · top 0.90%', href: '#journey' },
    { label: '1 production XSS disclosed', href: '#disclosure' },
  ],
  // The human bit. This is the part recruiters actually remember.
  about: [
    "I got into tech because I refused to be the average college guy. That's genuinely the whole origin story — I wanted to be hard to replace, so I picked the two hardest things I could find: building AI systems from nothing, and breaking the ones everyone else ships.",
    "Before any of this I was headed for the Indian Army. I cleared the Service Selection Board with an All India Rank of 83 — five days of them trying to find out who you really are. Didn't join, but the discipline stuck. It's why I train models at 2am and still make it to an 8am class.",
    "On a free day you'll find me with coffee and a David Goggins podcast. I post my failures on X along with the wins — the OOM crashes, the NCCL hangs, the 500GB fp32 partition that nobody warns you about. Documenting raw engineering from the trenches, as the bio says.",
  ],
  links: {
    github: 'https://github.com/aaron-631',
    linkedin: 'https://www.linkedin.com/in/aaron-chakraborty-309197287',
    x: 'https://x.com/AaronChakr47884',
    tryhackme: 'https://tryhackme.com/p/aaronchakraborty',
    email: 'mailto:aaronchakraborty631@gmail.com',
    resume: '/resume.pdf',
    source: 'https://github.com/aaron-631/aaron-631.github.io',
  },
} as const;

// The hard-numbers strip. Mono font, no icons, every figure real.
export const stats = [
  { value: '9.42', label: 'CGPA · KIIT CSE' },
  { value: '30,000', label: 'training steps · A100 20GB' },
  { value: '86/86', label: 'system tests passing' },
  { value: '20+', label: 'VAPTs conducted' },
  { value: '91%', label: 'eJPTv2 · INE Security' },
] as const;

export type Mode = 'build' | 'break';
