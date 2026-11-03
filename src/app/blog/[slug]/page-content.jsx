'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug } from '../../../lib/services/blog';
import {
    GridbreakEnter,
    GridbreakFooter,
    GridbreakNav,
    GridbreakProgress,
    formatDate,
    useGridbreakPage,
} from '../../../components/gridbreak-shell';
import '../../gridbreak.css';
import '../../gridbreak-pages.css';

// Fallback posts data for when Firebase is not configured
const fallbackPosts = [
    {
        slug: 'building-in-public',
        title: 'Why I Build in Public',
        excerpt: 'The journey from corporate developer to indie hacker, and why transparency matters more than ever.',
        content: `Building in public has completely changed how I approach product development. When I left my corporate job to become an indie hacker, I knew I needed to do things differently.

![My Setup](/meshmind/1.png)

## The Fear of Sharing

At first, I was terrified. What if someone steals my ideas? What if I fail publicly? These fears held me back for months. But then I realized something important: ideas are worthless without execution.

## The Benefits I've Discovered

1. **Accountability** - When you share your goals publicly, you're more likely to follow through
2. **Community** - Other builders rally around you and offer genuine support
3. **Feedback** - Early users help shape your product before you invest too much time
4. **Marketing** - Your journey becomes your marketing

## How I Build in Public

I share on Twitter, write blog posts like this one, and occasionally stream my coding sessions. It's not about being perfect—it's about being authentic.

## The Results

Since starting to build in public, I've launched 4 products, grown a small but engaged following, and most importantly, I've made genuine connections with other makers who inspire me every day.

If you're thinking about building in public, my advice is simple: just start. Your first posts will be awkward. Your first videos will be cringy. But that's okay. The community is incredibly supportive of newcomers.`,
        tag: 'Indie Hacking',
        date: '2024-01-10',
        image: '/meshmind/2.png',
        readTime: '5 min read',
    },
    {
        slug: 'ai-first-development',
        title: 'AI-First Product Development',
        excerpt: 'How I integrate AI into every product from day one, and why you should too.',
        content: `Every product I build now starts with one question: "How can AI make this 10x better?"

## The AI Advantage

We're living in an unprecedented time. AI tools have democratized capabilities that used to require entire teams. As a solobuilder, this is my superpower.

## My AI Stack

- **OpenAI GPT-4** for natural language features
- **Deepseek** for cost-effective inference
- **LangChain** for complex AI workflows
- **Vercel AI SDK** for streaming responses

## Practical Examples

### Fainancial
Instead of manually summarizing earnings calls, AI does it in seconds. Users get instant insights that would take analysts hours to compile.

### MeshMind
The entire product is about AI reasoning. Users can create visual chains of thought that leverage multiple AI models.

## Tips for AI-First Development

1. Start with the AI feature, not as an afterthought
2. Design your UX around AI limitations (latency, occasional errors)
3. Use streaming for better perceived performance
4. Always have fallbacks

## The Future is AI-Native

Products that don't leverage AI will feel outdated. The good news? It's never been easier to add AI to your stack.`,
        tag: 'AI',
        date: '2024-01-05',
        image: '/fainancial/2.png',
        readTime: '4 min read',
    },
];

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
            )
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
            </Tag>
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
                </h3>
            );
        } else if (line.startsWith('## ')) {
            blocks.push(
                <h2 key={i} className="gb-md-h2" data-gb-rise data-skew>
                    {line.slice(3)}
                </h2>
            );
        } else if (line.startsWith('# ')) {
            blocks.push(
                <h2 key={i} className="gb-md-h1" data-gb-rise>
                    {line.slice(2)}
                </h2>
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
                    </figure>
                );
            }
        } else if (line.trim() === '---') {
            blocks.push(<hr key={i} className="gb-md-hr" data-gb-rule />);
        } else if (line.startsWith('> ')) {
            blocks.push(
                <blockquote key={i} className="gb-md-quote" data-gb-rise>
                    {formatInline(line.slice(2), i)}
                </blockquote>
            );
        } else if (line.trim()) {
            blocks.push(
                <p key={i} className="gb-md-p" data-gb-rise>
                    {formatInline(line, i)}
                </p>
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

export default function BlogPostPage() {
    const params = useParams();
    const rootRef = useRef(null);
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const { lenisRef, onEntered } = useGridbreakPage(rootRef, { ready: !isLoading, deps: [post] });

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const firebasePost = await getPostBySlug(params.slug);
                if (firebasePost) {
                    setPost({ ...firebasePost, date: firebasePost.createdAt || new Date().toISOString() });
                } else {
                    setPost(fallbackPosts.find((p) => p.slug === params.slug) || null);
                }
            } catch (error) {
                console.error('Error fetching post:', error);
                setPost(fallbackPosts.find((p) => p.slug === params.slug) || null);
            }
            setIsLoading(false);
        };

        fetchPost();
    }, [params.slug]);

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    return (
        <div className="gb" ref={rootRef}>
            <GridbreakEnter onDone={onEntered} tone="bone" />
            <GridbreakProgress />
            <GridbreakNav active="notes" lenisRef={lenisRef} />

            {isLoading ? (
                <div className="gb-state gb-phead--bone" aria-busy="true">
                    <span className="gb-mono">Loading note…</span>
                </div>
            ) : !post ? (
                <div className="gb-state gb-phead--ink">
                    <span className="gb-mono">Error 404</span>
                    <h1 className="gb-ptitle gb-cx">Not found</h1>
                    <Link href="/blog" className="gb-btn">
                        ← Back to notes
                    </Link>
                </div>
            ) : (
                <main>
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
                                    Published <strong>{formatDate(post.date, { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
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
            )}
        </div>
    );
}
