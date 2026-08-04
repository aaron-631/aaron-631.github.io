// BUILD/BREAK mode store. Tiny, dependency-free, idempotent.
export type Mode = 'build' | 'break';

export function getMode(): Mode {
  return (document.documentElement.dataset.mode as Mode) || 'build';
}

export function setMode(mode: Mode): void {
  document.documentElement.dataset.mode = mode;
  try {
    localStorage.setItem('mode', mode);
  } catch {
    /* private browsing — fine */
  }
  document.dispatchEvent(new CustomEvent<Mode>('modechange', { detail: mode }));
}

export function toggleMode(): Mode {
  const next: Mode = getMode() === 'build' ? 'break' : 'build';
  setMode(next);
  return next;
}
