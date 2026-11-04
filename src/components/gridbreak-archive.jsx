'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import GridbreakChat from './gridbreak-chat';
import {
  CursorPreview,
  GridbreakEnter,
  GridbreakFooter,
  GridbreakNav,
  GridbreakProgress,
  useCursorPreview,
  useGridbreakPage,
} from './gridbreak-shell';
import '../app/gridbreak.css';
import '../app/gridbreak-pages.css';

const COPY = {
  project: {
    title: 'Projects',
    label: 'All projects',
    lede: 'Everything I have built: products with real users, AI tools, games and experiments.',
  },
  product: {
    title: 'Products',
    label: 'Shipped products',
    lede: 'Complete products that solve real problems. Built with care, designed to deliver value.',
  },
};

const yearOf = (p) => {
  const d = new Date(p.date || p.createdAt);
  return Number.isNaN(d.getTime()) ? '' : d.getFullYear();
};

/**
 * Shared index for /projects and /products. Items come from the server
 * (page.jsx) as `{ id, name, image, tags, href, wip, external }`.
 */
export default function GridbreakArchive({ kind, items = [] }) {
  const rootRef = useRef(null);
  const copy = COPY[kind];
  const [view, setView] = useState('list');

  const { lenisRef, onEntered } = useGridbreakPage(rootRef, { deps: [view] });
  const previewRef = useCursorPreview(rootRef, [view]);

  const hrefOf = (item) => (item.external ? item.href : `/projects/${item.id}`);
  const linkProps = (item) => (item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {});

  return (
    <div className="gb" ref={rootRef}>
      <GridbreakEnter onDone={onEntered} />
      <GridbreakProgress />
      <GridbreakNav active={kind === 'product' ? 'products' : 'projects'} lenisRef={lenisRef} />

      <main id="main">
        <header className="gb-phead gb-phead--ink">
          <div className="gb-crumbs gb-mono">
            <Link href="/">← Index</Link>
            <span>(A) — {copy.label}</span>
          </div>
          <h1 className="gb-ptitle gb-cx" data-speed="-0.35" data-skew>
            <span data-gb-chars>{copy.title}</span>
            <sup>({String(items.length).padStart(2, '0')})</sup>
          </h1>
          <div className="gb-phead-row">
            <p className="gb-lede" data-gb-lines>
              {copy.lede}
            </p>
            <div className="gb-controls">
              <nav className="gb-seg" aria-label="Archive">
                <Link href="/products" className={kind === 'product' ? 'is-active' : ''}>
                  Products
                </Link>
                <Link href="/projects" className={kind === 'project' ? 'is-active' : ''}>
                  Projects
                </Link>
              </nav>
              <div className="gb-seg" role="group" aria-label="View">
                <button className={view === 'list' ? 'is-active' : ''} onClick={() => setView('list')} aria-pressed={view === 'list'}>
                  List
                </button>
                <button className={view === 'grid' ? 'is-active' : ''} onClick={() => setView('grid')} aria-pressed={view === 'grid'}>
                  Grid
                </button>
              </div>
            </div>
          </div>
        </header>

        <section className="gb-arch gb-arch--ink">
          {items.length === 0 ? (
            <p className="gb-empty gb-mono">Nothing here yet — check back soon.</p>
          ) : view === 'list' ? (
            <>
              <div className="gb-arch-head gb-mono" aria-hidden="true">
                <span>No.</span>
                <span>Name</span>
                <span>Tags</span>
                <span>Year</span>
                <span />
              </div>
              <div data-gb-stagger>
                {items.map((item, i) => (
                  <Link key={item.id} href={hrefOf(item)} {...linkProps(item)} className="gb-arch-row" data-image={item.image || ''}>
                    <span className="gb-mono">{String(i + 1).padStart(2, '0')}</span>
                    <h2 className="gb-arch-name gb-cx" data-skew>
                      {item.name || item.title}
                      {item.wip && <sup>WIP</sup>}
                    </h2>
                    <span className="gb-arch-tags gb-mono">{(item.tags || []).slice(0, 3).join(' / ')}</span>
                    <span className="gb-mono">{yearOf(item) || '—'}</span>
                    <span className="gb-arch-arrow" aria-hidden="true">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="gb-arch-grid">
              {items.map((item, i) => (
                <Link
                  key={item.id}
                  href={hrefOf(item)}
                  {...linkProps(item)}
                  className="gb-arch-card"
                  data-speed={i % 2 ? '-0.25' : '0.1'}
                >
                  <div className="gb-arch-card-media" data-gb-clip>
                    {item.image && <img src={item.image} alt={`${item.name || item.title} screenshot`} loading="lazy" />}
                  </div>
                  <div className="gb-arch-card-foot">
                    <h2 className="gb-cx" data-skew>
                      {item.name || item.title}
                    </h2>
                    <span className="gb-mono">
                      {String(i + 1).padStart(2, '0')} — {(item.tags || []).slice(0, 2).join(' / ')}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <CursorPreview previewRef={previewRef} />
        </section>

        <GridbreakFooter lenisRef={lenisRef} />
      </main>

      <GridbreakChat />
    </div>
  );
}
