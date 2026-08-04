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
    /* private browsing, fine */
  }
  sweep();
  document.dispatchEvent(new CustomEvent<Mode>('modechange', { detail: mode }));
}

// a brief wash of the new accent across the page, the light changing
function sweep(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let el = document.getElementById('mode-sweep');
  if (!el) {
    el = document.createElement('div');
    el.id = 'mode-sweep';
    el.setAttribute('aria-hidden', 'true');
    document.body.appendChild(el);
  }
  el.classList.remove('on');
  void el.offsetWidth; // restart the animation
  el.classList.add('on');
}

export function toggleMode(): Mode {
  const next: Mode = getMode() === 'build' ? 'break' : 'build';
  setMode(next);
  return next;
}
