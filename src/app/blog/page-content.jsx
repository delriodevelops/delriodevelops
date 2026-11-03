'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import GridbreakChat from '../../components/gridbreak-chat';
import {
    CursorPreview,
    GridbreakEnter,
    GridbreakFooter,
    GridbreakNav,
    GridbreakProgress,
    formatDate,
    useCursorPreview,
    useGridbreakPage,
} from '../../components/gridbreak-shell';
import '../gridbreak.css';
import '../gridbreak-pages.css';

// `posts` comes from the server (page.jsx), newest first
export default function BlogPageContent({ posts = [] }) {
    const rootRef = useRef(null);
    const [selectedTag, setSelectedTag] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Tags come from the posts themselves so filters never point at empty sets
    const tags = useMemo(() => ['All', ...new Set(posts.map((p) => p.tag).filter(Boolean))], [posts]);

    const filteredPosts = posts.filter((post) => {
        const q = searchQuery.toLowerCase();
        const matchesTag = selectedTag === 'All' || post.tag === selectedTag;
        const matchesSearch =
            (post.title || '').toLowerCase().includes(q) || (post.excerpt || '').toLowerCase().includes(q);
        return matchesTag && matchesSearch;
    });

    const isFiltering = selectedTag !== 'All' || searchQuery !== '';
    const [featured, ...rest] = filteredPosts;
    const listed = isFiltering ? filteredPosts : rest;

    // Reveals rebuild only when the list identity changes, not on every keystroke
    const listKey = listed.map((p) => p.slug).join('|');
    const { lenisRef, onEntered } = useGridbreakPage(rootRef, { deps: [listKey, isFiltering] });
    const previewRef = useCursorPreview(rootRef, [listKey]);

    return (
        <div className="gb" ref={rootRef}>
            <GridbreakEnter onDone={onEntered} />
            <GridbreakProgress />
            <GridbreakNav active="notes" lenisRef={lenisRef} />

            <main id="main">
                <header className="gb-phead gb-phead--ink">
                    <div className="gb-crumbs gb-mono">
                        <Link href="/">← Index</Link>
                        <span>(B) — Writing</span>
                    </div>
                    <h1 className="gb-ptitle gb-cx" data-speed="-0.35" data-skew>
                        <span data-gb-chars>Notes</span>
                        <sup>({String(posts.length).padStart(2, '0')})</sup>
                    </h1>
                    <div className="gb-phead-row">
                        <div className="gb-controls" role="group" aria-label="Filter by tag">
                            {tags.map((tag) => (
                                <button
                                    key={tag}
                                    className={`gb-filter ${selectedTag === tag ? 'is-active' : ''}`}
                                    onClick={() => setSelectedTag(tag)}
                                    aria-pressed={selectedTag === tag}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                        <div className="gb-search">
                            <label htmlFor="gb-search" className="gb-mono">
                                Search
                            </label>
                            <input
                                id="gb-search"
                                type="search"
                                placeholder="Type to filter…"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </header>

                {!isFiltering && featured && (
                    <Link href={`/blog/${featured.slug}`} className="gb-feature">
                        <div className="gb-feature-media" data-gb-clip>
                            {featured.image && <img src={featured.image} alt="" />}
                        </div>
                        <div data-speed="-0.2">
                            <span className="gb-mono" style={{ color: 'var(--gb-red)' }}>
                                Latest — {formatDate(featured.date)}
                            </span>
                            <h2 className="gb-cx">{featured.title}</h2>
                            <p>{featured.excerpt}</p>
                            <span className="gb-btn">Read the note →</span>
                        </div>
                    </Link>
                )}

                <section className="gb-arch gb-arch--ink" aria-live="polite">
                    {filteredPosts.length === 0 ? (
                        <p className="gb-empty gb-mono">No notes match that — try another tag or search.</p>
                    ) : (
                        <div data-gb-stagger key={listKey}>
                            {listed.map((post) => (
                                <Link
                                    key={post.slug}
                                    href={`/blog/${post.slug}`}
                                    className="gb-arch-row gb-post-row"
                                    data-image={post.image || ''}
                                >
                                    <span className="gb-mono">{formatDate(post.date)}</span>
                                    <div>
                                        <h2 className="gb-arch-name gb-cx" data-skew>
                                            {post.title}
                                        </h2>
                                        {post.excerpt && <p>{post.excerpt}</p>}
                                    </div>
                                    <span className="gb-arch-tags gb-mono">{post.tag}</span>
                                    <span className="gb-arch-arrow" aria-hidden="true">
                                        →
                                    </span>
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
