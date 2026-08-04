// Terminal 2.0 — dependency-free command registry.
// One source of truth: reads the same content modules as the visual site.

import { profile, stats } from '../content/profile';
import { experience } from '../content/experience';
import { projects, lab, disclosure } from '../content/projects';
import { journey } from '../content/achievements';
import { getMode, setMode, type Mode } from './mode';

type Line = { text: string; cls?: string };

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

function projectDoc(id: string): Line[] | null {
  const p = projects.find((x) => x.id === id);
  if (!p) return null;
  return [
    { text: `# ${p.name}  [${p.status}]`, cls: 't-warn' },
    { text: p.oneliner[getMode()], cls: '' },
    { text: '' },
    ...p.points.map((pt) => ({ text: `- ${pt}`, cls: 't-dim' })),
    { text: '' },
    { text: `stack: ${p.stack.join(' · ')}`, cls: 't-dim' },
    ...p.links.map((l) => ({ text: `→ ${l.href.replace('mailto:', '')}`, cls: 't-ok' })),
  ];
}

const FILES = [...projects.map((p) => `projects/${p.id}.md`), 'disclosures/yatra-xss.md', 'resume.pdf'];

export interface Command {
  desc: string;
  hidden?: boolean;
  run: (args: string[]) => Line[] | 'CLEAR';
}

export const commands: Record<string, Command> = {
  help: {
    desc: 'list available commands',
    run: () => [
      { text: 'available commands:', cls: 't-dim' },
      ...Object.entries(commands)
        .filter(([, c]) => !c.hidden)
        .map(([name, c]) => ({ text: `  ${name.padEnd(12)} ${c.desc}`, cls: '' })),
      { text: '', cls: '' },
      { text: 'tip: tab completes, ↑ recalls. some commands are undocumented.', cls: 't-dim' },
    ],
  },
  whoami: {
    desc: 'who is aaron',
    run: () => [
      { text: profile.name, cls: 't-warn' },
      { text: `${profile.title} · ${profile.tagline}`, cls: '' },
      { text: `${profile.education.degree}, ${profile.education.school} (${profile.education.years}) · CGPA ${profile.education.cgpa}`, cls: 't-dim' },
      { text: 'builds the model. breaks the model. documents both.', cls: 't-dim' },
    ],
  },
  ls: {
    desc: 'list files (try: ls projects/)',
    run: (args) => {
      const dir = args[0] ?? '';
      const matches = FILES.filter((f) => f.startsWith(dir.replace(/^\.\//, '')));
      return matches.length
        ? matches.map((f) => ({ text: f, cls: f.endsWith('.pdf') ? 't-ok' : '' }))
        : [{ text: `ls: cannot access '${esc(dir)}': no such file or directory`, cls: 't-crit' }];
    },
  },
  cat: {
    desc: 'read a file (try: cat projects/vantallm.md)',
    run: (args) => {
      const f = (args[0] ?? '').replace(/^\.\//, '');
      if (!f) return [{ text: 'usage: cat <file>', cls: 't-dim' }];
      const proj = f.match(/^projects\/(.+)\.md$/);
      if (proj) return projectDoc(proj[1]) ?? [{ text: `cat: ${esc(f)}: no such file`, cls: 't-crit' }];
      if (f === 'disclosures/yatra-xss.md')
        return [
          { text: `# ${disclosure.title}`, cls: 't-warn' },
          { text: disclosure.summary, cls: '' },
          ...disclosure.timeline.map((t, i) => ({ text: `[${i + 1}/4] ${t.step} — ${t.note}`, cls: t.step === 'remediated' ? 't-ok' : 't-dim' })),
        ];
      if (f === 'resume.pdf') {
        window.open(profile.links.resume, '_blank');
        return [{ text: 'cat: resume.pdf is binary — opening in viewer instead.', cls: 't-dim' }];
      }
      return [{ text: `cat: ${esc(f)}: no such file`, cls: 't-crit' }];
    },
  },
  open: {
    desc: 'open resume | github | linkedin | x | thm',
    run: (args) => {
      const map: Record<string, string> = {
        resume: profile.links.resume,
        github: profile.links.github,
        linkedin: profile.links.linkedin,
        x: profile.links.x,
        thm: profile.links.tryhackme,
      };
      const key = args[0] ?? '';
      if (!map[key]) return [{ text: `open: unknown target '${esc(key)}' — try: ${Object.keys(map).join(' | ')}`, cls: 't-crit' }];
      window.open(map[key], '_blank');
      return [{ text: `opening ${key} …`, cls: 't-ok' }];
    },
  },
  mode: {
    desc: 'mode build | break — switch the lens',
    run: (args) => {
      const m = args[0] as Mode;
      if (m !== 'build' && m !== 'break') return [{ text: `current mode: ${getMode()} — usage: mode build|break`, cls: 't-dim' }];
      setMode(m);
      return [{ text: `mode set to ${m}. the site just changed around you.`, cls: 't-ok' }];
    },
  },
  scan: {
    desc: 'scan me — run the Argus recruiter evaluation',
    run: (args) =>
      args[0] === 'me' || args[0] === 'aaron'
        ? (document.dispatchEvent(new CustomEvent('scan:run')),
          [{ text: 'launching argus scan on target: aaron_chakraborty …', cls: 't-ok' }])
        : [{ text: 'usage: scan me', cls: 't-dim' }],
  },
  history: {
    desc: 'life as shell history',
    run: () =>
      journey.map((h, i) => ({
        text: `${String(i + 1).padStart(3)}  ${h.date.padEnd(9)} ${h.cmd}  # ${h.note}`,
        cls: h.kind === 'achievement' ? 't-warn' : h.kind === 'cert' ? 't-ok' : '',
      })),
  },
  stats: {
    desc: 'the hard numbers',
    run: () => stats.map((s) => ({ text: `${s.value.padEnd(8)} ${s.label}`, cls: '' })),
  },
  work: {
    desc: 'experience summary',
    run: () =>
      experience.flatMap((r) => [
        { text: `${r.dates} — ${r.role} @ ${r.org}`, cls: 't-warn' },
        ...(r.receipt ? [{ text: `  receipt: ${r.receipt}`, cls: 't-dim' }] : []),
      ]),
  },
  neofetch: {
    desc: 'system info',
    run: () => [
      { text: '     ___       aaron@portfolio', cls: 't-warn' },
      { text: '    /   \\      ───────────────', cls: 't-warn' },
      { text: '   /  A  \\     OS       human v21.0 (SSB-hardened)', cls: 't-warn' },
      { text: '  /_______\\    Host     KIIT · B.Tech CSE 2027', cls: 't-warn' },
      { text: `  |  ▮  ▮  |   Kernel   dual_use: build+break`, cls: 't-warn' },
      { text: `  |_________|  Shell    ${getMode() === 'build' ? 'aaron@build' : 'aaron@break'}:~$`, cls: 't-warn' },
      { text: '               Uptime   since 2005 · no planned downtime', cls: '' },
      { text: '               GPU      A100-20GB (borrowed, 30k steps)', cls: '' },
      { text: '               Audio    david goggins podcasts, on loop', cls: '' },
      { text: '               Theme    phosphor-amber on ink', cls: '' },
    ],
  },
  lab: {
    desc: 'smaller experiments',
    run: () => lab.map((l) => ({ text: `${l.name} — ${l.note}`, cls: 't-dim' })),
  },
  clear: { desc: 'clear the screen', run: () => 'CLEAR' },

  // ── undocumented ──
  sudo: {
    desc: '',
    hidden: true,
    run: (args) =>
      args.join(' ').startsWith('hire aaron')
        ? [
            { text: '[sudo] password for recruiter: ********', cls: 't-dim' },
            { text: 'access granted. drafting offer letter …', cls: 't-ok' },
            { text: '→ aaronchakraborty631@gmail.com', cls: 't-warn' },
          ]
        : [{ text: 'recruiter is not in the sudoers file. this incident will be reported.', cls: 't-crit' }],
  },
  vim: {
    desc: '',
    hidden: true,
    run: () => [
      { text: 'opening vim …', cls: 't-dim' },
      { text: 'you can check out any time you like, but you can never :q!', cls: 't-warn' },
    ],
  },
  rm: {
    desc: '',
    hidden: true,
    run: (args) =>
      args.join(' ').includes('-rf')
        ? [{ text: 'rm: cannot remove portfolio: candidate is write-protected. nice try though.', cls: 't-crit' }]
        : [{ text: 'rm: nothing worth deleting here.', cls: 't-dim' }],
  },
  exit: {
    desc: '',
    hidden: true,
    run: () => [{ text: 'there is no exit. only email: aaronchakraborty631@gmail.com', cls: 't-warn' }],
  },
};

export function execute(input: string): Line[] | 'CLEAR' {
  const parts = input.trim().split(/\s+/);
  const name = (parts[0] ?? '').toLowerCase();
  if (!name) return [];
  const cmd = commands[name];
  if (!cmd)
    return [
      { text: `bash: ${esc(name)}: command not found`, cls: 't-crit' },
      { text: "type 'help' for the list.", cls: 't-dim' },
    ];
  return cmd.run(parts.slice(1));
}

export function complete(partial: string): string | null {
  const names = Object.keys(commands).filter((c) => !commands[c].hidden);
  const [first, ...rest] = partial.split(/\s+/);
  if (rest.length === 0) {
    const hits = names.filter((n) => n.startsWith(first.toLowerCase()));
    return hits.length === 1 ? hits[0] + ' ' : null;
  }
  // complete file args for cat/ls
  if (first === 'cat' || first === 'ls') {
    const frag = rest[rest.length - 1];
    const hits = FILES.filter((f) => f.startsWith(frag));
    if (hits.length === 1) return `${first} ${hits[0]}`;
  }
  return null;
}
