// Journey / achievements · rendered as shell history: dated one-liners.
// Chronological, oldest first (history reads top-down).

export interface HistoryEntry {
  date: string;
  cmd: string; // the fake shell command
  note: string; // what actually happened
  kind: 'education' | 'achievement' | 'work' | 'cert';
}

export const journey: HistoryEntry[] = [
  { date: '2021', cmd: './boards --icse', note: 'High school (ICSE) · 98.25%, City Montessori School', kind: 'education' },
  { date: '2023', cmd: './boards --isc', note: 'Senior secondary (ISC) · 94.25%', kind: 'education' },
  { date: '2023', cmd: 'ssh aaron@kiit.ac.in', note: 'B.Tech CSE begins · KIIT, Bhubaneswar', kind: 'education' },
  { date: 'Feb 2024', cmd: 'ssb --tes51', note: 'Service Selection Board · AIR 83, TES-51 merit list', kind: 'achievement' },
  { date: 'May 2024', cmd: 'cd ~/panacea-infosec', note: 'Security testing internship · 20+ VAPTs', kind: 'work' },
  { date: 'Sep 2024', cmd: 'join iot-lab --kiit', note: 'IoT Lab · cybersecurity member, later Lab Coordinator', kind: 'work' },
  { date: 'Mar 2025', cmd: 'ctf hacktify', note: 'Top 500 of 4,000+ teams · Hacktify Battle, TryHackMe', kind: 'achievement' },
  { date: 'Apr 2025', cmd: 'ctf pentathon --48h', note: 'AIR 45 · top 0.90% globally, national government CTF', kind: 'achievement' },
  { date: '2025', cmd: 'report yatra --xss', note: 'Disclosed reflected XSS in Yatra’s production AI chatbot · remediated', kind: 'achievement' },
  { date: 'Feb 2026', cmd: 'ine --exam ejptv2', note: 'eJPTv2 · 91%, INE Security', kind: 'cert' },
  { date: 'Mar 2026', cmd: 'git init vantallm', note: 'SwiftSafe internship · 567M MoE LLM, my architecture, trained from scratch', kind: 'work' },
  { date: 'May 2026', cmd: 'sap --certify', note: 'SAP Certified Backend Developer · Cloud Application Programming', kind: 'cert' },
  { date: 'Jun 2026', cmd: 'cd ~/dbs-tech', note: 'DBS Tech India · SEED Technology Apprentice', kind: 'work' },
  { date: 'Aug 2026', cmd: 'logout iot-lab', note: 'IoT Lab tenure complete · handed the keys to the juniors', kind: 'work' },
];
