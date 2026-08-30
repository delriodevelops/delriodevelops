'use client';

import Image from 'next/image';
import Link from 'next/link';

const formatDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? null
    : date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
};

export default function ProjectDetailPage({ project = null }) {
  if (!project) {
    return (
      <main className="ed-page" id="main" style={{ paddingBlock: '8rem' }}>
        <h1 className="ed-masthead-title">Not found</h1>
        <Link href="/projects" className="ed-article-back ed-mono">
          <span aria-hidden="true">←</span> Back to work
        </Link>
      </main>
    );
  }

  const name = project.name || project.title || 'Project';
  const live = project.href || project.liveUrl;
  const date = formatDate(project.date || project.createdAt);
  const gallery = project.gallery?.length ? project.gallery : [project.image].filter(Boolean);

  return (
    <article className="ed-case ed-page" id="main">
      <header className="ed-case-head">
        <Link href="/projects" className="ed-article-back ed-mono">
          <span aria-hidden="true">←</span> Work
        </Link>

        {project.type && <div className="ed-mono ed-mono--signal">{project.type}</div>}

        <h1 className="ed-case-title">{name}</h1>
      </header>

      <dl className="ed-case-facts ed-mono">
        {date && (
          <div className="ed-case-fact">
            <dt>Date</dt>
            <dd>{date}</dd>
          </div>
        )}

        {(project.tags || []).length > 0 && (
          <div className="ed-case-fact">
            <dt>Stack</dt>
            <dd>{project.tags.join(' · ')}</dd>
          </div>
        )}

        {live && (
          <div className="ed-case-fact">
            <dt>Live</dt>
            <dd>
              <a
                className="ed-spread-cta ed-mono--fg"
                href={live}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit <span aria-hidden="true">↗</span>
              </a>
            </dd>
          </div>
        )}

        {project.githubUrl && (
          <div className="ed-case-fact">
            <dt>Source</dt>
            <dd>
              <a
                className="ed-spread-cta ed-mono--fg"
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub <span aria-hidden="true">↗</span>
              </a>
            </dd>
          </div>
        )}
      </dl>

      {project.description && <p className="ed-case-lede">{project.description}</p>}

      {project.longDescription && (
        <div className="ed-case-body ed-prose">
          {project.longDescription
            .split('\n')
            .filter((line) => line.trim())
            .map((line, i) => (
              <p key={i}>{line}</p>
            ))}
        </div>
      )}

      {gallery.length > 0 && (
        <div className="ed-case-gallery">
          {gallery.map((src, i) => (
            <figure key={src}>
              <div className="ed-plate">
                <Image
                  src={src}
                  alt={`${name} — view ${i + 1}`}
                  width={1600}
                  height={1000}
                  sizes="(max-width: 1000px) 100vw, 60vw"
                  priority={i === 0}
                />
              </div>
              <figcaption className="ed-plate-caption ed-mono">
                <span>{name}</span>
                <span>{String(i + 1).padStart(2, '0')} / {String(gallery.length).padStart(2, '0')}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      <footer className="ed-article-foot ed-mono" style={{ maxWidth: 'none' }}>
        <Link href="/projects">← All work</Link>
        {live && (
          <a href={live} target="_blank" rel="noopener noreferrer" className="ed-btn ed-btn--solid">
            Visit {name} ↗
          </a>
        )}
      </footer>
    </article>
  );
}
