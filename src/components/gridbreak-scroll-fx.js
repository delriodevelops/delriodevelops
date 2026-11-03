import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * Scroll-linked layer shared by every page. Everything here is scrubbed — it moves
 * with the scrollbar, never on a timer. Mark elements with:
 *   data-speed="0.2"     parallax: positive lags behind the scroll, negative runs ahead
 *   data-drift="20"      horizontal drift in % of own width while crossing the viewport
 *   data-skew            skews with scroll velocity (data-skew="x" for horizontal)
 *   data-wipe            section opens from an inset frame as it scrolls in
 *   data-stretch="62,125" font width morphs between the two values while crossing
 *   data-words           words light up one by one as the paragraph is read
 *   data-zoom            image inside scales down to rest while crossing
 *   data-rotate="8"      rotates from -n to n degrees while crossing
 *
 * Call after any pins are created so trigger positions include their spacing.
 * Returns a gsap.matchMedia instance — call .revert() to clean up.
 */
export function initScrollFx(root, { forceMotion = false, lenis } = {}) {
  const mm = gsap.matchMedia(root);
  const q = gsap.utils.selector(root);
  const motionOk = forceMotion ? 'all' : '(prefers-reduced-motion: no-preference)';
  const desktopQuery = forceMotion ? '(min-width: 900px)' : `(min-width: 900px) and ${motionOk}`;

  mm.add({ desktop: desktopQuery, motion: motionOk }, (ctx) => {
    const { desktop, motion } = ctx.conditions;
    if (!motion) return;
    // phones get half the travel so nothing drifts off a narrow screen
    const amp = desktop ? 1 : 0.5;
    const crossing = (trigger) => ({ trigger, start: 'top bottom', end: 'bottom top', scrub: true });

    q('[data-speed]').forEach((el) => {
      const speed = parseFloat(el.dataset.speed) * amp;
      gsap.fromTo(
        el,
        { y: () => -speed * window.innerHeight * 0.5 },
        { y: () => speed * window.innerHeight * 0.5, ease: 'none', scrollTrigger: { ...crossing(el), invalidateOnRefresh: true } }
      );
    });

    q('[data-drift]').forEach((el) => {
      const drift = parseFloat(el.dataset.drift) * amp;
      gsap.fromTo(el, { xPercent: drift }, { xPercent: -drift, ease: 'none', scrollTrigger: crossing(el) });
    });

    q('[data-rotate]').forEach((el) => {
      const deg = parseFloat(el.dataset.rotate);
      gsap.fromTo(el, { rotate: -deg }, { rotate: deg, ease: 'none', scrollTrigger: crossing(el) });
    });

    q('[data-zoom]').forEach((el) => {
      const img = el.querySelector('img') || el;
      gsap.fromTo(img, { scale: 1.35 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom 30%', scrub: true } });
    });

    q('[data-stretch]').forEach((el) => {
      const [from, to] = el.dataset.stretch.split(',').map(Number);
      gsap.fromTo(
        el,
        { fontStretch: `${from}%` },
        { fontStretch: `${to}%`, ease: 'none', scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 35%', scrub: true } }
      );
    });

    q('[data-wipe]').forEach((el) => {
      gsap.fromTo(
        el,
        { clipPath: 'inset(12% 7% 0% 7%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 15%', scrub: true } }
      );
    });

    q('[data-words]').forEach((el) => {
      const split = SplitText.create(el, { type: 'words', wordsClass: 'gb-word' });
      gsap.fromTo(
        split.words,
        { opacity: 0.14 },
        { opacity: 1, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 50%', scrub: true } }
      );
    });

    // velocity skew: driven from Lenis' smoothed velocity so it eases back to 0 on its own
    const skewEls = q('[data-skew]');
    if (skewEls.length && lenis) {
      const setters = skewEls.map((el) =>
        gsap.quickTo(el, el.dataset.skew === 'x' ? 'skewX' : 'skewY', { duration: 0.6, ease: 'power3' })
      );
      const clampSkew = gsap.utils.clamp(-8, 8);
      const tick = () => {
        const v = clampSkew(-(lenis.velocity || 0) * 0.35);
        setters.forEach((set) => set(v));
      };
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    }
  });

  return mm;
}
