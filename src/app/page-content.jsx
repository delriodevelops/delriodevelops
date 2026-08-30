'use client';

import Image from 'next/image';
import Link from 'next/link';
import Assistant from '../components/Assistant';
import { identity, socials, skillsCategories, experienceTimeline } from '../data/profile';

const NAV = [
  { href: '#experience', label: 'Experience' },
  { href: '#products', label: 'Products' },
  { href: '#writing', label: 'Writing', needsPosts: true },
  { href: '#contact', label: 'Contact' },
];

const formatDate = (value) =>
  new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

export default function Home({ projects = [], posts = [], totalProjects = 0 }) {
  const shipped = totalProjects || projects.length;
  const years = new Date().getFullYear() - 2021;

  return (
    <>

      {/* ==================== COVER ==================== */}
      <header className="ed-cover ed-page">
        <div className="ed-rail" aria-hidden="true">
          <div className="ed-rail-vertical ed-mono">
            Portfolio — {new Date().getFullYear()} — Málaga 36.7°N
          </div>
        </div>

        <div className="ed-cover-head ed-mono">
          <span className="ed-mono--fg">{identity.name}</span>
          <nav className="ed-cover-nav" aria-label="Sections">
            {NAV.filter((item) => !item.needsPosts || posts.length > 0).map((item) => (
              <a key={item.href} href={item.href}>{item.label}</a>
            ))}
          </nav>
          <span className="ed-mono--signal">● Available</span>
        </div>

        <div className="ed-cover-type">
          <h1 className="ed-name">
            <span>Christian</span>
            <span className="ed-name-2">
              <span className="ed-outline" style={{ display: 'inline' }}>Del</span>{' '}
              <span className="ed-accent" style={{ display: 'inline' }}>Río</span>
            </span>
          </h1>
        </div>

        <div className="ed-cover-foot">
          <p className="ed-cover-blurb">
            Enterprise engineer by day.<br />
            <em>Indie hacker</em> by night.
          </p>

          <dl className="ed-specs ed-mono">
            <dt>Products shipped</dt>
            <dd>{String(shipped).padStart(2, '0')}</dd>
            <dt>Building since</dt>
            <dd>2021 · {years} yrs</dd>
            <dt>Currently</dt>
            <dd>Santander Global Tech</dd>
          </dl>
        </div>
      </header>

      <main id="main">
      {/* ==================== THESIS ==================== */}
      <section className="ed-statement-wrap ed-page">
        <div className="ed-statement-grid">
          <p className="ed-statement-note ed-mono">00 — Thesis</p>
          <h2 className="ed-statement">
            I spend my days inside a bank&apos;s codebase and my nights
            <span className="ed-dim"> shipping the things I actually want to exist. </span>
            The <em>overlap</em> is where the interesting work happens.
          </h2>
        </div>
      </section>

      {/* ==================== EXPERIENCE ==================== */}
      <section className="ed-day ed-page" id="experience">
        <div className="ed-section-head">
          <h2>Experience</h2>
          <span className="ed-mono">01 — Employed work</span>
        </div>

        <div className="ed-exp">
          {experienceTimeline.map((entry) => (
            <article className="ed-exp-item" key={entry.id}>
              <div className="ed-exp-period ed-mono">{entry.period}</div>
              <div>
                <h3 className="ed-exp-company">{entry.company}</h3>
                <p className="ed-exp-role">
                  {entry.role} <span>· {entry.project}</span>
                </p>
                <p className="ed-exp-techs">{entry.techs.slice(0, 9).join(' · ')}</p>
              </div>
            </article>
          ))}
        </div>

        {/* Stack as a specimen index, one column per discipline. */}
        <div className="ed-stack">
          {skillsCategories.map((category, i) => (
            <div className="ed-stack-col" key={category.id}>
              <span className="ed-stack-num ed-mono">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="ed-stack-title">{category.title}</h3>
              <ul className="ed-stack-list">
                {category.tools.map((tool) => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== PRODUCTS ==================== */}
      <section className="ed-night" id="products">
        <div className="ed-night-marker">
          <h2>
            <span className="ed-outline">Products</span>
          </h2>
          <span className="ed-mono">
            02 — {String(projects.length).padStart(2, '0')} shipped alone
          </span>
        </div>

        {projects.map((project, i) => (
          <a
            className="ed-spread"
            data-side={i % 2 === 0 ? 'left' : 'right'}
            key={project.id}
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="ed-spread-index">
              {String(i + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
            </span>

            <figure className="ed-spread-figure">
              {project.image && (
                <Image
                  src={project.image}
                  alt={`${project.title} interface`}
                  width={1200}
                  height={750}
                  sizes="(max-width: 900px) 100vw, 58vw"
                />
              )}
            </figure>

            <div className="ed-spread-body">
              <h3 className="ed-spread-title">{project.title}</h3>
              <div className="ed-spread-detail">
                <p className="ed-spread-desc">{project.description}</p>
                <div className="ed-spread-meta ed-mono">
                  {(project.tags || []).slice(0, 3).map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                  <span className="ed-spread-cta ed-mono--fg">
                    Visit <span aria-hidden="true">↗</span>
                  </span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </section>

      {/* ==================== WRITING ==================== */}
      {posts.length > 0 && (
        <section className="ed-writing ed-page" id="writing">
          <div className="ed-writing-grid">
            <div className="ed-writing-rubric">
              <h2>Writing</h2>
              <p className="ed-mono">03 — Notes on building</p>
              <p className="ed-mono" style={{ marginTop: '1.25rem' }}>
                <Link href="/blog" className="ed-spread-cta ed-mono--fg">
                  All posts <span aria-hidden="true">→</span>
                </Link>
              </p>
            </div>

            <div className="ed-writing-list">
              {posts.map((post, i) => (
                <Link className="ed-post" key={post.slug} href={`/blog/${post.slug}`}>
                  <div className="ed-post-meta ed-mono">
                    <span>{String(i + 1).padStart(2, '0')}</span>
                    <span>{formatDate(post.date)}</span>
                    {post.tag && <span className="ed-mono--signal">{post.tag}</span>}
                  </div>
                  <h3 className="ed-post-title">{post.title}</h3>
                  {post.excerpt && <p className="ed-post-excerpt">{post.excerpt}</p>}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==================== CONTACT ==================== */}
      <section className="ed-contact ed-page" id="contact">
        <span className="ed-mono">04 — Contact</span>
        <a className="ed-contact-mail" href={`mailto:${identity.email}`}>
          hello@<br />iamdelrio.com
        </a>

        <div className="ed-contact-foot ed-mono">
          <div className="ed-socials">
            <a href={socials.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href={socials.github} target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href={socials.twitter} target="_blank" rel="noopener noreferrer">Twitter</a>
            <Link href="/cv/en">CV</Link>
          </div>
          <span>© {new Date().getFullYear()} {identity.fullName}</span>
        </div>
      </section>

      </main>

      <Assistant />
    </>
  );
}
