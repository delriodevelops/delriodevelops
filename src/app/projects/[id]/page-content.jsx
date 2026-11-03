'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getAllProjects, getProjectById } from '../../../lib/services/projects';
import GridbreakChat from '../../../components/gridbreak-chat';
import {
    GridbreakEnter,
    GridbreakFooter,
    GridbreakNav,
    GridbreakProgress,
    useGridbreakPage,
} from '../../../components/gridbreak-shell';
import '../../gridbreak.css';
import '../../gridbreak-pages.css';

const isProduct = (p) => (p.type || p.category || '').toUpperCase() === 'PRODUCT';

export default function ProjectDetailPage() {
    const { id } = useParams();
    const rootRef = useRef(null);
    const [project, setProject] = useState(null);
    const [next, setNext] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const { lenisRef, onEntered } = useGridbreakPage(rootRef, { ready: !isLoading, deps: [project] });

    useEffect(() => {
        const fetchProject = async () => {
            if (!id) return;
            try {
                const [data, all] = await Promise.all([getProjectById(id), getAllProjects()]);
                setProject(data);
                if (data && all.length > 1) {
                    // next item within the same archive (products stay with products)
                    const siblings = all.filter((p) => isProduct(p) === isProduct(data));
                    const index = siblings.findIndex((p) => p.id === data.id);
                    if (siblings.length > 1 && index !== -1) setNext(siblings[(index + 1) % siblings.length]);
                }
            } catch (error) {
                console.error('Error fetching project:', error);
            }
            setIsLoading(false);
        };

        fetchProject();
    }, [id]);

    const name = project?.name || project?.title;
    const year = project ? new Date(project.date || project.createdAt).getFullYear() : '';
    const liveUrl = project?.liveUrl || project?.href;
    const archive = project && isProduct(project) ? { href: '/products', label: 'Products' } : { href: '/projects', label: 'Projects' };

    return (
        <div className="gb" ref={rootRef}>
            <GridbreakEnter onDone={onEntered} tone="red" />
            <GridbreakProgress />
            <GridbreakNav active={archive.label.toLowerCase()} lenisRef={lenisRef} />

            {isLoading ? (
                <div className="gb-state gb-phead--red" aria-busy="true">
                    <span className="gb-mono">Loading case study…</span>
                </div>
            ) : !project ? (
                <div className="gb-state gb-phead--ink">
                    <span className="gb-mono">Error 404</span>
                    <h1 className="gb-ptitle gb-cx">Not found</h1>
                    <Link href="/projects" className="gb-btn">
                        ← Back to projects
                    </Link>
                </div>
            ) : (
                <main>
                    <header className="gb-case-hero">
                        <div className="gb-crumbs gb-mono">
                            <Link href={archive.href}>← {archive.label}</Link>
                            <span>
                                {project.type || 'Project'} — {year}
                            </span>
                        </div>
                        <h1 className="gb-case-title gb-cx" data-gb-chars data-speed="-0.3" data-skew>
                            {name}
                        </h1>
                        <dl className="gb-spec gb-mono" data-gb-stagger data-gb-delay="0.3">
                            <div>
                                <dt>Role</dt>
                                <dd>Design &amp; development</dd>
                            </div>
                            <div>
                                <dt>Stack</dt>
                                <dd>{(project.tags || []).join(' / ') || '—'}</dd>
                            </div>
                            <div>
                                <dt>Year</dt>
                                <dd>{year || '—'}</dd>
                            </div>
                            <div>
                                <dt>Links</dt>
                                <dd>
                                    {liveUrl && (
                                        <a href={liveUrl} target="_blank" rel="noopener noreferrer">
                                            Live site ↗
                                        </a>
                                    )}
                                    {project.githubUrl && (
                                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                            GitHub ↗
                                        </a>
                                    )}
                                    {!liveUrl && !project.githubUrl && '—'}
                                </dd>
                            </div>
                        </dl>
                    </header>

                    {project.image && (
                        <div className="gb-case-cover" data-gb-expand>
                            <img src={project.image} alt={`${name} cover`} />
                        </div>
                    )}

                    <section className="gb-case-body" data-wipe>
                        <aside className="gb-case-aside">
                            <p className="gb-mono" style={{ margin: '0 0 16px', color: 'var(--gb-mute-on-bone)' }}>
                                (01) — Overview
                            </p>
                            <h2 className="gb-cx" data-gb-chars>
                                The brief
                            </h2>
                        </aside>
                        <div>
                            <p className="gb-case-text" data-gb-lines>
                                {project.description}
                            </p>
                            {project.longDescription && (
                                <p className="gb-case-text gb-case-text--long" data-gb-lines>
                                    {project.longDescription}
                                </p>
                            )}
                            {liveUrl && (
                                <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="gb-btn" style={{ marginTop: 48 }}>
                                    Visit {name} ↗
                                </a>
                            )}
                        </div>
                    </section>

                    {project.gallery?.length > 0 && (
                        <section className="gb-gallery" aria-label="Gallery">
                            {project.gallery.map((img, i) => (
                                <figure
                                    key={img}
                                    className={i % 3 === 0 ? 'is-wide' : ''}
                                    data-gb-clip
                                    data-speed={i % 3 === 0 ? undefined : i % 3 === 1 ? '0.12' : '-0.18'}
                                >
                                    <img src={img} alt={`${name} — image ${i + 1}`} loading="lazy" />
                                </figure>
                            ))}
                        </section>
                    )}

                    {next && (
                        <Link href={`/projects/${next.id}`} className="gb-next">
                            <span className="gb-mono">Next case —&gt;</span>
                            <span className="gb-next-name gb-cx" data-drift="12">
                                {next.name || next.title}
                            </span>
                        </Link>
                    )}

                    <GridbreakFooter lenisRef={lenisRef} />
                </main>
            )}

            <GridbreakChat />
        </div>
    );
}
