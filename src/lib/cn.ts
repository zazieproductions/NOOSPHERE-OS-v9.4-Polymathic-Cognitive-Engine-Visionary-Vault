/**
 * Lightweight className merge utility.
 * Avoids extra dependency; Tailwind-aware merging is handled by template literals.
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
