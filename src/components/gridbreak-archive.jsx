'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { getAllProjects } from '../lib/services/projects';
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
    label: 'Side projects',
    lede: 'Experiments, side projects and learning adventures. Not polished, but packed with lessons.',
  },
  product: {
    title: 'Products',
    label: 'Shipped products',
    lede: 'Complete products that solve real problems. Built with care, designed to deliver value.',
  },
};

const isProduct = (p) => {
  const category = p.type || p.category || (p.tags && p.tags.includes('Product') ? 'Product' : 'Project');
  return category.toUpperCase() === 'PRODUCT';
};

const yearOf = (p) => {
  const d = new Date(p.date || p.createdAt);
  return Number.isNaN(d.getTime()) ? '' : d.getFullYear();
};

/**
 * Shared index for /projects and /products: same data source, filtered by kind.
 */
export default function GridbreakArchive({ kind, fallback }) {
  const rootRef = useRef(null);
  const copy = COPY[kind];
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState('list');

  const { lenisRef, onEntered } = useGridbreakPage(rootRef, { ready: !isLoading, deps: [items, view] });
  const previewRef = useCursorPreview(rootRef, [items, view]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const all = await getAllProjects();
        const filtered = all.filter((p) => (kind === 'product' ? isProduct(p) : !isProduct(p)));
        setItems(filtered.length > 0 ? filtered : all.length > 0 ? [] : fallback);
      } catch (error) {
        console.error(`Error fetching ${kind}s:`, error);
        setItems(fallback);
      }
      setIsLoading(false);
    };
    fetchItems();
  }, [kind, fallback]);

  const hrefOf = (item) => (typeof item.id === 'string' ? `/projects/${item.id}` : item.href);
  const linkProps = (item) =>
    typeof item.id === 'string' ? {} : { target: '_blank', rel: 'noopener noreferrer' };

  return (
    <div className="gb" ref={rootRef}>
      <GridbreakEnter onDone={onEntered} />
      <GridbreakProgress />
      <GridbreakNav active={kind === 'product' ? 'products' : 'projects'} lenisRef={lenisRef} />

      <main>
        <header className="gb-phead gb-phead--ink">
          <div className="gb-crumbs gb-mono">
            <Link href="/">← Index</Link>
            <span>(A) — {copy.label}</span>
          </div>
          <h1 className="gb-ptitle gb-cx" data-speed="-0.35" data-skew>
            <span data-gb-chars>{copy.title}</span>
            {!isLoading && <sup>({String(items.length).padStart(2, '0')})</sup>}
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

        <section className="gb-arch gb-arch--ink" aria-busy={isLoading}>
          {isLoading ? (
            <div aria-label="Loading">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="gb-skeleton" />
              ))}
            </div>
          ) : items.length === 0 ? (
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
