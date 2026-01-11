'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Search } from 'lucide-react';

// Sample blog posts data (in a real app, this would come from a database or CMS)
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

const tags = ['All', 'Indie Hacking', 'AI', 'Tools', 'Personal'];

export default function BlogPage() {
    const [selectedTag, setSelectedTag] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPosts = allPosts.filter((post) => {
        const matchesTag = selectedTag === 'All' || post.tag === selectedTag;
        const matchesSearch =
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTag && matchesSearch;
    });

    return (
        <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
            {/* Header */}
            <header style={{ padding: 'var(--space-6xl) 0 var(--space-3xl)', borderBottom: '1px solid var(--color-border)' }}>
                <div className="container">
                    <Link
                        href="/"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 'var(--space-sm)',
                            color: 'var(--color-text-muted)',
                            textDecoration: 'none',
                            fontSize: '0.875rem',
                            marginBottom: 'var(--space-xl)',
                        }}
                    >
                        <ArrowLeft size={16} />
                        Back home
                    </Link>

                    <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: 'var(--space-md)' }}>
                        Blog
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--color-text-secondary)', maxWidth: '600px' }}>
                        Thoughts on indie hacking, AI development, and building products as a solofounder.
                    </p>
                </div>
            </header>

            {/* Filters */}
            <div className="container" style={{ padding: 'var(--space-2xl) var(--space-xl)' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-lg)', alignItems: 'center', justifyContent: 'space-between' }}>
                    {/* Tags */}
                    <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                        {tags.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => setSelectedTag(tag)}
                                style={{
                                    padding: 'var(--space-sm) var(--space-md)',
                                    background: selectedTag === tag ? 'var(--color-accent)' : 'var(--color-bg-card)',
                                    color: selectedTag === tag ? 'var(--color-bg)' : 'var(--color-text-secondary)',
                                    border: '1px solid',
                                    borderColor: selectedTag === tag ? 'var(--color-accent)' : 'var(--color-border)',
                                    borderRadius: '100px',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s var(--ease-out-expo)',
                                }}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div style={{ position: 'relative' }}>
                        <Search
                            size={18}
                            style={{
                                position: 'absolute',
                                left: 'var(--space-md)',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--color-text-muted)',
                            }}
                        />
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                padding: 'var(--space-sm) var(--space-md)',
                                paddingLeft: 'calc(var(--space-md) + 26px)',
                                background: 'var(--color-bg-card)',
                                border: '1px solid var(--color-border)',
                                borderRadius: '12px',
                                color: 'var(--color-text-primary)',
                                fontSize: '0.875rem',
                                width: '250px',
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Posts Grid */}
            <div className="container" style={{ paddingBottom: 'var(--space-6xl)' }}>
                {filteredPosts.length > 0 ? (
                    <div className="blog-grid">
                        {filteredPosts.map((post) => (
                            <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-card">
                                <div className="blog-card-image">
                                    <Image src={post.image} alt={post.title} width={600} height={340} quality={80} />
                                </div>
                                <div className="blog-card-content">
                                    <div className="blog-card-meta">
                                        <span className="blog-card-tag">{post.tag}</span>
                                        <span>{post.readTime}</span>
                                    </div>
                                    <h3 className="blog-card-title">{post.title}</h3>
                                    <p className="blog-card-excerpt">{post.excerpt}</p>
                                    <span className="blog-card-read">
                                        Read more <ArrowRight size={14} />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: 'var(--space-4xl) 0' }}>
                        <p style={{ color: 'var(--color-text-muted)' }}>No posts found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
