// The story's spine — one ordered list, shared by the landing doors,
// the nav, and the prev/next chapter rails at the bottom of every page.

export interface Chapter {
  href: string;
  idx: string;
  title: string;
  hook: string;
  cmd: string;
}

export const chapters: Chapter[] = [
  {
    href: '/about/',
    idx: '01',
    title: 'The honest version',
    hook: 'SSB rank 83, a lab full of people I call family, and why I picked the hard road.',
    cmd: 'cat about.md',
  },
  {
    href: '/work/',
    idx: '02',
    title: 'Claims & receipts',
    hook: 'DBS, SwiftSafe, 20+ VAPTs, and one real bug in production. Every claim carries proof.',
    cmd: 'cat work.log',
  },
  {
    href: '/projects/',
    idx: '03',
    title: 'The systems',
    hook: 'VantaLLM, Argus, ReconForge. Built end-to-end, tested until boring.',
    cmd: 'ls projects/',
  },
  {
    href: '/writing/',
    idx: '04',
    title: 'From the trenches',
    hook: 'I post the crashes along with the wins. The OOM errors nobody warns you about.',
    cmd: 'tail -f trenches.md',
  },
  {
    href: '/wall/',
    idx: '05',
    title: 'In their words',
    hook: "What people say after working with me — live, named, unedited. Add your line.",
    cmd: 'cat wall.log',
  },
  {
    href: '/contact/',
    idx: '06',
    title: 'Run the scan',
    hook: 'Argus evaluates AI agents before deployment. This copy runs on me. Try it.',
    cmd: 'scan me',
  },
];

export function neighbors(pathname: string): { prev?: Chapter; next?: Chapter } {
  const norm = pathname.endsWith('/') ? pathname : pathname + '/';
  const i = chapters.findIndex((c) => c.href === norm);
  if (i === -1) return {};
  return { prev: chapters[i - 1], next: chapters[i + 1] };
}
