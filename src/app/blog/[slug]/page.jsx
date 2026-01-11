'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, Clock, Share2, Twitter, Linkedin } from 'lucide-react';

// Same posts data (in production, fetch from API/CMS)
const allPosts = [
    {
        slug: 'building-in-public',
        title: 'Why I Build in Public',
        excerpt: 'The journey from corporate developer to indie hacker, and why transparency matters more than ever.',
        content: `Building in public has completely changed how I approach product development. When I left my corporate job to become an indie hacker, I knew I needed to do things differently.

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
                elements.push(<ul key={`list-${index}`} style={{ marginBottom: 'var(--space-lg)' }}>{currentList}</ul>);
                currentList = [];
                inList = false;
            }
            elements.push(<h2 key={index}>{line.replace('## ', '')}</h2>);
        } else if (line.startsWith('### ')) {
            if (inList && currentList.length > 0) {
                elements.push(<ul key={`list-${index}`} style={{ marginBottom: 'var(--space-lg)' }}>{currentList}</ul>);
                currentList = [];
                inList = false;
            }
            elements.push(<h3 key={index}>{line.replace('### ', '')}</h3>);
        } else if (line.startsWith('- ')) {
            inList = true;
            const content = line.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            currentList.push(
                <li key={index} dangerouslySetInnerHTML={{ __html: content }} />
            );
        } else if (line.match(/^\d+\./)) {
            inList = true;
            const content = line.replace(/^\d+\.\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            currentList.push(
                <li key={index} dangerouslySetInnerHTML={{ __html: content }} />
            );
        } else if (line.trim() === '') {
            if (inList && currentList.length > 0) {
                elements.push(<ul key={`list-${index}`} style={{ marginBottom: 'var(--space-lg)', paddingLeft: 'var(--space-xl)' }}>{currentList}</ul>);
                currentList = [];
                inList = false;
            }
        } else if (line.trim()) {
            if (inList && currentList.length > 0) {
                elements.push(<ul key={`list-${index}`} style={{ marginBottom: 'var(--space-lg)', paddingLeft: 'var(--space-xl)' }}>{currentList}</ul>);
                currentList = [];
                inList = false;
            }
            const content = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            elements.push(
                <p key={index} dangerouslySetInnerHTML={{ __html: content }} />
            );
        }
    });

    if (currentList.length > 0) {
        elements.push(<ul key="final-list" style={{ marginBottom: 'var(--space-lg)', paddingLeft: 'var(--space-xl)' }}>{currentList}</ul>);
    }

    return elements;
}

export default function BlogPostPage() {
    const params = useParams();
    const post = allPosts.find((p) => p.slug === params.slug);

    if (!post) {
        return (
            <div className="blog-post" style={{ textAlign: 'center' }}>
                <h1>Post not found</h1>
                <Link href="/blog" className="btn btn-primary" style={{ marginTop: 'var(--space-xl)' }}>
                    Back to blog
                </Link>
            </div>
        );
    }

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    return (
        <article style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
            {/* Header */}
            <div className="container" style={{ paddingTop: 'var(--space-6xl)' }}>
                <Link
                    href="/blog"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 'var(--space-sm)',
                        color: 'var(--color-text-muted)',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        marginBottom: 'var(--space-2xl)',
                        transition: 'color 0.3s',
                    }}
                    onMouseEnter={(e) => (e.target.style.color = 'var(--color-accent)')}
                    onMouseLeave={(e) => (e.target.style.color = 'var(--color-text-muted)')}
                >
                    <ArrowLeft size={16} />
                    Back to blog
                </Link>
            </div>

            {/* Hero Image */}
            <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '0 var(--space-xl)' }}>
                <div
                    style={{
                        width: '100%',
                        aspectRatio: '21/9',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        marginBottom: 'var(--space-3xl)',
                    }}
                >
                    <Image
                        src={post.image}
                        alt={post.title}
                        width={1000}
                        height={430}
                        quality={90}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="blog-post">
                <header className="blog-post-header">
                    <div className="blog-post-meta">
                        <span
                            style={{
                                color: 'var(--color-accent)',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                            }}
                        >
                            {post.tag}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                            <Calendar size={14} />
                            {new Date(post.date).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                            <Clock size={14} />
                            {post.readTime}
                        </span>
                    </div>

                    <h1 className="blog-post-title">{post.title}</h1>

                    <p style={{ fontSize: '1.25rem', color: 'var(--color-text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
                        {post.excerpt}
                    </p>
                </header>

                <div className="blog-post-content">{parseMarkdown(post.content)}</div>

                {/* Share */}
                <div
                    style={{
                        marginTop: 'var(--space-4xl)',
                        paddingTop: 'var(--space-2xl)',
                        borderTop: '1px solid var(--color-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 'var(--space-lg)',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', color: 'var(--color-text-muted)' }}>
                        <Share2 size={18} />
                        <span>Share this post</span>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                        <a
                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link"
                            aria-label="Share on Twitter"
                        >
                            <Twitter size={18} />
                        </a>
                        <a
                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link"
                            aria-label="Share on LinkedIn"
                        >
                            <Linkedin size={18} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Back to blog */}
            <div className="container" style={{ paddingBottom: 'var(--space-6xl)', textAlign: 'center' }}>
                <Link href="/blog" className="btn btn-secondary">
                    <ArrowLeft size={18} />
                    All posts
                </Link>
            </div>
        </article>
    );
}
