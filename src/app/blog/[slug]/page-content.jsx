'use client';

import { useRef } from 'react';
import Link from 'next/link';
import {
    GridbreakEnter,
    GridbreakFooter,
    GridbreakNav,
    GridbreakProgress,
    formatDate,
    useGridbreakPage,
} from '../../../components/gridbreak-shell';
import { identity } from '../../../data/profile';
import '../../gridbreak.css';
import '../../gridbreak-pages.css';

const formatItalic = (text, keyBase) =>
    text.split(/\*(.+?)\*/g).map((part, k) => (k % 2 === 1 ? <em key={`${keyBase}-i${k}`}>{part}</em> : part));

// Bold, italic and inline code; everything else is plain text
function formatInline(text, keyBase) {
    return text.split(/(`[^`]+`)/g).flatMap((chunk, i) => {
        if (chunk.startsWith('`') && chunk.endsWith('`') && chunk.length > 1) {
            return (
                <code key={`${keyBase}-c${i}`} className="gb-md-code">
                    {chunk.slice(1, -1)}
                </code>
            );
        }
        return chunk.split(/\*\*(.*?)\*\*/g).map((part, j) =>
            j % 2 === 1 ? (
                <strong key={`${keyBase}-b${i}-${j}`} className="gb-md-strong">
                    {part}
                </strong>
            ) : (
                formatItalic(part, `${keyBase}-${i}-${j}`)
            ),
        );
    });
}

// Line-based markdown → Gridbreak elements; every block carries data-gb-rise
function Markdown({ content }) {
    if (!content) return null;

    const blocks = [];
    let list = null;

    const flushList = (key) => {
        if (!list) return;
        const Tag = list.type;
        blocks.push(
            <Tag key={`list-${key}`} className="gb-md-list" data-gb-rise>
                {list.items}
            </Tag>,
        );
        list = null;
    };

    const pushItem = (type, text, key) => {
        if (list && list.type !== type) flushList(key);
        if (!list) list = { type, items: [] };
        list.items.push(<li key={key}>{formatInline(text, key)}</li>);
    };

    content.split('\n').forEach((line, i) => {
        if (line.startsWith('- ')) return pushItem('ul', line.slice(2), i);
        if (/^\d+\. /.test(line)) return pushItem('ol', line.replace(/^\d+\. /, ''), i);
        flushList(i);

        if (line.startsWith('### ')) {
            blocks.push(
                <h3 key={i} className="gb-md-h3" data-gb-rise>
                    {line.slice(4)}
                </h3>,
            );
        } else if (line.startsWith('## ')) {
            blocks.push(
                <h2 key={i} className="gb-md-h2" data-gb-rise data-skew>
                    {line.slice(3)}
                </h2>,
            );
        } else if (line.startsWith('# ')) {
            blocks.push(
                <h2 key={i} className="gb-md-h1" data-gb-rise>
                    {line.slice(2)}
                </h2>,
            );
        } else if (line.startsWith('![')) {
            const match = line.match(/!\[(.*?)\]\((.*?)\)/);
            if (match) {
                blocks.push(
                    <figure key={i} className="gb-md-figure">
                        <div data-gb-clip>
                            <img src={match[2]} alt={match[1]} loading="lazy" />
                        </div>
                        {match[1] && <figcaption className="gb-mono">{match[1]}</figcaption>}
                    </figure>,
                );
            }
        } else if (line.trim() === '---') {
            blocks.push(<hr key={i} className="gb-md-hr" data-gb-rule />);
        } else if (line.startsWith('> ')) {
            blocks.push(
                <blockquote key={i} className="gb-md-quote" data-gb-rise>
                    {formatInline(line.slice(2), i)}
                </blockquote>,
            );
        } else if (line.trim()) {
            blocks.push(
                <p key={i} className="gb-md-p" data-gb-rise>
                    {formatInline(line, i)}
                </p>,
            );
        }
    });
    flushList('end');

    return <div className="gb-md">{blocks}</div>;
}

const readTimeOf = (post) => {
    if (post.readTime) return post.readTime;
    const words = (post.content || '').split(/\s+/).filter(Boolean).length;
    return `${Math.max(1, Math.round(words / 220))} min read`;
};

// `post` comes from the server (page.jsx), which calls notFound() for unknown slugs
export default function BlogPostContent({ post, slug }) {
    const rootRef = useRef(null);

    const { lenisRef, onEntered } = useGridbreakPage(rootRef);

    // canonical URL, identical on server and client (no hydration mismatch)
    const shareUrl = `${identity.site}/blog/${slug || post.slug}`;

    return (
        <div className="gb" ref={rootRef}>
            <GridbreakEnter onDone={onEntered} tone="bone" />
            <GridbreakProgress />
            <GridbreakNav active="notes" lenisRef={lenisRef} />

            <main id="main">
                <article className="gb-article">
                    <header className="gb-article-hero">
                        <div className="gb-crumbs gb-mono">
                            <Link href="/blog">← Notes</Link>
                            <span style={{ color: 'var(--gb-red)' }}>{post.tag}</span>
                        </div>
                        <h1 className="gb-article-title gb-cx" data-gb-lines data-speed="-0.25">
                            {post.title}
                        </h1>
                        <div className="gb-article-meta gb-mono" data-gb-stagger data-gb-delay="0.2">
                            <span>
                                Published{' '}
                                <strong>
                                    {formatDate(post.date, { day: 'numeric', month: 'long', year: 'numeric' })}
                                </strong>
                            </span>
                            <span>
                                Reading <strong>{readTimeOf(post)}</strong>
                            </span>
                            <span>
                                By <strong>Christian Del Río</strong>
                            </span>
                        </div>
                    </header>

                    {post.image && (
                        <div className="gb-article-cover" data-gb-expand>
                            <img src={post.image} alt="" />
                        </div>
                    )}

                    <div className="gb-article-body" data-wipe>
                        <aside className="gb-article-side gb-mono">
                            <p style={{ margin: '0 0 8px' }}>Filed under</p>
                            <p style={{ margin: '0 0 24px', color: 'var(--gb-ink)' }}>{post.tag}</p>
                            <Link href="/blog">← All notes</Link>
                        </aside>

                        <div>
                            {post.excerpt && (
                                <p className="gb-excerpt" data-gb-lines>
                                    {post.excerpt}
                                </p>
                            )}
                            <Markdown content={post.content} />

                            <div className="gb-share gb-mono">
                                <span style={{ marginRight: 'auto' }}>Thanks for reading — share it:</span>
                                <a
                                    className="gb-btn"
                                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    X / Twitter ↗
                                </a>
                                <a
                                    className="gb-btn"
                                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    LinkedIn ↗
                                </a>
                            </div>
                        </div>
                    </div>
                </article>

                <Link href="/blog" className="gb-next">
                    <span className="gb-mono">Keep reading —&gt;</span>
                    <span className="gb-next-name gb-cx">All notes</span>
                </Link>

                <GridbreakFooter lenisRef={lenisRef} />
            </main>
        </div>
    );
}
