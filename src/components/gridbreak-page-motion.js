import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { revealFrom } from './gridbreak-motion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * Declarative scroll motion for inner pages. Mark elements with:
 *   data-gb-chars   masked chars rise when the element enters
 *   data-gb-lines   masked lines rise when the element enters
 *   data-gb-stagger children fade up one after another
 *   data-gb-clip    clip-path wipe from the bottom (scrubbed) + inner img parallax
 *   data-gb-expand  inset frame opens to full bleed while scrolling in (scrubbed)
 *   data-gb-rule    hairline draws left → right (scrubbed)
 *   data-gb-rise    each element drifts up as it enters (scrubbed)
 * Returns a gsap.matchMedia instance — call .revert() to clean up.
 */
export function initPageMotion(root, { forceMotion = false } = {}) {
  const mm = gsap.matchMedia(root);
  const q = gsap.utils.selector(root);
  const motionOk = forceMotion ? 'all' : '(prefers-reduced-motion: no-preference)';

  // Above the fold a reveal plays as the page's entrance; below it the reveal is
  // scrubbed, so it advances and rewinds with the scrollbar.
  const timing = (el, stagger) => {
    if (el.getBoundingClientRect().top < window.innerHeight * 0.85) {
      return {
        duration: 1.2,
        ease: 'expo.out',
        stagger,
        delay: Number(el.dataset.gbDelay || 0),
        scrollTrigger: { trigger: el, start: 'top 95%' },
      };
    }
    return { ease: 'none', stagger: stagger * 2, scrollTrigger: { trigger: el, start: 'top 98%', end: 'top 50%', scrub: true } };
  };

  mm.add(motionOk, () => {
    q('[data-gb-chars]').forEach((el) => {
      const split = SplitText.create(el, { type: 'chars', charsClass: 'gb-char', mask: 'chars' });
      revealFrom(split.chars, { yPercent: 110, ...timing(el, Math.min(0.04, 0.6 / split.chars.length)) });
    });

    q('[data-gb-lines]').forEach((el) => {
      const split = SplitText.create(el, { type: 'lines', linesClass: 'gb-line', mask: 'lines' });
      revealFrom(split.lines, { yPercent: 105, ...timing(el, 0.07) });
    });

    q('[data-gb-stagger]').forEach((el) => {
      revealFrom(el.children, { y: 60, autoAlpha: 0, ...timing(el, 0.08) });
    });

    q('[data-gb-clip]').forEach((el) => {
      gsap.fromTo(
        el,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 98%', end: 'top 45%', scrub: true },
        }
      );
      const img = el.querySelector('img');
      if (img) {
        gsap.fromTo(
          img,
          { yPercent: -8, scale: 1.12 },
          { yPercent: 8, scale: 1.12, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } }
        );
      }
    });

    q('[data-gb-expand]').forEach((el) => {
      gsap.fromTo(
        el,
        { clipPath: 'inset(10% 12% 10% 12%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 10%', scrub: true },
        }
      );
      const img = el.querySelector('img');
      if (img) {
        gsap.fromTo(
          img,
          { scale: 1.3 },
          { scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } }
        );
      }
    });

    q('[data-gb-rule]').forEach((el) => {
      revealFrom(el, {
        scaleX: 0,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 60%', scrub: true },
      });
    });

    // article blocks drift up into place, each tied to its own short stretch of scroll
    q('[data-gb-rise]').forEach((el) => {
      revealFrom(el, {
        y: 60,
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 100%', end: 'top 75%', scrub: true },
      });
    });

    // closing contact block: big title rises as the red block arrives
    const contactTitle = q('.gb-contact--compact .gb-contact-title')[0];
    if (contactTitle) {
      const split = SplitText.create(contactTitle, { type: 'chars', charsClass: 'gb-char', mask: 'chars' });
      revealFrom(split.chars, {
        yPercent: 110,
        ease: 'none',
        stagger: 0.05,
        scrollTrigger: { trigger: contactTitle, start: 'top 100%', end: 'top 55%', scrub: true },
      });
    }
  });

  return mm;
}
