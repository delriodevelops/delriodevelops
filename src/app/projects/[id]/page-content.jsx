'use client';

import { useRef } from 'react';
import Link from 'next/link';
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

// `project` and `next` (the following case in the same archive) come from page.jsx
export default function ProjectDetailContent({ project, next = null }) {
    const rootRef = useRef(null);

    const { lenisRef, onEntered } = useGridbreakPage(rootRef);

    const name = project?.name || project?.title;
    const year = project ? new Date(project.date || project.createdAt).getFullYear() : '';
    const liveUrl = project?.liveUrl || project?.href;
    const archive =
        project && isProduct(project)
            ? { href: '/products', label: 'Products' }
            : { href: '/projects', label: 'Projects' };

    return (
        <div className="gb" ref={rootRef}>
            <GridbreakEnter onDone={onEntered} tone="red" />
            <GridbreakProgress />
            <GridbreakNav active={archive.label.toLowerCase()} lenisRef={lenisRef} />

            {/* page.jsx calls notFound() for unknown ids, so a project is always present */}
            <main id="main">
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
                            <a
                                href={liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="gb-btn"
                                style={{ marginTop: 48 }}
                            >
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

            <GridbreakChat />
        </div>
    );
}
