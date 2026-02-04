'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Github, Calendar, Loader2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getProjectById } from '../../../lib/services/projects';

// Register GSAP plugins
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function ProjectDetailPage() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const containerRef = useRef(null);

    useEffect(() => {
        const fetchProject = async () => {
            if (!id) return;
            try {
                const data = await getProjectById(id);
                setProject(data);
            } catch (error) {
                console.error('Error fetching project:', error);
            }
            setIsLoading(false);
        };

        fetchProject();
    }, [id]);

    // Animations
    useEffect(() => {
        if (isLoading || !project) return;

        const ctx = gsap.context(() => {
            // Header animation
            gsap.from('.project-header-reveal', {
                y: 100,
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                ease: 'power3.out'
            });

            // Image reveal
            gsap.utils.toArray('.gallery-image').forEach((img, i) => {
                gsap.from(img, {
                    scrollTrigger: {
                        trigger: img,
                        start: 'top 80%',
                    },
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power2.out'
                });
            });
        }, containerRef);

        return () => ctx.revert();
    }, [isLoading, project]);

    if (isLoading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
                <Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-accent)' }} />
            </div>
        );
    }

    if (!project) {
        return (
            <div style={{ padding: '20vh 0', textAlign: 'center', background: 'var(--color-bg)', minHeight: '100vh' }}>
                <h1 className="title-monumental">PROJECT NOT FOUND</h1>
                <Link href="/projects" className="magnetic-btn" style={{ marginTop: '2rem', display: 'inline-block' }}>
                    Back to Works
                </Link>
            </div>
        );
    }

    return (
        <div ref={containerRef} style={{ background: 'var(--color-bg)', minHeight: '100vh', paddingBottom: '10vh' }}>
            {/* Header */}
            <header style={{ padding: '15vh 0 5vh' }}>
                <div className="container">
                    <Link
                        href="/projects"
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
                        }}
                    >
                        <ArrowLeft size={16} />
                        Back to Works
                    </Link>

                    <span className="section-label project-header-reveal" style={{ display: 'block', marginBottom: '1rem' }}>
                        {project.type || 'Project'} — {new Date(project.date || project.createdAt).getFullYear()}
                    </span>

                    <h1 className="title-monumental project-header-reveal" style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', lineHeight: 0.9, marginBottom: '4rem' }}>
                        {project.name || project.title}
                    </h1>

                    <div className="project-info-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '4rem',
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        paddingTop: '2rem'
                    }}>
                        <div className="project-header-reveal">
                            <span style={{ display: 'block', color: '#666', marginBottom: '0.5rem', fontSize: '0.8rem', textTransform: 'uppercase' }}>Role</span>
                            <span style={{ fontSize: '1.1rem' }}>Design & Development</span>
                        </div>
                        <div className="project-header-reveal">
                            <span style={{ display: 'block', color: '#666', marginBottom: '0.5rem', fontSize: '0.8rem', textTransform: 'uppercase' }}>Stack</span>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {project.tags?.map(tag => (
                                    <span key={tag} style={{ fontSize: '1.1rem' }}>{tag}</span>
                                ))}
                            </div>
                        </div>
                        <div className="project-header-reveal">
                            <span style={{ display: 'block', color: '#666', marginBottom: '0.5rem', fontSize: '0.8rem', textTransform: 'uppercase' }}>Links</span>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                {(project.liveUrl || project.href) && (
                                    <a href={project.liveUrl || project.href} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent)', textDecoration: 'none' }}>
                                        Live Site <ArrowUpRight size={16} />
                                    </a>
                                )}
                                {project.githubUrl && (
                                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#fff', textDecoration: 'none' }}>
                                        GitHub <Github size={16} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Cover Image */}
            <div className="container-wide" style={{ marginBottom: '8rem' }}>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', borderRadius: '4px' }}>
                    <Image
                        src={project.image}
                        alt={project.name}
                        fill
                        className="project-header-reveal"
                        style={{ objectFit: 'cover' }}
                        priority
                    />
                </div>
            </div>

            {/* Description */}
            <section className="container" style={{ marginBottom: '8rem' }}>
                <div style={{ maxWidth: '800px', marginLeft: 'auto' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '2rem', fontWeight: 300 }}>Overview</h2>
                    <div style={{ fontSize: '1.2rem', lineHeight: 1.6, color: '#aaa', whiteSpace: 'pre-line' }}>
                        {project.description}

                        {/* Fallback to long description if available (future proofing) */}
                        {project.longDescription && (
                            <div style={{ marginTop: '2rem' }}>
                                {project.longDescription}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Gallery */}
            {project.gallery && project.gallery.length > 0 && (
                <section className="container-wide" style={{ marginBottom: '8rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
                        {project.gallery.map((img, i) => (
                            <div
                                key={i}
                                className="gallery-image"
                                style={{
                                    gridColumn: i % 3 === 0 ? 'span 2' : 'span 1',
                                    position: 'relative',
                                    aspectRatio: i % 3 === 0 ? '16/9' : '4/5',
                                    borderRadius: '4px',
                                    overflow: 'hidden'
                                }}
                            >
                                <Image
                                    src={img}
                                    alt={`Gallery image ${i + 1}`}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Next Project Navigation could go here */}
        </div>
    );
}
