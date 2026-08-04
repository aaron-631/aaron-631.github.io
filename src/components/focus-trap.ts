// Tiny focus trap for the site's modals (terminal, resume viewer, dossier).
// W3C dialog pattern: Tab cycles inside, focus returns on close.
// No dependency, ~30 lines, wired per-modal.

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select, iframe, [tabindex]:not([tabindex="-1"])';

let active: { el: HTMLElement; prev: HTMLElement | null; onKey: (e: KeyboardEvent) => void } | null = null;

export function trapFocus(el: HTMLElement): void {
  releaseFocus(); // only one modal at a time
  const prev = (document.activeElement as HTMLElement) ?? null;

  const onKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    const items = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (n) => n.offsetParent !== null || n === document.activeElement
    );
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    const current = document.activeElement as HTMLElement;
    if (e.shiftKey && (current === first || !el.contains(current))) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && (current === last || !el.contains(current))) {
      e.preventDefault();
      first.focus();
    }
  };

  document.addEventListener('keydown', onKey, true);
  active = { el, prev, onKey };
}

export function releaseFocus(): void {
  if (!active) return;
  document.removeEventListener('keydown', active.onKey, true);
  // give focus back to whatever opened the modal
  if (active.prev && document.contains(active.prev)) active.prev.focus();
  active = null;
}
