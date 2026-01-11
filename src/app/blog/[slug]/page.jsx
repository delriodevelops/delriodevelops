'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, Clock, Share2, Twitter, Linkedin } from 'lucide-react';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';

// Same posts data (in production, fetch from API/CMS)
const allPosts = [
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
    {
        slug: 'solopreneur-stack',
        title: 'My Solopreneur Tech Stack 2024',
        excerpt: 'The tools and technologies I use to ship products fast as a one-person team.',
        content: `As a solobuilder, choosing the right tools is crucial. Here's my complete stack for 2024.

## Frontend

- **Next.js 14** - The backbone of everything I build
- **TypeScript** - Non-negotiable for maintainability
- **Tailwind CSS** - Rapid styling without context switching
- **Framer Motion** - Beautiful animations

## Backend

- **Next.js API Routes** - Serverless and simple
- **PostgreSQL** (via Supabase) - For structured data
- **Firebase** - For real-time features and auth

## AI & ML

- **OpenAI API** - GPT-4 for complex tasks
- **Deepseek** - Cost-effective alternative
- **LangChain** - For AI orchestration

## Infrastructure

- **Vercel** - Deploy in seconds
- **Cloudflare** - DNS and protection
- **Resend** - Transactional emails

## Productivity

- **Cursor** - AI-powered IDE
- **Linear** - Issue tracking
- **Notion** - Documentation
- **Figma** - Design (when needed)

## Why This Stack?

It optimizes for one thing: **shipping speed**. As a solo founder, I can't afford to spend weeks on infrastructure. This stack lets me go from idea to deployed MVP in days, not months.

The best stack is the one you know well. Don't chase trends—master your tools.`,
        tag: 'Tools',
        date: '2023-12-20',
        image: '/meshmind/3.png',
        readTime: '6 min read',
    },
    {
        slug: 'from-employee-to-founder',
        title: 'From Employee to Founder: My Story',
        excerpt: 'The scary, exciting, and rewarding journey of quitting my job to build products.',
        content: `Two years ago, I handed in my resignation. It was the scariest and best decision of my life.

## The Corporate Life

I spent 4 years as a software engineer at various companies. Good salary, good benefits, good colleagues. But something was missing.

Every night, I'd come home and work on side projects. I'd dream about products I wanted to build. I'd imagine what it would be like to be my own boss.

## The Tipping Point

The pandemic changed everything. Remote work showed me that I didn't need an office to be productive. If anything, I was MORE productive at home.

I started a side project that gained some traction. Nothing huge, but enough to validate that I could build something people wanted.

## Making the Leap

I saved 12 months of runway. Then I quit.

The first month was euphoric. The second month, fear crept in. By the third month, I had shipped my first product.

## Lessons Learned

1. **You need less money than you think** - Lifestyle creep is real
2. **The fear never goes away** - You just learn to work with it
3. **Community is everything** - Other indie hackers keep you sane
4. **Small wins matter** - Celebrate every milestone

## Would I Do It Again?

Absolutely. Even if I had to go back to employment tomorrow, this experience has been invaluable. I've grown more as a developer, marketer, and human being in 2 years than in my entire corporate career.

If you're on the fence, here's my advice: start building while employed. Validate your idea. Save some money. Then make the leap.

The water's warm. Come join us.`,
        tag: 'Personal',
        date: '2023-12-01',
        image: '/cityswipe.png',
        readTime: '7 min read',
    },
];

function parseMarkdown(content) {
    // Simple markdown parser for rendering
    const lines = content.split('\n');
    const elements = [];
    let currentList = [];
    let inList = false;

    lines.forEach((line, index) => {
        // Headers
        if (line.startsWith('## ')) {
            if (inList && currentList.length > 0) {
                elements.push(<ul key={`list-${index}`} style={{ marginBottom: '2rem', paddingLeft: '1.5rem', color: '#ccc' }}>{currentList}</ul>);
                currentList = [];
                inList = false;
            }
            elements.push(<h2 key={index} style={{ fontSize: '2rem', marginTop: '3rem', marginBottom: '1.5rem', color: '#fff' }}>{line.replace('## ', '')}</h2>);
        } else if (line.startsWith('### ')) {
            if (inList && currentList.length > 0) {
                elements.push(<ul key={`list-${index}`} style={{ marginBottom: '2rem', paddingLeft: '1.5rem', color: '#ccc' }}>{currentList}</ul>);
                currentList = [];
                inList = false;
            }
            elements.push(<h3 key={index} style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#fff' }}>{line.replace('### ', '')}</h3>);
        } else if (line.startsWith('![')) {
            // Images
            if (inList && currentList.length > 0) {
                elements.push(<ul key={`list-${index}`} style={{ marginBottom: '2rem', paddingLeft: '1.5rem', color: '#ccc' }}>{currentList}</ul>);
                currentList = [];
                inList = false;
            }
            const match = line.match(/!\[(.*?)\]\((.*?)\)/);
            if (match) {
                const alt = match[1];
                const src = match[2];
                elements.push(
                    <div key={index} style={{ margin: '3rem 0', width: '100%' }}>
                        <div style={{ borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <Image
                                src={src}
                                alt={alt}
                                width={800}
                                height={450}
                                style={{ width: '100%', height: 'auto', display: 'block' }}
                            />
                        </div>
                        {alt && <p style={{ textAlign: 'center', color: '#888', fontSize: '0.85rem', marginTop: '1rem', fontFamily: 'var(--font-mono)' }}>{alt}</p>}
                    </div>
                );
            }
        } else if (line.startsWith('- ')) {
            inList = true;
            const content = line.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '<strong style="color: #fff">$1</strong>');
            currentList.push(
                <li key={index} style={{ marginBottom: '0.5rem', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: content }} />
            );
        } else if (line.match(/^\d+\./)) {
            inList = true;
            const content = line.replace(/^\d+\.\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong style="color: #fff">$1</strong>');
            currentList.push(
                <li key={index} style={{ marginBottom: '0.5rem', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: content }} />
            );
        } else if (line.trim() === '') {
            if (inList && currentList.length > 0) {
                elements.push(<ul key={`list-${index}`} style={{ marginBottom: '2rem', paddingLeft: '1.5rem', color: '#ccc' }}>{currentList}</ul>);
                currentList = [];
                inList = false;
            }
        } else if (line.trim()) {
            if (inList && currentList.length > 0) {
                elements.push(<ul key={`list-${index}`} style={{ marginBottom: '2rem', paddingLeft: '1.5rem', color: '#ccc' }}>{currentList}</ul>);
                currentList = [];
                inList = false;
            }
            const content = line.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #fff">$1</strong>');
            elements.push(
                <p key={index} style={{ marginBottom: '1.5rem', lineHeight: 1.8, color: '#aaa', fontSize: '1.1rem' }} dangerouslySetInnerHTML={{ __html: content }} />
            );
        }
    });

    if (currentList.length > 0) {
        elements.push(<ul key="final-list" style={{ marginBottom: '2rem', paddingLeft: '1.5rem', color: '#ccc' }}>{currentList}</ul>);
    }

    return elements;
}

export default function BlogPostPage() {
    const params = useParams();
    const post = allPosts.find((p) => p.slug === params.slug);
    const contentRef = useRef(null);

    useEffect(() => {
        if (contentRef.current) {
            gsap.fromTo(contentRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 }
            );
        }
    }, []);

    if (!post) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '20vh 0' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Post not found</h1>
                <Link href="/blog" style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>
                    Back to thoughts
                </Link>
            </div>
        );
    }

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    return (
        <article style={{ minHeight: '100vh', background: 'var(--color-bg)', overflowX: 'hidden' }}>
            {/* Header */}
            <div className="container" style={{ paddingTop: '15vh' }}>
                <Link
                    href="/blog"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.8rem',
                        color: '#666',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        letterSpacing: '0.05em',
                        marginBottom: '4rem',
                        textTransform: 'uppercase',
                        transition: 'color 0.3s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#666')}
                >
                    <ArrowLeft size={16} />
                    Back to thoughts
                </Link>

                <div className="blog-post-header" style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <div style={{
                        display: 'flex',
                        gap: '2rem',
                        alignItems: 'center',
                        marginBottom: '2rem',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.9rem',
                        color: '#666',
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                        paddingBottom: '1rem'
                    }}>
                        <span style={{ color: 'var(--color-accent)' }}>{post.tag}</span>
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                        <span>{post.readTime}</span>
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                        lineHeight: 1.1,
                        fontWeight: 700,
                        marginBottom: '3rem',
                        letterSpacing: '-0.02em',
                        background: 'linear-gradient(to right, #fff, #888)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        {post.title}
                    </h1>
                </div>
            </div>

            {/* Hero Image */}
            <div className="container" style={{ maxWidth: '1200px' }}>
                <div
                    style={{
                        position: 'relative',
                        width: '100%',
                        aspectRatio: '21/9',
                        borderRadius: '0',
                        overflow: 'hidden',
                        marginBottom: '6rem',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}
                >
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        priority
                        style={{ objectFit: 'cover', opacity: 0.8 }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--color-bg), transparent 30%)' }} />
                </div>
            </div>

            {/* Content */}
            <div ref={contentRef} className="container" style={{ maxWidth: '800px', paddingBottom: '10vh' }}>
                <div className="blog-content" style={{ fontSize: '1.1rem' }}>
                    {parseMarkdown(post.content)}
                </div>

                {/* Footer / Share */}
                <div style={{
                    marginTop: '6rem',
                    paddingTop: '3rem',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ color: '#666', fontSize: '0.9rem' }}>
                        Thanks for reading.
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <a
                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#666', transition: 'all 0.3s ease' }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-accent)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = '#666'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            <Twitter size={20} />
                        </a>
                        <a
                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#666', transition: 'all 0.3s ease' }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-accent)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = '#666'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            <Linkedin size={20} />
                        </a>
                    </div>
                </div>

                <div style={{ marginTop: '4rem', textAlign: 'center' }}>
                    <Link href="/blog" className="magnetic-btn">
                        Read More Articles
                    </Link>
                </div>
            </div>
        </article>
    );
}
