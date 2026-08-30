'use client';

import Link from 'next/link';
import { identity, socials, companies, products, about } from '../../data/profile';
import { formatDuration } from '../../lib/dates';

/**
 * One CV renderer for both languages. `/cv/es` and `/cv/en` used to be two
 * near-identical 300-line files that had already drifted apart.
 *
 * Set as a printed document: single column, hairline rules, dates hanging in
 * the left margin. The screen layout and the print layout are the same, so
 * Cmd-P gives a usable PDF without a second stylesheet.
 */

const COPY = {
  en: {
    speak: 'Languages', code: 'I code', use: 'I use', products: 'My products',
    about: 'About', experience: 'Experience', technologies: 'Stack',
    present: 'Present', download: 'Download PDF', print: 'Print', back: 'Back to site',
    role: 'Curriculum vitae',
  },
  es: {
    speak: 'Idiomas', code: 'Programo', use: 'Utilizo', products: 'Mis productos',
    about: 'Sobre mí', experience: 'Experiencia', technologies: 'Tecnologías',
    present: 'Actualidad', download: 'Descargar PDF', print: 'Imprimir', back: 'Volver al sitio',
    role: 'Currículum',
  },
};

const PDF = {
  en: '/CV_CHRISTIAN_DELRIO_RODRIGUEZ_EN.pdf',
  es: '/CV_CHRISTIAN_DELRIO_RODRIGUEZ_ES.pdf',
};

const CODE_SKILLS = ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue', 'Angular', 'Python', 'Tailwind'];
const TOOL_SKILLS = ['Git', 'GitHub', 'GitLab', 'npm', 'Node', 'Docker', 'PostgreSQL', 'Firebase'];

/** Renders `*emphasis*` markers from the profile data. */
function Highlighted({ text }) {
  return text.split('*').map((chunk, i) => (i % 2 !== 0 ? <mark key={i}>{chunk}</mark> : chunk));
}

function Group({ title, children }) {
  return (
    <section className="ed-cv-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export default function CVPage({ lang = 'en' }) {
  const t = COPY[lang];
  const other = lang === 'en' ? 'es' : 'en';

  return (
    <div className="ed-root">
      <main className="ed-cv ed-page" id="main">
        <div className="ed-cover-head ed-mono ed-cv-download" style={{ marginBottom: '2rem' }}>
          <Link href="/">
            <span aria-hidden="true">←</span> {t.back}
          </Link>
          <Link href={`/cv/${other}`}>{other.toUpperCase()}</Link>
        </div>

        <header className="ed-cv-head">
          <div>
            <h1 className="ed-cv-name">{identity.fullName}</h1>
            <p className="ed-cv-role">
              {identity.role[lang]} — {identity.location[lang]}
            </p>
          </div>

          <div className="ed-cv-contact ed-mono">
            <a href={`mailto:${identity.email}`}>{identity.email}</a>
            <a href={identity.site} target="_blank" rel="noopener noreferrer">iamdelrio.com</a>
            <a href={socials.linkedin} target="_blank" rel="noopener noreferrer">in/iamdelrio</a>
            <a href={socials.github} target="_blank" rel="noopener noreferrer">delriodevelops</a>
          </div>
        </header>

        <Group title={t.about}>
          <p style={{ maxWidth: '62ch', lineHeight: 1.6 }}>{about[lang]}</p>
        </Group>

        <Group title={t.experience}>
          {companies.map((company) => {
            const oldest = company.projects.at(-1);
            const newest = company.projects[0];
            return (
              <div key={company.id} style={{ marginBottom: '1.5rem' }}>
                <div className="ed-cv-entry">
                  <div className="ed-mono">
                    {formatDuration(oldest.dateStart[lang], newest.dateEnd?.[lang])}
                  </div>
                  <div>
                    <div className="ed-cv-entry-company">{company.company}</div>
                    <div className="ed-cv-entry-role">
                      {company.contract[lang]} · {company.remote[lang]} · {company.location[lang]}
                    </div>
                  </div>
                </div>

                {company.projects.map((project) => (
                  <div className="ed-cv-entry" key={project.name}>
                    <div className="ed-mono">
                      {project.dateStart[lang]} —{' '}
                      {project.dateEnd ? project.dateEnd[lang] : t.present}
                    </div>
                    <div>
                      <div className="ed-cv-entry-company">{project.title[lang]}</div>
                      <div className="ed-cv-entry-role">{project.name}</div>

                      <ul className="ed-cv-bullets">
                        {project.description[lang].map((line, i) => (
                          <li key={i}>
                            <Highlighted text={line.replace(/^•\s*/, '')} />
                          </li>
                        ))}
                      </ul>

                      <div className="ed-cv-tags">
                        <span className="ed-mono--signal">{t.technologies}</span>
                        {project.techs.map((tech) => (
                          <span key={tech}>{tech}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </Group>

        <Group title={t.products}>
          <div className="ed-cv-cols">
            {products.map((product) => (
              <a
                key={product.name}
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ed-cv-entry-company"
                style={{ display: 'block', paddingBlock: '0.3rem' }}
              >
                {product.name} <span className="ed-mono">↗</span>
              </a>
            ))}
          </div>
        </Group>

        <div className="ed-cv-cols" style={{ paddingTop: '1.5rem' }}>
          <Group title={t.code}>
            <div className="ed-cv-tags">
              {CODE_SKILLS.map((skill) => <span key={skill}>{skill}</span>)}
            </div>
          </Group>

          <Group title={t.use}>
            <div className="ed-cv-tags">
              {TOOL_SKILLS.map((tool) => <span key={tool}>{tool}</span>)}
            </div>
          </Group>

          <Group title={t.speak}>
            <div className="ed-cv-tags">
              {identity.languages[lang].map((l) => <span key={l}>{l}</span>)}
            </div>
          </Group>
        </div>

        {/* The page no longer auto-downloads the PDF on mount — a page that
            fires a download without being asked is hostile. Both routes are
            explicit now. */}
        <div className="ed-cv-download" style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem', flexWrap: 'wrap' }}>
          <a className="ed-btn ed-btn--solid" href={PDF[lang]} download>
            {t.download}
          </a>
          <button className="ed-btn" type="button" onClick={() => window.print()}>
            {t.print}
          </button>
        </div>
      </main>
    </div>
  );
}
