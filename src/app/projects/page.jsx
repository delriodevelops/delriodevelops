'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, ExternalLink } from 'lucide-react';

const projects = [
    {
        id: 1,
        number: '01',
        name: 'CitySwipe',
        description: 'Swipe through cities to find your perfect place to live. AI-powered matching based on your preferences.',
        image: '/cityswipe.png',
        href: 'https://cityswipe.city',
        tags: ['AI', 'Mobile', 'Lifestyle'],
    },
    {
        id: 2,
        number: '02',
        name: 'DR.NEWS',
        description: 'Stay informed with AI-curated news. All the latest info, summarized and personalized.',
        image: '/drnews.png',
        href: 'https://drnews.iamdelrio.com/',
        tags: ['AI', 'News', 'Web'],
    },
    {
        id: 3,
        number: '03',
        name: 'My Dog Food',
        description: 'Smart feeding recommendations for your furry friend. Know exactly what and how much to feed.',
        image: '/mydogfood.png',
        href: 'https://mydogfood.vercel.app/',
        tags: ['AI', 'Pets', 'Health'],
    },
    {
        id: 4,
        number: '04',
        name: 'Clyme',
        description: "You can't control weather, but you can predict it with Clyme! Beautiful, minimal weather app.",
        image: '/clyme.png',
        href: 'https://clyme.vercel.app/',
        tags: ['Utility', 'Weather', 'Web'],
    },
];

export default function ProjectsPage() {
    return (
        <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
            {/* Header */}
            <header style={{ padding: 'var(--space-6xl) 0 var(--space-3xl)' }}>
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
                            transition: 'color 0.3s var(--ease-out-expo)',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                    >
                        <ArrowLeft size={16} />
                        Back home
                    </Link>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 'var(--space-xl)' }}>
                        <div>
                            <span className="section-label">Side Projects</span>
                            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: 'var(--space-md)' }}>
                                Projects
                            </h1>
                            <p style={{ fontSize: '1.125rem', color: 'var(--color-text-secondary)', maxWidth: '500px' }}>
                                Experiments, side projects, and learning adventures.
                                Not all of them are polished, but all of them taught me something.
                            </p>
                        </div>

                        {/* Toggle */}
                        <div style={{
                            display: 'flex',
                            background: 'var(--color-bg-card)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '100px',
                            padding: 'var(--space-xs)',
                        }}>
                            <Link
                                href="/products"
                                style={{
                                    padding: 'var(--space-sm) var(--space-lg)',
                                    borderRadius: '100px',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    color: 'var(--color-text-muted)',
                                    textDecoration: 'none',
                                    transition: 'all 0.3s var(--ease-out-expo)',
                                }}
                            >
                                Products
                            </Link>
                            <Link
                                href="/projects"
                                style={{
                                    padding: 'var(--space-sm) var(--space-lg)',
                                    borderRadius: '100px',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    background: 'var(--color-accent)',
                                    color: 'var(--color-bg)',
                                    textDecoration: 'none',
                                }}
                            >
                                Projects
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Projects Grid */}
            <section className="container" style={{ paddingBottom: 'var(--space-6xl)' }}>
                <div className="projects-grid">
                    {projects.map((project) => (
                        <a
                            key={project.id}
                            href={project.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="project-card"
                            style={{ opacity: 1, transform: 'none' }}
                        >
                            <div className="project-card-image">
                                <Image
                                    src={project.image}
                                    alt={project.name}
                                    width={800}
                                    height={500}
                                    quality={85}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                            <div className="project-card-content">
                                <div className="project-card-number">{project.number}</div>
                                <h3 className="project-card-title">{project.name}</h3>
                                <p className="project-card-description">{project.description}</p>
                                <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-md)', flexWrap: 'wrap' }}>
                                    {project.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            style={{
                                                padding: 'var(--space-xs) var(--space-sm)',
                                                background: 'var(--color-accent-muted)',
                                                color: 'var(--color-accent)',
                                                fontSize: '0.75rem',
                                                fontWeight: '600',
                                                borderRadius: '100px',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em',
                                            }}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section style={{ padding: 'var(--space-4xl) 0', borderTop: '1px solid var(--color-border)' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: 'var(--space-lg)' }}>
                        Want to see my main products?
                    </h2>
                    <Link href="/products" className="btn btn-primary">
                        View Products
                        <ArrowUpRight size={18} />
                    </Link>
                </div>
            </section>
        </div>
    );
}