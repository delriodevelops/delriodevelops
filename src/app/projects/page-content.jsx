'use client';

import Link from 'next/link';

export default function ProjectsPageContent({ projects = [] }) {
  return (
    <>

      <header className="ed-masthead ed-page">
        <Link href="/" className="ed-article-back ed-mono">
          <span aria-hidden="true">←</span> Christian Del Río
        </Link>

        <h1 className="ed-masthead-title">Work</h1>

        <p className="ed-masthead-lede">
          Side projects, experiments and things built to answer a question. Smaller than the
          products, and more honest about it.
        </p>
      </header>

      <main className="ed-index-page ed-page" id="main">
        {projects.length === 0 ? (
          <p className="ed-mono" style={{ paddingBlock: '3rem' }}>Nothing here yet.</p>
        ) : (
          <>
            <div
              className="ed-mono"
              style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0' }}
            >
              <span>Index</span>
              <span>{String(projects.length).padStart(2, '0')} entries</span>
            </div>

            {projects.map((project, i) => (
              <Link className="ed-index-row" key={project.id} href={`/projects/${project.id}`}>
                <span className="ed-mono">{String(i + 1).padStart(2, '0')}</span>

                <div>
                  <h2 className="ed-index-row-title">{project.name || project.title}</h2>
                  {project.description && (
                    <p className="ed-index-row-excerpt">{project.description}</p>
                  )}
                  {(project.tags || []).length > 0 && (
                    <div className="ed-cv-tags">
                      {project.tags.slice(0, 4).map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="ed-index-row-side ed-mono">
                  <div>{project.category}</div>
                  <div style={{ marginTop: '0.4rem' }}>Read ↗</div>
                </div>
              </Link>
            ))}
          </>
        )}
      </main>
    </>
  );
}
