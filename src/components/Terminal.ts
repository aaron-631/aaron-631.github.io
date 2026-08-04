// Terminal 2.0, dependency-free command registry.
// One source of truth: reads the same content modules as the visual site.

import { profile, statsByMode } from '../content/profile';
import { experience } from '../content/experience';
import { projects, lab, disclosure } from '../content/projects';
import { journey } from '../content/achievements';
import { getMode, setMode, type Mode } from './mode';
import { aiEnabled, aiAsk } from '../lib/ai';

type Line = { text: string; cls?: string };

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

function projectDoc(id: string): Line[] | null {
  const p = projects.find((x) => x.id === id);
  if (!p) return null;
  return [
    { text: `# ${p.name}  [${p.status}]`, cls: 't-warn' },
    { text: p.oneliner[getMode()], cls: '' },
    { text: '' },
    ...p.points[getMode()].map((pt) => ({ text: `- ${pt}`, cls: 't-dim' })),
    { text: '' },
    { text: `stack: ${p.stack.join(' · ')}`, cls: 't-dim' },
    ...p.links.map((l) => ({ text: `→ ${l.href.replace('mailto:', '')}`, cls: 't-ok' })),
  ];
}

const FILES = [...projects.map((p) => `projects/${p.id}.md`), 'disclosures/yatra-xss.md', 'wall.log', 'resume.pdf'];
// only visible to ls -la. the console hint points here.
const HIDDEN_FILES = ['.goggins_playlist', '.ssb_diary', '.coffee_counter', '.plan'];

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
      const flags = args.filter((a) => a.startsWith('-'));
      const showHidden = flags.some((f) => f.includes('a'));
      const dir = args.find((a) => !a.startsWith('-')) ?? '';
      const pool = showHidden ? [...HIDDEN_FILES, ...FILES] : FILES;
      const matches = pool.filter((f) => f.startsWith(dir.replace(/^\.\//, '')));
      return matches.length
        ? matches.map((f) => ({ text: f, cls: f.endsWith('.pdf') ? 't-ok' : f.startsWith('.') ? 't-dim' : '' }))
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
          ...disclosure.timeline.map((t, i) => ({ text: `[${i + 1}/4] ${t.step} · ${t.note}`, cls: t.step === 'remediated' ? 't-ok' : 't-dim' })),
        ];
      if (f === 'resume.pdf') {
        window.open(profile.links.resume, '_blank');
        return [{ text: 'cat: resume.pdf is binary · opening in viewer instead.', cls: 't-dim' }];
      }
      if (f === 'wall.log') {
        setTimeout(() => (window.location.href = '/wall/'), 600);
        return [
          { text: 'tail -f wall.log, live recommendations, real names.', cls: 't-warn' },
          { text: 'opening the wall …', cls: 't-ok' },
        ];
      }
      // hidden files, rewards for the curious
      if (f === '.goggins_playlist')
        return [
          { text: '# currently on loop', cls: 't-warn' },
          { text: "1. who's gonna carry the boats", cls: 't-dim' },
          { text: '2. stay hard', cls: 't-dim' },
          { text: "3. you don't know me son", cls: 't-dim' },
          { text: 'repeat: enabled · skip: disabled', cls: 't-ok' },
        ];
      if (f === '.ssb_diary')
        return [
          { text: '# SSB TES-51 · 5 days · AIR 83', cls: 't-warn' },
          { text: 'day 1: screening. half the hall went home.', cls: 't-dim' },
          { text: 'day 2-4: psychology, group tasks, interview. they ask who you are until you stop performing.', cls: 't-dim' },
          { text: 'day 5: conference. recommended.', cls: 't-dim' },
          { text: "didn't join. kept the discipline. it compiles on every machine.", cls: 't-ok' },
        ];
      if (f === '.coffee_counter')
        return [
          { text: 'coffees_today: redacted', cls: 't-dim' },
          { text: 'coffees_during_30k_step_run: also redacted', cls: 't-dim' },
          { text: 'regrets: 0', cls: 't-ok' },
        ];
      if (f === '.plan')
        return [
          { text: '1. release a cybersecurity base model people actually use', cls: 't-dim' },
          { text: '2. make AI systems safer than I found them', cls: 't-dim' },
          { text: '3. never become the average college guy', cls: 't-warn' },
        ];
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
      if (!map[key]) return [{ text: `open: unknown target '${esc(key)}' · try: ${Object.keys(map).join(' | ')}`, cls: 't-crit' }];
      window.open(map[key], '_blank');
      return [{ text: `opening ${key} …`, cls: 't-ok' }];
    },
  },
  mode: {
    desc: 'mode build | break · switch the lens',
    run: (args) => {
      const m = args[0] as Mode;
      if (m !== 'build' && m !== 'break') return [{ text: `current mode: ${getMode()} · usage: mode build|break`, cls: 't-dim' }];
      setMode(m);
      return [{ text: `mode set to ${m}. the site just changed around you.`, cls: 't-ok' }];
    },
  },
  scan: {
    desc: 'scan me · run the Argus recruiter evaluation',
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
    desc: 'the hard numbers (changes with mode)',
    run: () => statsByMode[getMode()].map((s) => ({ text: `${s.value.padEnd(8)} ${s.label}`, cls: '' })),
  },
  work: {
    desc: 'experience summary',
    run: () =>
      experience.flatMap((r) => [
        { text: `${r.dates} · ${r.role} @ ${r.org}`, cls: 't-warn' },
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
      { text: `  |  o   o  |  Kernel   dual_use: build+break`, cls: 't-warn' },
      { text: `  |_________|  Shell    ${getMode() === 'build' ? 'aaron@build' : 'aaron@break'}:~$`, cls: 't-warn' },
      { text: '               Uptime   since 2005 · no planned downtime', cls: '' },
      { text: '               GPU      A100-20GB (borrowed, 30k steps)', cls: '' },
      { text: '               Audio    david goggins podcasts, on loop', cls: '' },
      { text: '               Theme    phosphor-amber on ink', cls: '' },
    ],
  },
  lab: {
    desc: 'smaller experiments',
    run: () => lab.map((l) => ({ text: `${l.name} · ${l.note}`, cls: 't-dim' })),
  },
  man: {
    desc: 'man aaron · the manual page',
    run: (args) => {
      if ((args[0] ?? '') !== 'aaron')
        return [
          { text: "'man' shows the manual for a command. the only manual here is mine:", cls: 't-dim' },
          { text: '  try: man aaron', cls: '' },
        ];
      return [
        { text: 'AARON(1)                    Human Manual                    AARON(1)', cls: 't-dim' },
        { text: '' },
        { text: 'NAME', cls: 't-warn' },
        { text: '  aaron - builds AI systems, then breaks them' },
        { text: '' },
        { text: 'SYNOPSIS', cls: 't-warn' },
        { text: '  aaron [--build | --break] [--coffee] target' },
        { text: '' },
        { text: 'DESCRIPTION', cls: 't-warn' },
        { text: '  Designs LLM architectures and trains them from scratch (567M params, real run).', cls: 't-dim' },
        { text: '  Finds security holes in AI products before someone worse does.', cls: 't-dim' },
        { text: '  Documents failures in public. Answers email fast.', cls: 't-dim' },
        { text: '' },
        { text: 'BUGS', cls: 't-warn' },
        { text: '  Cannot stop mid-project. Will not stop mid-project.', cls: 't-dim' },
        { text: '' },
        { text: 'SEE ALSO', cls: 't-warn' },
        { text: '  whoami(1), history(1), scan me(1)', cls: 't-dim' },
      ];
    },
  },
  hello: {
    desc: '',
    hidden: true,
    run: () =>
      aiEnabled()
        ? [
            { text: 'hey! this shell has an AI brain wired in, ask it anything real.', cls: 't-warn' },
            { text: "try: ask what did aaron actually train? · ask why should i hire him?", cls: 't-dim' },
            { text: "the classics still work: 'whoami' · 'scan me' · 'ls -la'", cls: '' },
          ]
        : [
            { text: "hey! you're talking to a small shell i wrote, not an AI.", cls: 't-warn' },
            { text: 'it understands plain words though. try asking:', cls: 't-dim' },
            { text: "  'who are you'  ·  'show me projects'  ·  'skills'  ·  'scan me'", cls: '' },
            { text: 'or tap one of the suggestion pills below the input.', cls: 't-dim' },
          ],
  },
  ask: {
    desc: 'ask the AI anything about aaron',
    run: (args) =>
      aiEnabled()
        ? args.length
          ? [] // actually answered asynchronously in wireTerminal
          : [{ text: 'usage: ask <your question> · e.g. ask what has aaron actually shipped?', cls: 't-dim' }]
        : [
            { text: 'the AI brain is offline in this build.', cls: 't-dim' },
            { text: "the shell still knows plenty: try 'whoami', 'work', 'history', 'scan me'.", cls: '' },
          ],
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
  goggins: {
    desc: '',
    hidden: true,
    run: () => [
      { text: 'WHO IS GONNA CARRY THE BOATS?', cls: 't-crit' },
      { text: '(volume warning acknowledged. back to work.)', cls: 't-dim' },
    ],
  },
  coffee: {
    desc: '',
    hidden: true,
    run: () => [
      { text: 'brewing …', cls: 't-dim' },
      { text: 'c[_] ready. training run may now continue.', cls: 't-ok' },
    ],
  },
  nmap: {
    desc: '',
    hidden: true,
    run: () => [
      { text: 'Starting Nmap ( https://nmap.org )', cls: 't-dim' },
      { text: 'PORT     STATE  SERVICE', cls: 't-dim' },
      { text: '22/tcp   open   work-ethic', cls: 't-ok' },
      { text: '443/tcp  open   secure-by-default', cls: 't-ok' },
      { text: '1337/tcp open   ctf-mode', cls: 't-warn' },
      { text: '8080/tcp closed ego', cls: 't-dim' },
      { text: 'Nmap done: 1 host up. this candidate has no closed ports that matter.', cls: 't-ok' },
    ],
  },
  ping: {
    desc: '',
    hidden: true,
    run: (args) => [
      { text: `PING ${esc(args[0] ?? 'aaron')}, 64 bytes: icmp_seq=1 ttl=2005 time=fast`, cls: 't-dim' },
      { text: 'reply: awake. probably training something.', cls: 't-ok' },
    ],
  },
  uptime: {
    desc: '',
    hidden: true,
    run: () => [
      { text: 'up since 2005 · load average: high, sustainable, chosen', cls: 't-ok' },
    ],
  },
  iotlab: {
    desc: '',
    hidden: true,
    run: () => [
      { text: '# IoT Lab, KIIT, the family', cls: 't-warn' },
      { text: '30+ members · CTFs · showcase days · onboarding juniors', cls: 't-dim' },
      { text: 'they saw the failed demos before X saw the wins.', cls: 't-dim' },
      { text: 'role: lab coordinator, sep 2024 – aug 2026 (the tee still has my name on the back)', cls: 't-ok' },
    ],
  },
};

export function execute(input: string): Line[] | 'CLEAR' {
  const raw = input.trim();
  const parts = raw.split(/\s+/);
  const name = (parts[0] ?? '').toLowerCase();
  if (!name) return [];
  const cmd = commands[name];
  if (!cmd) {
    // be kind to people who talk to it like a person, most visitors will
    const alias = naturalAlias(raw.toLowerCase());
    if (alias) {
      return [
        { text: `(interpreting that as: ${alias})`, cls: 't-dim' },
        ...(execute(alias) as Line[]),
      ];
    }
    return [
      { text: `bash: ${esc(name)}: command not found`, cls: 't-crit' },
      { text: "type 'help' for the list, or just ask in plain words. i try to understand.", cls: 't-dim' },
    ];
  }
  return cmd.run(parts.slice(1));
}

// plain-English → command. no AI, just honest pattern matching.
function naturalAlias(q: string): string | null {
  if (/^(hi|hii+|hello|hey|yo|namaste|sup)\b/.test(q)) return 'hello';
  if (/who are you|about (you|aaron)|tell me about/.test(q)) return 'whoami';
  if (/project|what.*(built|made)/.test(q)) return 'ls projects/';
  if (/resume|cv\b/.test(q)) return 'open resume';
  if (/experience|work|job|intern/.test(q)) return 'work';
  if (/contact|email|reach|hire/.test(q)) return 'sudo hire aaron';
  if (/skill|stack|tools|tech/.test(q)) return 'man aaron';
  if (/scan|evaluate|recruit/.test(q)) return 'scan me';
  if (/stat|number|proof/.test(q)) return 'stats';
  if (/story|journey|history|life/.test(q)) return 'history';
  if (/recommend|testimonial|review|wall|what.*people.*say/.test(q)) return 'cat wall.log';
  if (/secret|easter|hidden|egg/.test(q)) return 'ls -la';
  if (/joke|fun/.test(q)) return 'goggins';
  return null;
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

// ── shared UI wiring, used by the overlay (every page) and the contact embed ──
export function wireTerminal(outId: string, inId: string): void {
  const out = document.getElementById(outId);
  const input = document.getElementById(inId) as HTMLInputElement | null;
  if (!out || !input) return;
  if (input.dataset.wired) return; // overlay persists across page turns, wire once
  input.dataset.wired = '1';
  const hist: string[] = [];
  let hi = -1;

  const promptStr = () => `${getMode() === 'build' ? 'aaron@build' : 'aaron@break'}:~$`;

  function print(lines: Line[]) {
    for (const l of lines) {
      const p = document.createElement('p');
      p.className = l.cls ?? '';
      p.textContent = l.text || ' ';
      p.style.whiteSpace = 'pre-wrap';
      out!.appendChild(p);
    }
    out!.scrollTop = out!.scrollHeight;
  }

  print([
    { text: 'VantaShell v2.0', cls: 't-warn' },
    { text: "type help for commands · or just ask in plain words ('who are you')", cls: 't-dim' },
    { text: 'never used a terminal? tap the pills below the input. that counts.', cls: 't-dim' },
    { text: '' },
  ]);

  function run(v: string) {
    if (v.trim()) {
      hist.unshift(v);
      hi = -1;
    }
    print([{ text: `${promptStr()} ${v}`, cls: 't-prompt' }]);
    input!.value = '';

    // ── the AI path: `ask …`, or any plain-words question the pattern
    //    matcher can't place. async, with a visible thinking line. ──
    const raw = v.trim();
    const first = (raw.split(/\s+/)[0] ?? '').toLowerCase();
    const isAsk = first === 'ask' && raw.length > 4;
    const isFreeform =
      aiEnabled() && raw.length > 2 && !commands[first] && !naturalAlias(raw.toLowerCase());
    if (aiEnabled() && (isAsk || isFreeform)) {
      const question = isAsk ? raw.slice(4) : raw;
      const p = document.createElement('p');
      p.className = 't-dim';
      p.textContent = 'thinking …';
      out!.appendChild(p);
      out!.scrollTop = out!.scrollHeight;
      aiAsk(question).then((ans) => {
        p.remove();
        print(
          ans
            ? [
                ...ans.split('\n').map((line) => ({ text: line, cls: '' })),
                { text: '- gemini, reading aaron’s receipts · verify anything at /work/', cls: 't-dim' },
              ]
            : [
                { text: 'the AI brain timed out, deterministic me takes over:', cls: 't-dim' },
                ...(execute('whoami') as Line[]),
              ]
        );
      });
      return;
    }

    const res = execute(v);
    if (res === 'CLEAR') out!.innerHTML = '';
    else print(res);
  }

  // command chips near this terminal inject straight into it
  input.closest('.pane')?.parentElement?.querySelectorAll<HTMLButtonElement>('.cmd-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      run(chip.dataset.cmd ?? chip.textContent ?? '');
      input.focus();
    });
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      run(input.value);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const c = complete(input.value);
      if (c) input.value = c;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (hi < hist.length - 1) input.value = hist[++hi];
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      input.value = hi > 0 ? hist[--hi] : ((hi = -1), '');
    }
  });
}
