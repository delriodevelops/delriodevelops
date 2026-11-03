'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { gsap } from 'gsap';

const CELLS = Array.from({ length: 84 });

// Matches the entrance grid each destination drops, so cover and reveal share a colour
const toneFor = (path) => {
  if (/^\/projects\/[^/]+/.test(path)) return '#d71f14';
  if (/^\/blog\/[^/]+/.test(path)) return '#f1eee6';
  return '#0a0a0a';
};

// Only Gridbreak routes open with an entrance grid; admin, CV and others navigate plainly
const hasEntrance = (path) =>
  path === '/' || /^\/(projects|products)(\/|$)/.test(path) || (/^\/blog(\/|$)/.test(path) && path !== '/blog/admin');

const isPlainClick = (e) => e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;

/**
 * Site-wide page transition: clicking an internal link closes a block grid over the
 * screen, then navigates. The next page opens its own grid (GridbreakEnter), so the
 * cut reads as one continuous move. Lives in the root layout so it survives routes.
 */
export default function RouteCurtain() {
  const router = useRouter();
  const pathname = usePathname();
  const rootRef = useRef(null);
  const busy = useRef(false);

  useEffect(() => {
    const onClick = (e) => {
      if (busy.current || e.defaultPrevented || !isPlainClick(e)) return;
      const link = e.target.closest?.('a[href]');
      if (!link || link.target === '_blank' || link.hasAttribute('download') || link.dataset.noCurtain !== undefined) return;

      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // same page (incl. in-page anchors): let the page handle it
      if (url.pathname === window.location.pathname || !hasEntrance(url.pathname)) return;
      if (new URLSearchParams(window.location.search).get('motion') === 'off') return;

      e.preventDefault();
      e.stopPropagation();
      busy.current = true;

      const root = rootRef.current;
      const cells = root.querySelectorAll('span');
      gsap.set(root, { autoAlpha: 1 });
      const tone = toneFor(url.pathname);
      gsap.set(cells, { backgroundColor: tone, color: tone, scaleY: 0, transformOrigin: '50% 100%' });
      gsap.to(cells, {
        scaleY: 1,
        duration: 0.55,
        ease: 'power3.inOut',
        stagger: { grid: [7, 12], from: 'random', amount: 0.4 },
        onComplete: () => router.push(url.pathname + url.search + url.hash),
      });
    };

    // capture phase: runs before Next's <Link> handler so the cover plays first
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [router]);

  // New route: pages load client-side, so wait until the destination's own entrance
  // grid is on screen before lifting the curtain (or give up after 3s).
  useEffect(() => {
    if (!busy.current) return;
    const started = performance.now();
    let id;
    const check = () => {
      if (document.querySelector('.gb-loader') || performance.now() - started > 3000) {
        gsap.set(rootRef.current, { autoAlpha: 0 });
        busy.current = false;
        return;
      }
      id = requestAnimationFrame(check);
    };
    id = requestAnimationFrame(check);
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return (
    <div
      ref={rootRef}
      className="route-curtain"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        pointerEvents: 'none',
        visibility: 'hidden',
        display: 'grid',
        gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
        gridTemplateRows: 'repeat(7, minmax(0, 1fr))',
      }}
    >
      {CELLS.map((_, i) => (
        <span key={i} style={{ boxShadow: '0 0 0 1px currentColor', transform: 'scaleY(0)' }} />
      ))}
    </div>
  );
}
