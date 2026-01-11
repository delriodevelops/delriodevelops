'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowUpRight, Search } from 'lucide-react';
import gsap from 'gsap';

// Sample blog posts data (in a real app, this would come from a database or CMS)
const allPosts = [
    {
        slug: 'building-in-public',
        title: 'Why I Build in Public',
        excerpt: 'The journey from corporate developer to indie hacker, and why transparency matters more than ever.',
        tag: 'Indie Hacking',
        date: '2024-01-10',
        image: '/meshmind/2.png',
        readTime: '5 min read',
    },
    {
        slug: 'ai-first-development',
        title: 'AI-First Product Development',
        excerpt: 'How I integrate AI into every product from day one, and why you should too.',
        tag: 'AI',
        date: '2024-01-05',
        image: '/fainancial/2.png',
        readTime: '4 min read',
    },
    {
        slug: 'solopreneur-stack',
        title: 'My Solopreneur Tech Stack 2024',
        excerpt: 'The tools and technologies I use to ship products fast as a one-person team.',
        tag: 'Tools',
        date: '2023-12-20',
        image: '/meshmind/3.png',
        readTime: '6 min read',
    },
    {
        slug: 'from-employee-to-founder',
        title: 'From Employee to Founder: My Story',
        excerpt: 'The scary, exciting, and rewarding journey of quitting my job to build products.',
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
    const listRef = useRef(null);
    const revealRef = useRef(null);

    const filteredPosts = allPosts.filter((post) => {
        const matchesTag = selectedTag === 'All' || post.tag === selectedTag;
        const matchesSearch =
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTag && matchesSearch;
    });

    useEffect(() => {
        const items = document.querySelectorAll('.blog-item');
        const reveal = revealRef.current;
        const revealImg = reveal?.querySelector('img');

        if (!reveal || !items.length) return;

        // Move reveal following mouse
        const moveReveal = (e) => {
            gsap.to(reveal, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: 'power2.out'
            });
        };

        window.addEventListener('mousemove', moveReveal);

        items.forEach((item) => {
            item.addEventListener('mouseenter', () => {
                const img = item.getAttribute('data-img');
                if (revealImg && img) revealImg.src = img;

                gsap.to(reveal, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            item.addEventListener('mouseleave', () => {
                gsap.to(reveal, {
                    opacity: 0,
                    scale: 0.8,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });

        return () => {
            window.removeEventListener('mousemove', moveReveal);
        };
    }, [filteredPosts]); // Re-run when list changes

    return (
        <div style={{ minHeight: '100vh', background: 'var(--color-bg)', overflowX: 'hidden' }}>
            {/* Reveal Image Container */}
            <div
                ref={revealRef}
                className="project-image-reveal"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '400px',
                    height: '250px',
                    pointerEvents: 'none',
                    opacity: 0,
                    zIndex: 20,
                    transform: 'translate(-50%, -50%) scale(0.8)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                }}
            >
                <div className="reveal-inner" style={{ width: '100%', height: '100%' }}>
                    <img
                        src=""
                        alt="Blog Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>
            </div>

            {/* Header */}
            <header style={{ padding: '15vh 0 5vh' }}>
                <div className="container">
                    <Link
                        href="/"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '1rem',
                            color: '#888',
                            textDecoration: 'none',
                            fontSize: '0.9rem',
                            letterSpacing: '0.05em',
                            marginBottom: '4rem',
                            textTransform: 'uppercase',
                            transition: 'color 0.3s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#888')}
                    >
                        <ArrowLeft size={16} />
                        Back home
                    </Link>

                    <span className="section-label" style={{ marginBottom: '1rem', display: 'block' }}>Writing</span>
                    <h1 className="title-monumental" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', lineHeight: 0.9, marginBottom: '2rem' }}>
                        THOUGHTS
                    </h1>

                    {/* Controls Row */}
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '2rem',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '4rem'
                    }}>
                        {/* Tags */}
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {tags.map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => setSelectedTag(tag)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        background: selectedTag === tag ? 'var(--color-accent)' : 'rgba(255,255,255,0.05)',
                                        color: selectedTag === tag ? '#000' : '#888',
                                        border: '1px solid',
                                        borderColor: selectedTag === tag ? 'var(--color-accent)' : 'rgba(255,255,255,0.1)',
                                        borderRadius: '100px',
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        textTransform: 'uppercase',
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div style={{ position: 'relative' }}>
                            <Search
                                size={16}
                                style={{
                                    position: 'absolute',
                                    left: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#666',
                                }}
                            />
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    padding: '0.8rem 1rem',
                                    paddingLeft: '2.5rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '100px',
                                    color: '#fff',
                                    fontSize: '0.9rem',
                                    width: '250px',
                                    outline: 'none',
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--color-accent)'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Blog List - Monumental Style */}
            <section className="container" style={{ paddingBottom: '15vh' }}>
                <div ref={listRef} className="blog-list-container">
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map((post) => (
                            <Link
                                key={post.slug}
                                href={`/blog/${post.slug}`}
                                className="blog-item"
                                data-img={post.image}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 3fr auto',
                                    gap: '2rem',
                                    alignItems: 'center',
                                    padding: '4rem 0',
                                    borderTop: '1px solid rgba(255,255,255,0.1)',
                                    textDecoration: 'none',
                                    position: 'relative',
                                    transition: 'padding-left 0.3s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.paddingLeft = '2rem';
                                    e.currentTarget.querySelector('.blog-title').style.color = 'var(--color-accent)';
                                    const arrow = e.currentTarget.querySelector('.blog-arrow');
                                    if (arrow) {
                                        arrow.style.transform = 'rotate(0deg) scale(1.2)';
                                        arrow.style.color = 'var(--color-accent)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.paddingLeft = '0';
                                    e.currentTarget.querySelector('.blog-title').style.color = '#fff';
                                    const arrow = e.currentTarget.querySelector('.blog-arrow');
                                    if (arrow) {
                                        arrow.style.transform = 'rotate(45deg)';
                                        arrow.style.color = '#888';
                                    }
                                }}
                            >
                                <div style={{ fontFamily: 'var(--font-mono)', color: '#666', fontSize: '0.9rem' }}>
                                    {new Date(post.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                </div>
                                <div>
                                    <h3 className="blog-title" style={{
                                        fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                                        margin: '0 0 0.5rem 0',
                                        transition: 'color 0.3s ease'
                                    }}>
                                        {post.title}
                                    </h3>
                                    <p style={{ margin: 0, color: '#888', maxWidth: '600px' }}>{post.excerpt}</p>
                                </div>
                                <ArrowUpRight
                                    className="blog-arrow"
                                    size={32}
                                    color="#888"
                                    style={{
                                        transform: 'rotate(45deg)',
                                        transition: 'all 0.3s ease'
                                    }}
                                />
                            </Link>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#666' }}>
                            No articles found matching your criteria.
                        </div>
                    )}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }} />
                </div>
            </section>
        </div>
    );
}
