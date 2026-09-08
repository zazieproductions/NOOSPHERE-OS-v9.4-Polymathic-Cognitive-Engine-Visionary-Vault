import { useEffect } from 'react';

type KeyHandler = (event: KeyboardEvent) => void;

/**
 * Declarative global keydown listener with cleanup.
 */
export function useKeydown(key: string, handler: KeyHandler, deps: unknown[] = []): void {
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === key || (key.includes('+') && checkCombo(e, key))) {
        handler(e);
      }
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

function checkCombo(e: KeyboardEvent, combo: string): boolean {
  const parts = combo.toLowerCase().split('+');
  const key = parts.pop();
  if (!key) return false;
  const hasMeta = parts.includes('meta') || parts.includes('cmd');
  const hasCtrl = parts.includes('ctrl');
  const hasShift = parts.includes('shift');
  const hasAlt = parts.includes('alt');

  if (hasMeta && !(e.metaKey || e.ctrlKey)) return false;
  if (hasCtrl && !e.ctrlKey) return false;
  if (hasShift && !e.shiftKey) return false;
  if (hasAlt && !e.altKey) return false;

  return e.key.toLowerCase() === key;
}

export function useGlobalShortcut(combo: string, handler: () => void): void {
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      const normalized = combo.toLowerCase();
      if (normalized === 'cmd+k' || normalized === 'ctrl+k') {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          handler();
        }
      } else if (normalized === 'escape' && e.key === 'Escape') {
        handler();
      }
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [combo, handler]);
}
