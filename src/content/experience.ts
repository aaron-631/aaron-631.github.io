// Experience — newest first. Written like I'd tell it, not like a resume bullet.

export interface Role {
  role: string;
  org: string;
  dates: string;
  where: string;
  featured?: boolean;
  points: string[];
  receipt?: string; // the one line that proves it
}

export const experience: Role[] = [
  {
    role: 'Technology Apprentice — SEED',
    org: 'DBS Tech India',
    dates: 'Jun 2026 — present',
    where: 'Remote',
    featured: true,
    points: [
      "Got picked for DBS's flagship SEED apprenticeship out of a national pool. Still a bit surreal.",
      'Day to day I work on digital transformation and infrastructure resilience inside an actual global bank — systems where downtime means headlines.',
    ],
    receipt: 'flagship national apprenticeship — global bank',
  },
  {
    role: 'AI/ML Research Intern',
    org: 'SwiftSafe · cybersecurity AI startup',
    dates: 'Mar 2026 — Jun 2026',
    where: 'Remote',
    featured: true,
    points: [
      'Owned one AI system end-to-end: a 567M-parameter Mixture-of-Experts transformer, designed and trained from scratch. PyTorch, DeepSpeed ZeRO-2, 16 experts with top-2 routing, GQA, RoPE, my own tokenizer.',
      'Served it with FastAPI on A100 infrastructure and built the adversarial eval pipelines that beat it up continuously.',
      'Wrote the whole journey up on X and LinkedIn as it happened — the wins and the crashes. The training thread crossed 7,800 impressions.',
    ],
    receipt: 'param_count = 567,068,416 — exact, not estimated',
  },
  {
    role: 'Lab Coordinator',
    org: 'IoT Lab, KIIT',
    dates: 'Sep 2024 — present',
    where: 'KIIT, Bhubaneswar',
    points: [
      'I keep a 30+ member lab running — demos, showcases, onboarding new recruits.',
      'Organized a couple of CTFs and spend a lot of time mentoring juniors who remind me of me two years ago.',
    ],
    receipt: '30+ members · 2+ CTFs organized',
  },
  {
    role: 'Cyber Security & AI/ML Intern',
    org: 'The Red Users',
    dates: 'Dec 2024 — Jan 2025',
    where: 'Remote',
    points: [
      'Threat analysis and traffic monitoring with Wireshark; built layered defenses against the usual suspects — SQLi and XSS.',
    ],
  },
  {
    role: 'Security Testing Intern',
    org: 'Panacea Infosec Pvt Ltd',
    dates: 'May 2024 — Jul 2024',
    where: 'Delhi',
    points: [
      'My first real security job, second year of college. Ran 20+ vulnerability assessments and pentests on live client applications.',
      'Learned the unglamorous half of security: writing 10+ risk reports that a business person could actually act on. That skill has paid rent ever since.',
    ],
    receipt: '20+ VAPTs · 10+ risk reports · CVSS-mapped',
  },
  {
    role: 'Independent Security Researcher',
    org: 'Bug bounty / vulnerability research',
    dates: '2024 — present',
    where: 'Remote',
    points: [
      "Found a reflected XSS in Yatra.com's Diya AI chatbot — a real bug on a platform millions use. Reported it quietly, they acknowledged it, fixed it. That's the whole job done right.",
      'Ongoing hunting across HackerOne and Bugcrowd programs: XSS, IDOR, SSRF, SQLi.',
    ],
    receipt: 'production disclosure: reported → acknowledged → remediated',
  },
];
