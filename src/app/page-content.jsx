'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GridbreakChat from '../components/gridbreak-chat';
import { initGridbreakMotion, playGridbreakIntro } from '../components/gridbreak-motion';
import { initScrollFx } from '../components/gridbreak-scroll-fx';
import {
  CITY,
  GRID_CELLS,
  GridbreakNav,
  SOCIALS,
  forceMotion,
  formatDate,
  prefersReducedMotion,
  useLenis,
  useLocalClock,
} from '../components/gridbreak-shell';
import { companies, experienceTimeline, identity, skillsCategories } from '../data/profile';
import './gridbreak.css';

const city = CITY;

// Timeline rows: the engagement is the headline, the employer sits in the meta line
const experience = experienceTimeline.map((entry) => ({
  id: entry.id,
  headline: entry.project,
  employer: entry.company.split(' ')[0].toUpperCase(),
  role: entry.role,
  period: entry.period,
  responsibilities: entry.responsibilities.slice(0, 3),
}));

// Earliest year that appears in the CV timeline
const careerStart = Math.min(...experienceTimeline.map((e) => Number(e.period.match(/\d{4}/)?.[0] ?? Infinity)));
const currentRole = experienceTimeline[0];
const previousEmployer = companies[1]?.company.split(' ')[0].toUpperCase();

const navLinks = [
  { id: 'work', label: 'Work', href: '/#work' },
  { id: 'concepts', label: 'Concepts', href: '/#concepts' },
  { id: 'info', label: 'Info', href: '/#info' },
  { id: 'stack', label: 'Stack', href: '/#stack' },
  { id: 'notes', label: 'Notes', href: '/#notes' },
  { id: 'contact', label: 'Contact', href: '/#contact' },
];

const marqueeItems = ['Indie hacker', 'Solobuilder', 'Full stack', 'AI engineer', 'Product maker'];

// The trailer: the showreel (rendered by scripts/make-reel.sh), the home's one full-screen film, its
// playhead on the scrollbar. `shots` lists the projects in the order they appear; a shot lasts
// `shotLength` seconds of video, or its own when written { name, seconds }, and takes a stretch of
// scroll in proportion. The montage speeds up: the products at 2 s each, then eight concept sites
// cut fast at 22 frames (of 24 a second) each.
const CONCEPT_SHOT = 22 / 24;
const REEL = {
  src: '/reel/showreel.mp4',
  poster: '/reel/showreel-poster.jpg',
  shotLength: 2,
  shots: [
    'Fainancial', 'MeshMind', 'CitySwipe', 'Billonario', 'Motorsportive', 'Baitme', 'Clyme', 'DR.NEWS', 'My Dog Food', 'Escudo Leal',
    ...['FRACTURA', 'ÓRBITA', 'BLOOP', 'KERN', 'Casa Alba', 'GRIETA', 'Lumbre', 'Atolón'].map((name) => ({ name, seconds: CONCEPT_SHOT })),
  ],
};

// "5–19 Nov 2026" (or "28 Oct – 9 Nov 2026") from two ISO dates, for the concept sites' pace line
const formatSpan = (from, to) => {
  const opts = { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' };
  const [a, b] = [new Date(from), new Date(to)];
  const fmt = (d, o) => new Intl.DateTimeFormat('en-GB', o).format(d);
  if (fmt(a, opts) === fmt(b, opts)) return fmt(a, opts);
  if (a.getUTCMonth() === b.getUTCMonth() && a.getUTCFullYear() === b.getUTCFullYear()) {
    return `${a.getUTCDate()}–${fmt(b, opts)}`;
  }
  return `${fmt(a, { day: 'numeric', month: 'short', timeZone: 'UTC' })} – ${fmt(b, opts)}`;
};

const heroLetters = ['D', 'E', 'L', 'R', 'Í', 'O'];
const panelTones = ['bone', 'red', 'ink'];

// The full counter intro plays once per session; later visits get the short grid drop
const INTRO_SEEN_KEY = 'gb-intro-seen';

/**
 * Home. Data is fetched on the server (page.jsx) and passed in, so the page is
 * crawlable and never flashes placeholder content.
 */
export default function Home({ projects: rawProjects = [], posts = [], totalProjects = 0, concepts = [], conceptPace = null }) {
  const rootRef = useRef(null);
  const lenisRef = useLenis({ startStopped: true });
  const clock = useLocalClock();
  const [introDone, setIntroDone] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const projects = rawProjects.map((project) => ({
    ...project,
    href: `/projects/${project.id}`,
    external: false,
  }));
  const blogPosts = posts;

  // Intro waits for fonts so split text measures correctly
  useEffect(() => {
    let cancelled = false;
    let seen = false;
    try {
      seen = sessionStorage.getItem(INTRO_SEEN_KEY) === '1';
      sessionStorage.setItem(INTRO_SEEN_KEY, '1');
    } catch {
      // storage blocked: just play the full intro
    }
    window.scrollTo(0, 0);

    document.fonts.ready
      .then(() => playGridbreakIntro(rootRef.current, { reduced: prefersReducedMotion(), short: seen }))
      .then(() => {
        if (cancelled) return;
        lenisRef.current?.start();
        setIntroDone(true);
      });

    return () => {
      cancelled = true;
    };
  }, [lenisRef]);

  // Scroll choreography (data is server-rendered, so it is built once)
  useEffect(() => {
    if (!introDone || !rootRef.current) return;
    const force = forceMotion();
    const mm = initGridbreakMotion(rootRef.current, { onSection: setActiveSection, forceMotion: force });
    // parallax layer goes on after the pins so its triggers account for pin spacing
    const fx = initScrollFx(rootRef.current, { forceMotion: force, lenis: lenisRef.current });
    ScrollTrigger.refresh();
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    return () => {
      window.removeEventListener('load', refresh);
      fx.revert();
      mm.revert();
    };
  }, [introDone, lenisRef]);

  // Arriving from another page via /#section: land there once the pins exist
  useEffect(() => {
    if (!introDone) return;
    const id = window.location.hash.slice(1);
    if (!id) return;
    const t = setTimeout(() => {
      const target = document.getElementById(id);
      if (target) lenisRef.current?.scrollTo(target, { duration: 1.8 });
    }, 150);
    return () => clearTimeout(t);
  }, [introDone, lenisRef]);

  const scrollToSection = (id) => {
    const target = id === 'top' ? 0 : document.getElementById(id);
    if (target === null) return;
    history.replaceState(null, '', id === 'top' ? '/' : `/#${id}`);
    // wait a frame so a closing menu releases the scroll lock first
    requestAnimationFrame(() => lenisRef.current?.scrollTo(target, { duration: 1.6 }));
  };

  const yearsCoding = new Date().getFullYear() - careerStart;

  return (
    <div className="gb" ref={rootRef}>
      {/* ==================== INTRO ==================== */}
      <div className="gb-loader" aria-hidden="true">
        <div className="gb-loader-grid">
          {GRID_CELLS.map((_, i) => (
            <span key={i} className="gb-loader-cell" />
          ))}
        </div>
        <div className="gb-loader-meta">
          <span className="gb-loader-count">000</span>
          <span className="gb-mono">Christian Del Río — Portfolio ©{new Date().getFullYear()}</span>
        </div>
      </div>

      <div className="gb-progress" aria-hidden="true" />

      <GridbreakNav
        links={navLinks}
        active={activeSection}
        lenisRef={lenisRef}
        onLinkClick={(link, e) => {
          e.preventDefault();
          scrollToSection(link.id);
        }}
        onLogoClick={(e) => {
          e.preventDefault();
          scrollToSection('top');
        }}
      />

      <main id="main">
        {/* ==================== HERO ==================== */}
        <div className="gb-hero-wrap" data-section="top">
          <section className="gb-hero">
            <div className="gb-hero-inner">
              <div className="gb-hero-ghost gb-wx" aria-hidden="true">
                Portfolio — Engineer — Builder — ©{new Date().getFullYear()} — Portfolio — Engineer —
              </div>
              <h1 className="gb-hero-name gb-cx" aria-label="Christian Del Río">
                {heroLetters.map((l, i) => [
                  i === 3 && <span key="gap" className="gb-hero-gap" aria-hidden="true" />,
                  <span key={i} className="gb-hero-letter" aria-hidden="true">
                    {l}
                  </span>,
                ])}
              </h1>

              <div className="gb-cut gb-mono">
                <div className="gb-cut-meta">
                  <span>(001) — Engineer &amp; builder</span>
                  <span>Cut along line —&gt;</span>
                </div>
                <div className="gb-cut-line" />
              </div>

              <div className="gb-hero-info">
                <div className="gb-hero-who">
                  <div className="gb-hero-portrait">
                    <img src="/me.webp" alt="Portrait of Christian Del Río" />
                  </div>
                  <p className="gb-hero-title gb-cx">
                    Christian
                    <br />
                    Del Río
                  </p>
                </div>
                <p className="gb-mono" style={{ margin: 0 }}>
                  Full-stack engineer
                  <br />
                  Product builder
                </p>
                <p className="gb-mono" style={{ margin: 0 }}>
                  Santander — by day
                  <br />
                  Indie AI — by night
                </p>
                <p className="gb-hero-lede">
                  I design, code and launch software products — from critical banking apps to my own AI tools. Scroll to
                  see the work.
                </p>
              </div>
            </div>

            <div className="gb-cover" aria-hidden="true">
              {GRID_CELLS.map((_, i) => (
                <span key={i} className="gb-cover-cell" />
              ))}
            </div>
          </section>
        </div>

        {/* ==================== MANIFESTO ==================== */}
        {/* scene: lines arrive like subtitles, then the camera dives into "SHIP." */}
        <div className="gb-scene-wrap gb-manifesto-wrap">
          <section className="gb-manifesto gb-scene gb-has-bignum" aria-label="Manifesto">
            <span className="gb-bignum gb-cx" data-speed="-0.6" aria-hidden="true">
              02
            </span>
            <div className="gb-section-head gb-mono">
              <span>(002) — Manifesto</span>
              <span>{city}, ES</span>
            </div>
            <p className="gb-mlines" style={{ margin: 0 }}>
              <span className="gb-mline" data-skew>
                <span className="gb-cx">I build</span> <span className="gb-wx">products</span>
              </span>
              <span className="gb-mline gb-mline--r gb-mline--hero" data-skew>
                <span className="gb-wx">that</span> <span className="gb-cx gb-hl">ship.</span>
              </span>
              <span className="gb-mline" data-skew>
                <span className="gb-cx">No decks.</span> <span className="gb-wx">Just</span>
              </span>
              <span className="gb-mline gb-mline--r" data-skew>
                <span className="gb-cx">working</span> <span className="gb-wx">software.</span>
              </span>
            </p>
          </section>
        </div>

        {/* ==================== MARQUEE ==================== */}
        <div className="gb-marquee" aria-hidden="true">
          <div className="gb-marquee-track">
            {[0, 1].map((dup) => (
              <div key={dup} style={{ display: 'flex' }}>
                {[...marqueeItems, ...marqueeItems].map((item, i) => (
                  <span key={`${dup}-${i}`} className="gb-marquee-item gb-cx">
                    {item} <i />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <section className="gb-manifesto gb-manifesto--notes" aria-label="Day and night">
          <div className="gb-footnotes gb-mono">
            <div>
              <span>(a) Day</span>
              <p>Full-stack developer at Santander, building an internal wholesale lending platform.</p>
            </div>
            <div>
              <span>(b) Night</span>
              <p>Indie hacker shipping AI-powered products — design, code, launch, support.</p>
            </div>
            <div>
              <span>(c) Always</span>
              <p>Building in public since 2023, sharing what works and what doesn&apos;t.</p>
            </div>
          </div>
        </section>

        {/* ==================== TRAILER ==================== */}
        {/* scene: the letterboxed showreel, the home's one full-screen film — its playhead is the scrollbar */}
        <div className="gb-scene-wrap gb-reel-wrap">
          <section className="gb-reel gb-scene" aria-label="Showreel">
            <video
              className="gb-reel-video"
              src={REEL.src}
              poster={REEL.poster}
              muted
              playsInline
              preload="none"
              data-shot={REEL.shotLength}
              aria-label="Showreel of Christian's work"
            />
            <div className="gb-reel-titles" aria-hidden="true">
              {REEL.shots.map((shot) => {
                const { name, seconds = REEL.shotLength } = typeof shot === 'string' ? { name: shot } : shot;
                return (
                  <p key={name} className="gb-reel-title gb-cx" data-seconds={seconds}>
                    {name}
                  </p>
                );
              })}
            </div>
            <div className="gb-reel-bar gb-reel-bar--top" aria-hidden="true" />
            <div className="gb-reel-bar gb-reel-bar--bottom" aria-hidden="true" />
            <div className="gb-reel-hud gb-reel-hud--top gb-mono" aria-hidden="true">
              <span>
                <span className="gb-dot" style={{ color: 'var(--gb-red)' }} />
                Rec — Showreel
              </span>
              <span className="gb-reel-tc">00:00:00:00</span>
            </div>
            <div className="gb-reel-hud gb-reel-hud--bottom gb-mono" aria-hidden="true">
              <span>CDR ©{new Date().getFullYear()}</span>
              <span className="gb-reel-count">01 / {String(REEL.shots.length).padStart(2, '0')}</span>
            </div>
          </section>
        </div>

        {/* ==================== WORK ==================== */}
        <div id="work" className="gb-work-wrap" data-section="work">
          <section className="gb-work" aria-label="Selected work">
            <div className="gb-work-head gb-mono">
              <span>(003) — Selected work</span>
              <span>{totalProjects} products shipped</span>
            </div>

            <div className="gb-track" data-skew="x">
              <div className="gb-panel gb-panel--intro">
                <p className="gb-mono" style={{ margin: '0 0 24px', color: 'var(--gb-mute-on-ink)' }}>
                  Keep scrolling —&gt;
                </p>
                <h2 className="gb-cx" style={{ margin: 0, fontSize: 'clamp(80px, 12vw, 210px)', lineHeight: 0.8 }}>
                  Selected
                  <br />
                  <span className="gb-wx">work</span>
                </h2>
              </div>

              {projects.map((project, i) => {
                const tone = panelTones[i % panelTones.length];
                const linkProps = project.external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
                const Wrapper = project.external ? 'a' : Link;
                return (
                  <Wrapper
                    key={project.id}
                    href={project.href}
                    {...linkProps}
                    className={`gb-panel gb-panel--${tone}`}
                    data-project={project.number}
                  >
                    <div className="gb-panel-top gb-mono">
                      <span>
                        Work {project.number} / {String(projects.length).padStart(2, '0')}
                      </span>
                      <span>{project.external ? 'Live site ↗' : 'Case study →'}</span>
                    </div>
                    <div className="gb-panel-media">
                      {project.image && <img src={project.image} alt={`${project.title} screenshot`} loading="lazy" />}
                      {/* a few seconds of its launch film, looping without sound while the panel is centred
                          (gridbreak-motion loads it as the panel nears); until then, and without motion, the shot */}
                      {project.clip && (
                        <video
                          className="gb-panel-video"
                          data-src={project.clip}
                          muted
                          loop
                          playsInline
                          preload="none"
                          aria-hidden="true"
                          tabIndex={-1}
                        />
                      )}
                      <span className="gb-panel-num gb-cx" aria-hidden="true">
                        {project.number}
                      </span>
                    </div>
                    <div className="gb-panel-foot">
                      <h3 className="gb-panel-title gb-cx">{project.title}</h3>
                      <div>
                        <p className="gb-panel-desc">{project.description}</p>
                        <div className="gb-tags gb-mono">
                          {project.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="gb-tag">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Wrapper>
                );
              })}

              <div className="gb-panel gb-panel--end">
                <span className="gb-mono">
                  {totalProjects > projects.length
                    ? `+${totalProjects - projects.length} more in the archive`
                    : 'The archive'}
                </span>
                <Link href="/projects" className="gb-big-link gb-cx">
                  All projects <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            <div className="gb-work-ui gb-mono" aria-hidden="true">
              <span className="gb-work-count">01 / {String(projects.length).padStart(2, '0')}</span>
              <div className="gb-work-bar">
                <div />
              </div>
              <span>Scroll</span>
            </div>
          </section>
        </div>

        {/* ==================== CONCEPTS ==================== */}
        {/* an index of the concept sites, a row each: on a desktop a small monitor under the cursor plays
            the row's film clip, or shows its still until the film lands; on a phone each row shows its still */}
        {concepts.length > 0 && (
          <section id="concepts" className="gb-concepts gb-has-bignum" data-section="concepts" aria-labelledby="gb-concepts-title">
            <span className="gb-bignum gb-cx" data-speed="-0.6" aria-hidden="true">
              04
            </span>
            <div className="gb-concepts-head">
              <div>
                <p className="gb-mono gb-concepts-kicker">(004) — Concept sites · fictional brands, made with immersive-web</p>
                <h2 id="gb-concepts-title" className="gb-concepts-title gb-cx">
                  Concepts
                </h2>
              </div>
              <div>
                {conceptPace && (
                  <p className="gb-concepts-pace">
                    <span className="gb-cx">
                      {conceptPace.count} sites in {conceptPace.span}
                    </span>
                    <span className="gb-mono">{formatSpan(conceptPace.from, conceptPace.to)}</span>
                  </p>
                )}
                <p className="gb-concepts-note">
                  Sites for brands that do not exist, each built end to end with immersive-web, my Claude Code skill for
                  cinematic sites. Not clients, not live products: studies in scroll, type and 3D.
                </p>
              </div>
            </div>
            <ol className="gb-concepts-list">
              {concepts.map((concept) => (
                <li key={concept.id}>
                  <Link
                    href={`/projects/${concept.id}`}
                    className="gb-concept"
                    data-clip={concept.clip || ''}
                    data-still={concept.image || ''}
                    data-name={concept.name}
                  >
                    <span className="gb-concept-num gb-mono">C—{concept.number}</span>
                    <span className="gb-concept-shot" aria-hidden="true">
                      <img src={concept.image} alt="" loading="lazy" />
                    </span>
                    <span className="gb-concept-name gb-cx" data-skew>
                      {concept.name}
                    </span>
                    <span className="gb-concept-line">{concept.tagline}</span>
                    <span className="gb-concept-tags gb-mono">
                      {concept.tags.join(' / ')}
                      {concept.film ? ' / Film' : ''}
                    </span>
                    <span className="gb-concept-arrow" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
            {/* the monitor: gridbreak-motion moves the outer box with the cursor, the inner one opens and closes;
                its screen shows the row's still, and the film clip over it once there is one */}
            <div className="gb-concept-preview" aria-hidden="true">
              <div className="gb-concept-monitor">
                <span className="gb-concept-preview-hud gb-mono">
                  <span>
                    <span className="gb-dot" style={{ color: 'var(--gb-red)' }} />
                    <span className="gb-concept-preview-kind">Preview</span> — <span className="gb-concept-preview-name" />
                  </span>
                  <span className="gb-concept-preview-tc">00:00:00:00</span>
                </span>
                <span className="gb-concept-screen">
                  <img className="gb-concept-preview-still" alt="" />
                  <video className="gb-concept-preview-video" muted loop playsInline preload="none" tabIndex={-1} />
                </span>
              </div>
            </div>
          </section>
        )}

        {/* scene: the camera pulls back from a full-screen portrait */}
        <div className="gb-scene-wrap gb-pscene-wrap">
          <section className="gb-pscene gb-scene" aria-label="Portrait">
            <div className="gb-pscene-frame">
              <img src="/me.webp" alt="Christian Del Río" />
            </div>
            <p className="gb-pscene-cap gb-pscene-cap--a gb-cx">
              Engineer
              <br />
              <span className="gb-wx">by day</span>
            </p>
            <p className="gb-pscene-cap gb-pscene-cap--b gb-cx">
              Builder
              <br />
              <span className="gb-wx">by night</span>
            </p>
          </section>
        </div>

        {/* ==================== INFO ==================== */}
        <section id="info" className="gb-info gb-has-bignum" data-section="info" data-wipe>
          <span className="gb-bignum gb-cx" data-speed="-0.5" aria-hidden="true">
            05
          </span>
          <div className="gb-info-grid">
            <div className="gb-info-aside">
              <p className="gb-mono" style={{ margin: '0 0 20px', color: 'var(--gb-mute-on-bone)' }}>
                (005) — About
              </p>
              <h2 className="gb-info-title gb-cx">Info</h2>
              <figure className="gb-portrait" style={{ margin: '40px 0 0' }} data-speed="-0.12">
                <img src="/me.webp" alt="Christian Del Río" />
                <figcaption className="gb-mono">CDR — {city}, ES</figcaption>
              </figure>
            </div>

            <div>
              <p className="gb-about" data-words>
                By day I&apos;m a <strong>full-stack developer at Santander</strong>, building wholesale lending software. By
                night and weekends I&apos;m an <strong>indie hacker</strong> shipping my own AI products — from{' '}
                <em>Fainancial</em> to <em>MeshMind</em> — chasing creative freedom one launch at a time.
              </p>

              <div className="gb-stats">
                <div className="gb-stat">
                  <span className="gb-stat-num gb-cx" data-count={totalProjects}>
                    {String(totalProjects).padStart(2, '0')}
                    <sup>+</sup>
                  </span>
                  <span className="gb-mono">Products shipped</span>
                </div>
                <div className="gb-stat">
                  <span className="gb-stat-num gb-cx" data-count={yearsCoding}>
                    {String(yearsCoding).padStart(2, '0')}
                    <sup>+</sup>
                  </span>
                  <span className="gb-mono">Years coding</span>
                </div>
                <div className="gb-stat">
                  <span className="gb-stat-num gb-cx">∞</span>
                  <span className="gb-mono">Ideas to build</span>
                </div>
              </div>

              <div className="gb-exp-head gb-mono">
                <span>Experience</span>
                <span>Hover or tap to expand</span>
              </div>
              {experience.map((exp) => (
                <div key={exp.id} className="gb-exp-row" tabIndex={0}>
                  <div className="gb-exp-rule" />
                  <div className="gb-exp-main">
                    <span className="gb-mono" style={{ color: 'var(--gb-mute-on-bone)' }}>
                      {exp.period}
                    </span>
                    <span className="gb-exp-company gb-cx" data-skew>
                      {exp.headline}
                    </span>
                    <span className="gb-mono">
                      {exp.employer} — {exp.role}
                    </span>
                  </div>
                  <div className="gb-exp-more">
                    <ul>
                      {exp.responsibilities.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== STACK ==================== */}
        <section id="stack" className="gb-stack gb-has-bignum" data-section="stack" data-wipe>
          <span className="gb-bignum gb-cx" data-speed="-0.6" aria-hidden="true">
            06
          </span>
          <div className="gb-section-head gb-mono">
            <span>(006) — The arsenal</span>
            <span>{skillsCategories.reduce((n, c) => n + c.tools.length, 0)} tools</span>
          </div>
          <h2 className="gb-stack-title gb-cx">Tech stack</h2>
          <div className="gb-stack-grid">
            {skillsCategories.map((category, i) => (
              // columns travel at different speeds so the grid shears while you scroll
              <div key={category.id} className="gb-stack-col" data-speed={(i * 0.12).toFixed(2)}>
                <span className="gb-mono" style={{ color: 'var(--gb-red)' }}>
                  0{i + 1}
                </span>
                <h3 className="gb-cx">{category.title}</h3>
                <ul>
                  {category.tools.map((tool, j) => (
                    <li key={tool}>
                      {tool}
                      <span className="gb-mono">{String(j + 1).padStart(2, '0')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ==================== NOTES ==================== */}
        <section id="notes" className="gb-notes gb-has-bignum" data-section="notes" data-wipe>
          <span className="gb-bignum gb-cx" data-speed="-0.6" aria-hidden="true">
            07
          </span>
          <div className="gb-notes-head">
            <div>
              <p className="gb-mono" style={{ margin: '0 0 20px', color: 'var(--gb-mute-on-bone)' }}>
                (007) — Writing
              </p>
              <h2 className="gb-notes-title gb-cx">Notes</h2>
            </div>
            <Link href="/blog" className="gb-btn">
              All articles →
            </Link>
          </div>
          <div className="gb-notes-list">
            {blogPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="gb-note" data-image={post.image || ''}>
                <span className="gb-note-date gb-mono">{formatDate(post.date)}</span>
                <h3 className="gb-note-title gb-cx" data-skew>
                  {post.title}
                </h3>
                <span className="gb-note-tag gb-mono">{post.tag}</span>
                <span className="gb-note-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            ))}
          </div>
          <div className="gb-note-preview" aria-hidden="true">
            <img alt="" />
          </div>
        </section>

        {/* ==================== CREDITS ==================== */}
        {/* scene: end credits roll up through a letterboxed frame before the post-credits contact */}
        <div className="gb-scene-wrap gb-credits-wrap">
          <section className="gb-credits gb-scene" aria-label="Credits">
            <div className="gb-reel-bar gb-reel-bar--top" aria-hidden="true" />
            <div className="gb-reel-bar gb-reel-bar--bottom" aria-hidden="true" />
            <div className="gb-credits-roll">
              <p className="gb-mono gb-credits-kicker">A Christian Del Río production</p>
              <p className="gb-credits-title gb-cx">Del Río</p>
              <dl className="gb-credits-list">
                <div>
                  <dt className="gb-mono">Directed, designed &amp; engineered by</dt>
                  <dd>Christian Del Río</dd>
                </div>
                <div>
                  <dt className="gb-mono">Day job</dt>
                  <dd>{currentRole.role} — Santander</dd>
                </div>
                <div>
                  <dt className="gb-mono">Starring</dt>
                  <dd>{projects.map((p) => p.title).join(' · ')}</dd>
                </div>
                <div>
                  <dt className="gb-mono">Previously</dt>
                  <dd>Frontend Developer — {previousEmployer}</dd>
                </div>
                <div>
                  <dt className="gb-mono">Built with</dt>
                  <dd>Next.js · GSAP · Lenis · Firebase · OpenAI</dd>
                </div>
                <div>
                  <dt className="gb-mono">Shot on location</dt>
                  <dd>{identity.location.en}</dd>
                </div>
              </dl>
              <p className="gb-credits-fin gb-wx">Fin.</p>
              <p className="gb-mono gb-credits-kicker">Stay for the post-credits scene ↓</p>
            </div>
          </section>
        </div>

        {/* ==================== CONTACT ==================== */}
        <section id="contact" className="gb-contact" data-section="contact">
          <div className="gb-cover" aria-hidden="true">
            {GRID_CELLS.map((_, i) => (
              <span key={i} className="gb-cover-cell" />
            ))}
          </div>

          <p className="gb-mono" style={{ margin: '0 0 24px' }}>
            (008) — Contact
          </p>
          <h2 className="gb-contact-title gb-cx">Let&apos;s talk</h2>

          <div className="gb-contact-row">
            <a href="mailto:hello@iamdelrio.com" className="gb-email gb-wx">
              hello@iamdelrio.com
            </a>
            <div className="gb-cv">
              <a
                className="gb-btn"
                href="/CV_CHRISTIAN_DELRIO_RODRIGUEZ_EN.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                CV — EN ↓
              </a>
              <a
                className="gb-btn"
                href="/CV_CHRISTIAN_DELRIO_RODRIGUEZ_ES.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                CV — ES ↓
              </a>
            </div>
          </div>

          <footer className="gb-footer gb-mono">
            <div>
              <p style={{ margin: '0 0 10px', opacity: 0.75 }}>Social</p>
              <ul>
                {SOCIALS.map((s) => (
                  <li key={s.href}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer">
                      {s.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p style={{ margin: '0 0 10px', opacity: 0.75 }}>Pages</p>
              <ul>
                <li>
                  <Link href="/projects">Projects</Link>
                </li>
                <li>
                  <Link href="/products">Products</Link>
                </li>
                <li>
                  <Link href="/blog">Blog</Link>
                </li>
              </ul>
            </div>
            <div>
              <p style={{ margin: '0 0 10px', opacity: 0.75 }}>Local time</p>
              <p style={{ margin: 0 }}>{city} — {clock}</p>
              <p style={{ margin: 0 }}>© {new Date().getFullYear()} Christian Del Río</p>
            </div>
            <button className="gb-btn gb-footer-top" onClick={() => scrollToSection('top')}>
              Back to top ↑
            </button>
          </footer>
        </section>
      </main>

      <GridbreakChat />
    </div>
  );
}
