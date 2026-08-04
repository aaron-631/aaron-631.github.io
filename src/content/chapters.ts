// The story's spine, one ordered list, shared by the landing doors,
// the nav, and the prev/next chapter rails at the bottom of every page.
// Titles and hooks are per-mode: BUILD reads like a workshop tour,
// BREAK reads like a target briefing. Same doors, different guide.

export interface Chapter {
  href: string;
  idx: string;
  title: { build: string; break: string };
  hook: { build: string; break: string };
  cmd: string;
}

export const chapters: Chapter[] = [
  {
    href: '/about/',
    idx: '01',
    title: { build: 'The honest version', break: 'The guy on the other side' },
    hook: {
      build: 'SSB rank 83, a lab full of people I call family, and why I picked the hard road.',
      break: 'Know your adversary. Background, motivations, and the day the army almost got me.',
    },
    cmd: 'cat about.md',
  },
  {
    href: '/work/',
    idx: '02',
    title: { build: 'Claims & receipts', break: 'The operations log' },
    hook: {
      build: 'DBS, SwiftSafe, 20+ VAPTs, and one real bug in production. Every claim carries proof.',
      break: '20+ assessments, one production XSS a real company had to patch, all of it legal.',
    },
    cmd: 'cat work.log',
  },
  {
    href: '/projects/',
    idx: '03',
    title: { build: 'The systems', break: 'The arsenal' },
    hook: {
      build: 'VantaLLM, Argus, ReconForge. Built end-to-end, tested until boring.',
      break: 'Argus gates AI agents before they ship. ReconForge maps attack surface. VantaLLM is the practice target.',
    },
    cmd: 'ls projects/',
  },
  {
    href: '/writing/',
    idx: '04',
    title: { build: 'From the trenches', break: 'Crash reports' },
    hook: {
      build: 'I post the crashes along with the wins. The OOM errors nobody warns you about.',
      break: 'Things going wrong, documented while still annoyed. Failure is the best teacher I ever had.',
    },
    cmd: 'tail -f trenches.md',
  },
  {
    href: '/wall/',
    idx: '05',
    title: { build: 'In their words', break: "Don't take my word for it" },
    hook: {
      build: 'What people say after working with me, live, named, unedited. Add your line.',
      break: 'Independent sources, real names, zero curation. Verify me against people who were there.',
    },
    cmd: 'cat wall.log',
  },
  {
    href: '/contact/',
    idx: '06',
    title: { build: 'Run the scan', break: 'Open a channel' },
    hook: {
      build: 'Argus evaluates AI agents before deployment. This copy runs on me. Try it.',
      break: 'Every way to reach me, plus a scanner that reports on its own author. Run it.',
    },
    cmd: 'scan me',
  },
];

export function neighbors(pathname: string): { prev?: Chapter; next?: Chapter } {
  const norm = pathname.endsWith('/') ? pathname : pathname + '/';
  const i = chapters.findIndex((c) => c.href === norm);
  if (i === -1) return {};
  return { prev: chapters[i - 1], next: chapters[i + 1] };
}
