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
      headline: 'I build AI systems.',
      sub: 'A 567M-parameter MoE transformer, trained from scratch on an A100. I designed the architecture and debugged every layer, which is how I learned why any of it works.',
    },
    break: {
      headline: 'Then I break them.',
      sub: 'Prompt injection, jailbreaks, data extraction. I found an XSS in a production AI chatbot, reported it quietly, and the company fixed it. Everyone won.',
    },
  },
  chips: [
    { label: '567M params trained', href: '#vantallm' },
    { label: 'AIR 45 · top 0.90%', href: '#journey' },
    { label: '1 production XSS disclosed', href: '#disclosure' },
  ],
  // The human bit. This is the part recruiters actually remember.
  about: [
    "There's no grand origin story here. Somewhere in second year I looked around, saw how easy it was to coast through college, and realised that scared me more than failing ever did. So I picked the two things that intimidated me most: training AI models from nothing, and security, breaking the things people assume are safe.",
    'Before tech I actually wanted the Indian Army. Cleared the Service Selection Board, All India Rank 83. Five days with people whose entire job is figuring out who you really are. I ended up not joining, but those five days rewired how I work. Show up, do the reps, no excuses.',
    "Everything else is pretty simple: coffee, David Goggins podcasts, and posting whatever I'm building or breaking on X. Including the failures. Especially the failures, honestly, because the OOM crashes and NCCL hangs taught me more than anything that worked first try.",
  ],
  // one closing line, re-lensed per mode
  aboutClose: {
    build: 'Right now that means one thing: getting VantaLLM to a released base model.',
    break: 'Right now that means one thing: finding the holes in AI systems before someone worse does.',
  },
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
// Different lens, different receipts.
export const statsByMode = {
  build: [
    { value: '567M', label: 'params · trained from scratch' },
    { value: '30,000', label: 'training steps · A100 20GB' },
    { value: '86/86', label: 'system tests passing' },
    { value: '9.42', label: 'CGPA · KIIT CSE' },
  ],
  break: [
    { value: '1', label: 'production XSS · disclosed & fixed' },
    { value: 'AIR 45', label: 'Pentathon 2025 · top 0.90%' },
    { value: '20+', label: 'VAPTs on live applications' },
    { value: '91%', label: 'eJPTv2 · INE Security' },
  ],
} as const;

export type Mode = 'build' | 'break';
