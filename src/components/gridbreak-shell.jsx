'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { initPageMotion } from './gridbreak-page-motion';
import { initScrollFx } from './gridbreak-scroll-fx';
import { identity, socials } from '../data/profile';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const GRID_CELLS = Array.from({ length: 84 });

// City shown next to the local clock (the clock itself runs on Spain's timezone)
export const CITY = identity.location.en.split(',')[0];

export const SOCIALS = [
  { label: 'LinkedIn', href: socials.linkedin },
  { label: 'GitHub', href: socials.github },
  { label: 'X / Twitter', href: socials.twitter },
];

// Links used on every page except home, which scrolls in place instead
export const SITE_LINKS = [
  { id: 'work', label: 'Work', href: '/#work' },
  { id: 'projects', label: 'Projects', href: '/projects' },
  { id: 'products', label: 'Products', href: '/products' },
  { id: 'notes', label: 'Notes', href: '/blog' },
  { id: 'contact', label: 'Contact', href: '/#contact' },
];

// The site is motion-first: the choreography always runs, even when the OS asks for
// reduced motion. ?motion=off is the escape hatch that shows the static version.
const motionParam = () =>
  typeof window === 'undefined' ? null : new URLSearchParams(window.location.search).get('motion');

export const forceMotion = () => motionParam() !== 'off';

export const prefersReducedMotion = () => motionParam() === 'off';

const localTime = () =>
  new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit' }).format(new Date());

export function useLocalClock() {
  const [clock, setClock] = useState('');
  useEffect(() => {
    setClock(localTime());
    const id = setInterval(() => setClock(localTime()), 30000);
    return () => clearInterval(id);
  }, []);
  return clock;
}

/**
 * Smooth scroll wired into GSAP's ticker so ScrollTrigger and Lenis share one clock.
 * Starts stopped when `startStopped` is true (home waits for its intro).
 */
export function useLenis({ startStopped = false } = {}) {
  const lenisRef = useRef(null);

  useEffect(() => {
    // low lerp = heavy, trailer-like glide; the wheel moves a bit less per notch
    const lenis = new Lenis({
      lerp: 0.06,
      wheelMultiplier: 0.85,
      smoothTouch: false,
    });
    lenisRef.current = lenis;
    if (startStopped) lenis.stop();

    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [startStopped]);

  return lenisRef;
}

/**
 * Inner-page wiring: smooth scroll + data-gb-* reveals, built once the entrance
 * grid has dropped and the page's data is on screen. Rebuilt when `deps` change.
 */
export function useGridbreakPage(rootRef, { ready = true, deps = [] } = {}) {
  const lenisRef = useLenis();
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!entered || !ready || !rootRef.current) return;
    let mm;
    let fx;
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      const force = forceMotion();
      mm = initPageMotion(rootRef.current, { forceMotion: force });
      fx = initScrollFx(rootRef.current, { forceMotion: force, lenis: lenisRef.current });
      ScrollTrigger.refresh();
    });
    return () => {
      cancelled = true;
      fx?.revert();
      mm?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entered, ready, ...deps]);

  return { lenisRef, entered, onEntered: () => setEntered(true) };
}

/** Red scroll-progress hairline pinned to the top of the viewport. */
export function GridbreakProgress() {
  const ref = useRef(null);
  useEffect(() => {
    const tween = gsap.to(ref.current, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: true },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);
  return <div className="gb-progress" ref={ref} aria-hidden="true" />;
}

/**
 * Route entrance: a block grid covering the screen drops away.
 * Calls onDone when the page is uncovered.
 */
export function GridbreakEnter({ onDone, tone = 'ink' }) {
  const ref = useRef(null);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      gsap.set(el, { autoAlpha: 0 });
      doneRef.current?.();
      return;
    }
    const tl = gsap
      .timeline({ onComplete: () => doneRef.current?.() })
      .to(el.querySelectorAll('.gb-loader-cell'), {
        scaleY: 0,
        duration: 0.6,
        ease: 'power3.inOut',
        stagger: { grid: [7, 12], from: 'random', amount: 0.45 },
      })
      .set(el, { autoAlpha: 0 });
    return () => tl.kill();
  }, []);

  return (
    <div className={`gb-loader gb-loader--${tone}`} ref={ref} aria-hidden="true">
      <div className="gb-loader-grid">
        {GRID_CELLS.map((_, i) => (
          <span key={i} className="gb-loader-cell" />
        ))}
      </div>
    </div>
  );
}

/**
 * Fixed top navigation. `onLinkClick(link, event)` lets home intercept clicks to
 * scroll in place; elsewhere links navigate normally.
 */
export function GridbreakNav({ links = SITE_LINKS, active, onLinkClick, onLogoClick, lenisRef }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const wasOpen = useRef(false);
  const clock = useLocalClock();

  // Lock scroll while the menu is open; only touch Lenis on open/close transitions
  // so a page that keeps scroll stopped (home intro) is left alone on mount.
  useEffect(() => {
    const lenis = lenisRef?.current;
    if (!lenis || wasOpen.current === isMenuOpen) return;
    wasOpen.current = isMenuOpen;
    if (isMenuOpen) lenis.stop();
    else lenis.start();
  }, [isMenuOpen, lenisRef]);

  const handle = (link) => (e) => {
    setIsMenuOpen(false);
    onLinkClick?.(link, e);
  };

  const year = String(new Date().getFullYear()).slice(2);

  return (
    <>
      <header className="gb-nav gb-mono">
        <Link
          href="/"
          onClick={(e) => {
            setIsMenuOpen(false);
            onLogoClick?.(e);
          }}
        >
          CDR ©{year}
        </Link>
        <nav className="gb-nav-links" aria-label="Sections">
          {links.map((link, i) => (
            <Link
              key={link.id}
              href={link.href}
              onClick={handle(link)}
              className={`gb-nav-link ${active === link.id ? 'is-active' : ''}`}
              aria-current={active === link.id ? 'page' : undefined}
            >
              {link.label}
              <sup>0{i + 1}</sup>
            </Link>
          ))}
        </nav>
        <div className="gb-nav-right">
          <span className="gb-nav-clock">{CITY} {clock}</span>
          <span className="gb-nav-clock">
            <span className="gb-dot" />
            Available
          </span>
          <button className="gb-menu-btn gb-mono" onClick={() => setIsMenuOpen(true)} aria-expanded={isMenuOpen}>
            Menu +
          </button>
        </div>
      </header>

      <div className={`gb-menu ${isMenuOpen ? 'is-open' : ''}`} aria-hidden={!isMenuOpen}>
        <div className="gb-mono" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>CDR — Index</span>
          <button className="gb-menu-btn gb-mono" style={{ display: 'inline-flex' }} onClick={() => setIsMenuOpen(false)}>
            Close ×
          </button>
        </div>
        <nav className="gb-menu-list" aria-label="Mobile">
          {links.map((link, i) => (
            <Link key={link.id} href={link.href} onClick={handle(link)} tabIndex={isMenuOpen ? 0 : -1}>
              {link.label}
              <span className="gb-mono">0{i + 1}</span>
            </Link>
          ))}
        </nav>
        <a className="gb-mono" href="mailto:hello@iamdelrio.com" tabIndex={isMenuOpen ? 0 : -1}>
          hello@iamdelrio.com
        </a>
      </div>
    </>
  );
}

/** Compact red contact block used to close every inner page. */
export function GridbreakFooter({ lenisRef, children }) {
  const clock = useLocalClock();
  const toTop = () => {
    if (lenisRef?.current) lenisRef.current.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="gb-contact gb-contact--compact" data-wipe>
      {children}
      <h2 className="gb-contact-title gb-cx" data-skew>
        Let&apos;s talk
      </h2>
      <div className="gb-contact-row">
        <a href="mailto:hello@iamdelrio.com" className="gb-email gb-wx">
          hello@iamdelrio.com
        </a>
      </div>
      <footer className="gb-footer gb-mono">
        <div>
          <p style={{ margin: '0 0 10px', opacity: 0.75 }}>Social</p>
          <ul>
            {SOCIALS.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p style={{ margin: '0 0 10px', opacity: 0.75 }}>Pages</p>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/projects">Projects</Link>
            </li>
            <li>
              <Link href="/products">Products</Link>
            </li>
            <li>
              <Link href="/blog">Notes</Link>
            </li>
          </ul>
        </div>
        <div>
          <p style={{ margin: '0 0 10px', opacity: 0.75 }}>Local time</p>
          <p style={{ margin: 0 }}>{CITY} — {clock}</p>
          <p style={{ margin: 0 }}>© {new Date().getFullYear()} Christian Del Río</p>
        </div>
        <button className="gb-btn gb-footer-top" onClick={toTop}>
          Back to top ↑
        </button>
      </footer>
    </section>
  );
}

/** Image that follows the cursor over elements carrying data-image (desktop only). */
export function useCursorPreview(rootRef, deps = []) {
  const previewRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const preview = previewRef.current;
    if (!root || !preview || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const img = preview.querySelector('img');
    const xTo = gsap.quickTo(preview, 'x', { duration: 0.5, ease: 'power3' });
    const yTo = gsap.quickTo(preview, 'y', { duration: 0.5, ease: 'power3' });

    const onMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };
    const onOver = (e) => {
      const item = e.target.closest?.('[data-image]');
      if (item && item.dataset.image && root.contains(item)) {
        if (img.getAttribute('src') !== item.dataset.image) img.src = item.dataset.image;
        preview.classList.add('is-visible');
      } else {
        preview.classList.remove('is-visible');
      }
    };
    const onLeave = () => preview.classList.remove('is-visible');

    root.addEventListener('mousemove', onMove);
    root.addEventListener('mouseover', onOver);
    root.addEventListener('mouseleave', onLeave);
    return () => {
      root.removeEventListener('mousemove', onMove);
      root.removeEventListener('mouseover', onOver);
      root.removeEventListener('mouseleave', onLeave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return previewRef;
}

export function CursorPreview({ previewRef }) {
  return (
    <div className="gb-note-preview" ref={previewRef} aria-hidden="true">
      <img alt="" />
    </div>
  );
}

export const formatDate = (value, opts = { day: '2-digit', month: 'short', year: 'numeric' }) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-GB', opts);
};
