'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, Clock, Share2, Twitter, Linkedin, Loader2, ArrowUp } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef, useState } from 'react';
import { getPostBySlug } from '../../../lib/services/blog-cached';

// Register GSAP plugins
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

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

// Custom animated markdown component
function AnimatedMarkdown({ content }) {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Get all animate-on-scroll elements
        const elements = containerRef.current.querySelectorAll('.animate-element');

        elements.forEach((element, index) => {
            gsap.fromTo(element,
                {
                    opacity: 0,
                    y: 40,
                    filter: 'blur(10px)'
                },
                {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: element,
                        start: 'top 85%',
                        end: 'top 60%',
                        toggleActions: 'play none none reverse',
                    }
                }
            );
        });

        // Animate horizontal rules
        const hrs = containerRef.current.querySelectorAll('.animate-hr');
        hrs.forEach((hr) => {
            gsap.fromTo(hr,
                { scaleX: 0 },
                {
                    scaleX: 1,
                    duration: 1,
                    ease: 'power3.inOut',
                    scrollTrigger: {
                        trigger: hr,
                        start: 'top 85%',
                    }
                }
            );
        });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, [content]);

    // Parse markdown to React elements with custom styles
    const parseMarkdown = (text) => {
        if (!text) return null;

        const lines = text.split('\n');
        const elements = [];
        let currentList = [];
        let inList = false;
        let listType = 'ul';

        lines.forEach((line, index) => {
            // H1 Headers - Huge editorial style
            if (line.startsWith('# ')) {
                if (inList && currentList.length > 0) {
                    elements.push(
                        <ul key={`list-${index}`} className="animate-element blog-list">
                            {currentList}
                        </ul>
                    );
                    currentList = [];
                    inList = false;
                }
                elements.push(
                    <h1 key={index} className="animate-element blog-h1">
                        {line.replace('# ', '')}
                    </h1>
                );
            }
            // H2 Headers - Large with accent line
            else if (line.startsWith('## ')) {
                if (inList && currentList.length > 0) {
                    elements.push(
                        <ul key={`list-${index}`} className="animate-element blog-list">
                            {currentList}
                        </ul>
                    );
                    currentList = [];
                    inList = false;
                }
                elements.push(
                    <h2 key={index} className="animate-element blog-h2">
                        <span className="blog-h2-accent" />
                        {line.replace('## ', '')}
                    </h2>
                );
            }
            // H3 Headers
            else if (line.startsWith('### ')) {
                if (inList && currentList.length > 0) {
                    elements.push(
                        <ul key={`list-${index}`} className="animate-element blog-list">
                            {currentList}
                        </ul>
                    );
                    currentList = [];
                    inList = false;
                }
                elements.push(
                    <h3 key={index} className="animate-element blog-h3">
                        {line.replace('### ', '')}
                    </h3>
                );
            }
            // Images
            else if (line.startsWith('![')) {
                if (inList && currentList.length > 0) {
                    elements.push(
                        <ul key={`list-${index}`} className="animate-element blog-list">
                            {currentList}
                        </ul>
                    );
                    currentList = [];
                    inList = false;
                }
                const match = line.match(/!\[(.*?)\]\((.*?)\)/);
                if (match) {
                    const alt = match[1];
                    const src = match[2];
                    elements.push(
                        <figure key={index} className="animate-element blog-figure">
                            <div className="blog-image-wrapper">
                                <Image
                                    src={src}
                                    alt={alt}
                                    width={1200}
                                    height={675}
                                    className="blog-image"
                                />
                            </div>
                            {alt && <figcaption className="blog-figcaption">{alt}</figcaption>}
                        </figure>
                    );
                }
            }
            // Horizontal rule
            else if (line.trim() === '---') {
                elements.push(<hr key={index} className="animate-hr blog-hr" />);
            }
            // Blockquote
            else if (line.startsWith('> ')) {
                elements.push(
                    <blockquote key={index} className="animate-element blog-blockquote">
                        {formatInlineStyles(line.replace('> ', ''))}
                    </blockquote>
                );
            }
            // Unordered list items
            else if (line.startsWith('- ')) {
                inList = true;
                listType = 'ul';
                currentList.push(
                    <li key={index} className="blog-list-item">
                        {formatInlineStyles(line.replace('- ', ''))}
                    </li>
                );
            }
            // Ordered list items
            else if (line.match(/^\d+\. /)) {
                inList = true;
                listType = 'ol';
                currentList.push(
                    <li key={index} className="blog-list-item">
                        {formatInlineStyles(line.replace(/^\d+\. /, ''))}
                    </li>
                );
            }
            // Empty line - end list or add spacing
            else if (line.trim() === '') {
                if (inList && currentList.length > 0) {
                    const ListTag = listType === 'ol' ? 'ol' : 'ul';
                    elements.push(
                        <ListTag key={`list-${index}`} className="animate-element blog-list">
                            {currentList}
                        </ListTag>
                    );
                    currentList = [];
                    inList = false;
                }
            }
            // Regular paragraph
            else if (line.trim()) {
                if (inList && currentList.length > 0) {
                    const ListTag = listType === 'ol' ? 'ol' : 'ul';
                    elements.push(
                        <ListTag key={`list-${index}`} className="animate-element blog-list">
                            {currentList}
                        </ListTag>
                    );
                    currentList = [];
                    inList = false;
                }
                elements.push(
                    <p key={index} className="animate-element blog-paragraph">
                        {formatInlineStyles(line)}
                    </p>
                );
            }
        });

        // Close any remaining list
        if (currentList.length > 0) {
            const ListTag = listType === 'ol' ? 'ol' : 'ul';
            elements.push(
                <ListTag key="final-list" className="animate-element blog-list">
                    {currentList}
                </ListTag>
            );
        }

        return elements;
    };

    // Format inline styles like bold, italic, code, links
    const formatInlineStyles = (text) => {
        // Split by inline elements and preserve them
        const parts = [];
        let remaining = text;
        let keyCounter = 0;

        // Process inline code first
        while (remaining.includes('`')) {
            const start = remaining.indexOf('`');
            const end = remaining.indexOf('`', start + 1);
            if (end === -1) break;

            if (start > 0) {
                parts.push(formatBoldItalic(remaining.slice(0, start), keyCounter++));
            }
            parts.push(
                <code key={`code-${keyCounter++}`} className="blog-inline-code">
                    {remaining.slice(start + 1, end)}
                </code>
            );
            remaining = remaining.slice(end + 1);
        }

        if (remaining) {
            parts.push(formatBoldItalic(remaining, keyCounter));
        }

        return parts.length > 0 ? parts : text;
    };

    const formatBoldItalic = (text, key) => {
        // Handle bold
        const boldRegex = /\*\*(.*?)\*\*/g;
        const parts = text.split(boldRegex);

        return parts.map((part, i) => {
            if (i % 2 === 1) {
                return <strong key={`bold-${key}-${i}`} className="blog-bold">{part}</strong>;
            }
            return part;
        });
    };

    return (
        <div ref={containerRef} className="blog-content-wrapper">
            {parseMarkdown(content)}
        </div>
    );
}

export default function BlogPostPage() {
    const params = useParams();
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const heroRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const firebasePost = await getPostBySlug(params.slug);
                if (firebasePost) {
                    setPost({
                        ...firebasePost,
                        date: firebasePost.createdAt || new Date().toISOString(),
                    });
                } else {
                    const staticPost = fallbackPosts.find((p) => p.slug === params.slug);
                    setPost(staticPost || null);
                }
            } catch (error) {
                console.error('Error fetching post:', error);
                const staticPost = fallbackPosts.find((p) => p.slug === params.slug);
                setPost(staticPost || null);
            }
            setIsLoading(false);
        };

        fetchPost();
    }, [params.slug]);

    // Hero animation
    useEffect(() => {
        if (!isLoading && heroRef.current) {
            const tl = gsap.timeline();

            tl.fromTo('.hero-tag',
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
            )
                .fromTo('.hero-title',
                    { opacity: 0, y: 50, filter: 'blur(20px)' },
                    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power3.out' },
                    '-=0.3'
                )
                .fromTo('.hero-meta',
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
                    '-=0.5'
                )
                .fromTo('.hero-image',
                    { opacity: 0, scale: 1.1 },
                    { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' },
                    '-=0.6'
                );
        }
    }, [isLoading, post]);

    // Scroll progress
    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            setScrollProgress(progress);
            setShowScrollTop(window.scrollY > 500);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-[var(--color-accent)] mx-auto mb-4" />
                    <p className="text-gray-500 font-mono uppercase tracking-widest text-sm">Loading Article...</p>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-6xl font-bold mb-4">404</h1>
                    <p className="text-gray-500 mb-8 font-mono">Article not found</p>
                    <Link href="/blog" className="magnetic-btn">
                        Back to thoughts
                    </Link>
                </div>
            </div>
        );
    }

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    return (
        <>
            {/* Progress Bar */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-white/5 z-50">
                <div
                    className="h-full bg-gradient-to-r from-[var(--color-accent)] to-white transition-all duration-150"
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>

            {/* Scroll to Top Button */}
            <button
                onClick={scrollToTop}
                className={`fixed bottom-8 right-8 z-50 p-4 rounded-full bg-[var(--color-accent)] text-black transition-all duration-300 hover:scale-110 ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
                    }`}
            >
                <ArrowUp size={20} />
            </button>

            <article className="min-h-screen bg-black text-white relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="fixed top-0 right-0 w-1/2 h-screen pointer-events-none opacity-30">
                    <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[var(--color-accent)] rounded-full filter blur-[150px]" />
                    <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-purple-500 rounded-full filter blur-[120px]" />
                </div>

                {/* Hero Section */}
                <header ref={heroRef} className="relative pt-32 pb-16 px-6">
                    <div className="max-w-4xl mx-auto">
                        {/* Back Link */}
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-gray-500 hover:text-[var(--color-accent)] transition-colors uppercase tracking-widest text-xs mb-12 group"
                        >
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            Back to thoughts
                        </Link>

                        {/* Tag */}
                        <div className="hero-tag mb-6">
                            <span className="inline-block px-4 py-2 text-xs font-mono uppercase tracking-widest bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/30 rounded-full">
                                {post.tag}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="hero-title text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight mb-8">
                            {post.title}
                        </h1>

                        {/* Meta */}
                        <div className="hero-meta flex flex-wrap items-center gap-6 text-gray-500 font-mono text-sm">
                            <div className="flex items-center gap-2">
                                <Calendar size={14} />
                                {new Date(post.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={14} />
                                {post.readTime}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Hero Image */}
                <div className="hero-image relative w-full max-w-6xl mx-auto px-6 mb-20">
                    <div className="relative aspect-[21/9] rounded-2xl overflow-hidden border border-white/10">
                        <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            priority
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                </div>

                {/* Content */}
                <div ref={contentRef} className="relative max-w-3xl mx-auto px-6 pb-32">
                    {/* Excerpt */}
                    <p className="text-xl md:text-2xl text-gray-400 leading-relaxed mb-16 border-l-4 border-[var(--color-accent)] pl-6">
                        {post.excerpt}
                    </p>

                    {/* Main Content */}
                    <AnimatedMarkdown content={post.content} />

                    {/* Footer */}
                    <footer className="mt-24 pt-12 border-t border-white/10">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                            <div>
                                <p className="text-gray-400 mb-2">Thanks for reading.</p>
                                <p className="text-sm text-gray-600 font-mono">Share this article:</p>
                            </div>

                            <div className="flex gap-4">
                                <a
                                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-4 rounded-full border border-white/10 text-gray-400 hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-all hover:scale-110"
                                >
                                    <Twitter size={20} />
                                </a>
                                <a
                                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-4 rounded-full border border-white/10 text-gray-400 hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-all hover:scale-110"
                                >
                                    <Linkedin size={20} />
                                </a>
                            </div>
                        </div>

                        <div className="mt-16 text-center">
                            <Link href="/blog" className="magnetic-btn">
                                Read More Articles
                            </Link>
                        </div>
                    </footer>
                </div>
            </article>

            {/* Custom Blog Styles */}
            <style jsx global>{`
                .blog-content-wrapper {
                    --accent: var(--color-accent, #00ff88);
                }

                .blog-h1 {
                    font-size: clamp(2.5rem, 5vw, 4rem);
                    font-weight: 800;
                    line-height: 1.1;
                    margin: 3rem 0 1.5rem;
                    letter-spacing: -0.03em;
                    background: linear-gradient(135deg, #fff 0%, #888 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .blog-h2 {
                    position: relative;
                    font-size: clamp(1.8rem, 4vw, 2.5rem);
                    font-weight: 700;
                    line-height: 1.2;
                    margin: 4rem 0 1.5rem;
                    padding-left: 1.5rem;
                    color: #fff;
                }

                .blog-h2-accent {
                    position: absolute;
                    left: 0;
                    top: 0;
                    bottom: 0;
                    width: 4px;
                    background: linear-gradient(to bottom, var(--accent), transparent);
                    border-radius: 2px;
                }

                .blog-h3 {
                    font-size: clamp(1.3rem, 3vw, 1.6rem);
                    font-weight: 600;
                    line-height: 1.3;
                    margin: 2.5rem 0 1rem;
                    color: #e0e0e0;
                }

                .blog-paragraph {
                    font-size: 1.15rem;
                    line-height: 1.9;
                    color: #a0a0a0;
                    margin-bottom: 1.5rem;
                }

                .blog-bold {
                    color: #fff;
                    font-weight: 600;
                }

                .blog-inline-code {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 0.9em;
                    padding: 0.2em 0.5em;
                    background: rgba(255, 255, 255, 0.08);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 6px;
                    color: var(--accent);
                }

                .blog-list {
                    margin: 1.5rem 0 2rem;
                    padding-left: 0;
                    list-style: none;
                }

                .blog-list-item {
                    position: relative;
                    padding-left: 2rem;
                    margin-bottom: 0.75rem;
                    font-size: 1.1rem;
                    line-height: 1.8;
                    color: #a0a0a0;
                }

                .blog-list-item::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0.75rem;
                    width: 8px;
                    height: 8px;
                    background: var(--accent);
                    border-radius: 50%;
                }

                ol.blog-list {
                    counter-reset: list-counter;
                }

                ol.blog-list .blog-list-item {
                    counter-increment: list-counter;
                }

                ol.blog-list .blog-list-item::before {
                    content: counter(list-counter);
                    width: auto;
                    height: auto;
                    background: none;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: var(--accent);
                    top: 0;
                }

                .blog-blockquote {
                    position: relative;
                    margin: 2.5rem 0;
                    padding: 1.5rem 2rem;
                    background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%);
                    border-left: 3px solid var(--accent);
                    border-radius: 0 12px 12px 0;
                    font-size: 1.2rem;
                    font-style: italic;
                    color: #c0c0c0;
                }

                .blog-figure {
                    margin: 3rem -2rem;
                    padding: 0;
                }

                @media (min-width: 768px) {
                    .blog-figure {
                        margin: 3rem -4rem;
                    }
                }

                .blog-image-wrapper {
                    position: relative;
                    border-radius: 16px;
                    overflow: hidden;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .blog-image {
                    width: 100%;
                    height: auto;
                    display: block;
                    transition: transform 0.6s ease;
                }

                .blog-figure:hover .blog-image {
                    transform: scale(1.02);
                }

                .blog-figcaption {
                    text-align: center;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 0.85rem;
                    color: #666;
                    margin-top: 1rem;
                    padding: 0 1rem;
                }

                .blog-hr {
                    border: none;
                    height: 1px;
                    background: linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent);
                    margin: 4rem 0;
                    transform-origin: center;
                }
            `}</style>
        </>
    );
}
