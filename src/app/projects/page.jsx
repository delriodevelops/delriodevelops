'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Loader2 } from 'lucide-react';
import gsap from 'gsap';
import { getAllProjects } from '../../lib/services/projects-cached';

// Fallback static projects for when Firebase is not configured
const fallbackProjects = [
    {
        id: 1,
        number: '01',
        name: 'CitySwipe',
        description: 'Swipe through cities to find your perfect place to live.',
        image: '/cityswipe.png',
        href: 'https://cityswipe.city',
        tags: ['AI', 'Mobile', 'Lifestyle'],
    },
    {
        id: 2,
        number: '02',
        name: 'DR.NEWS',
        description: 'Stay informed with AI-curated news.',
        image: '/drnews.png',
        href: 'https://drnews.iamdelrio.com/',
        tags: ['AI', 'News', 'Web'],
    },
    {
        id: 3,
        number: '03',
        name: 'My Dog Food',
        description: 'Smart feeding recommendations for your furry friend.',
        image: '/mydogfood.png',
        href: 'https://mydogfood.vercel.app/',
        tags: ['AI', 'Pets', 'Health'],
    },
    {
        id: 4,
        number: '04',
        name: 'Clyme',
        description: "You can't control weather, but you can predict it with Clyme!",
        image: '/clyme.png',
        href: 'https://clyme.vercel.app/',
        tags: ['Utility', 'Weather', 'Web'],
    },
];

export default function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const listRef = useRef(null);
    const revealRef = useRef(null);

    // Fetch projects from Firebase on mount
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const firebaseProjects = await getAllProjects();
                if (firebaseProjects.length > 0) {
                    // Add number formatting
                    const formattedProjects = firebaseProjects.map((project, index) => ({
                        ...project,
                        number: String(index + 1).padStart(2, '0'),
                        category: project.type || project.category || (project.tags && project.tags.includes('Product') ? 'Product' : 'Project'),
                    }));
                    setProjects(formattedProjects);
                } else {
                    // Use fallback if no Firebase projects
                    setProjects(fallbackProjects);
                }
            } catch (error) {
                console.error('Error fetching projects:', error);
                // Use fallback on error
                setProjects(fallbackProjects);
            }
            setIsLoading(false);
        };

        fetchProjects();
    }, []);

    useEffect(() => {
        if (isLoading) return;

        const items = document.querySelectorAll('.project-item');
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
    }, [projects, isLoading]);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--color-bg)', overflowX: 'hidden' }}>
            {/* Reveal Image Container - Fixed Global */}
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
                        src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                        alt="Project Preview"
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

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '4rem' }}>
                        <div>
                            <span className="section-label" style={{ marginBottom: '1rem', display: 'block' }}>Side Projects</span>
                            <h1 className="title-monumental" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', lineHeight: 0.9, marginBottom: '2rem' }}>
                                Projects
                            </h1>
                            <p style={{ fontSize: '1.2rem', color: '#888', maxWidth: '500px', lineHeight: 1.6 }}>
                                Experiments, side projects, and learning adventures.
                                Not polished, but packed with lessons.
                            </p>
                        </div>

                        {/* Toggle */}
                        <div style={{
                            display: 'flex',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '100px',
                            padding: '0.5rem',
                        }}>
                            <Link
                                href="/products"
                                style={{
                                    padding: '0.8rem 2rem',
                                    borderRadius: '100px',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    color: '#888',
                                    textDecoration: 'none',
                                    transition: 'all 0.3s ease',
                                }}
                                onMouseEnter={(e) => e.target.style.color = '#fff'}
                                onMouseLeave={(e) => e.target.style.color = '#888'}
                            >
                                Products
                            </Link>
                            <Link
                                href="/projects"
                                style={{
                                    padding: '0.8rem 2rem',
                                    borderRadius: '100px',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    background: 'var(--color-accent)',
                                    color: '#000',
                                    textDecoration: 'none',
                                }}
                            >
                                Projects
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Projects List - Monumental Style */}
            <section className="container" style={{ paddingBottom: '15vh' }}>
                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '8rem 0' }}>
                        <Loader2
                            size={32}
                            style={{
                                color: 'var(--color-accent)',
                                animation: 'spin 1s linear infinite',
                                marginBottom: '1rem'
                            }}
                        />
                        <p style={{ color: '#666', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem' }}>
                            Loading projects...
                        </p>
                        <style jsx>{`
                            @keyframes spin {
                                from { transform: rotate(0deg); }
                                to { transform: rotate(360deg); }
                            }
                        `}</style>
                    </div>
                ) : (
                    <div ref={listRef} className="projects-list">
                        {projects.map((project) => (
                            <a
                                key={project.id}
                                href={project.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="project-item"
                                data-img={project.image}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '4rem 0',
                                    borderTop: '1px solid rgba(255,255,255,0.1)',
                                    textDecoration: 'none',
                                    position: 'relative',
                                }}
                            >
                                <div>
                                    <h3 className="project-title" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
                                        {project.name}
                                    </h3>
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', color: '#666', fontFamily: 'monospace', textTransform: 'uppercase' }}>
                                        {project.tags?.map((tag, i) => (
                                            <span key={i}>{i > 0 && ' / '}{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right', display: 'none', md: 'block' }} className="project-meta-right">
                                    <span style={{ fontSize: '1.2rem', color: '#444' }}>{project.number} — {(project.category || 'PROJECT').toUpperCase()}</span>
                                </div>
                                <ArrowUpRight className="project-arrow" size={32} color="var(--color-accent)" style={{ opacity: 0.5 }} />
                            </a>
                        ))}
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }} />
                    </div>
                )}
            </section>
        </div>
    );
}