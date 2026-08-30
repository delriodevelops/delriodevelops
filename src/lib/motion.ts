/**
 * Motion helpers.
 *
 * The site leans hard on GSAP, Lenis smooth scroll, a custom cursor and a
 * marquee. All of that is vestibular-hostile, so every animated surface checks
 * this before starting. The CSS side of the switch lives in globals.css.
 */

/** True when the visitor asked their OS to reduce motion. */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Subscribe to changes in the reduced-motion preference. Returns an unsubscribe. */
export function onReducedMotionChange(handler: (reduced: boolean) => void): () => void {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  const listener = (event: MediaQueryListEvent) => handler(event.matches);
  query.addEventListener('change', listener);
  return () => query.removeEventListener('change', listener);
}
