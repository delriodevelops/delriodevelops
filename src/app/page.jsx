'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import {
  Github,
  Linkedin,
  Youtube,
  Mail,
  Download,
  ExternalLink,
  ArrowRight,
  ArrowUpRight,
  Code2,
  Database,
  Cloud,
  Smartphone,
  Palette,
  Cpu,
  Globe,
  Terminal,
  Layers,
  X,
  Menu,
  MessageCircle,
  Send,
  Rocket,
  Zap,
  Coffee,
  Twitter,
} from 'lucide-react';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Skills data
const skillsCategories = [
  {
    id: 'frontend',
    title: 'Frontend',
    tools: ['React', 'Next.js', 'TypeScript', 'Tailwind', 'GSAP', 'Three.js']
  },
  {
    id: 'backend',
    title: 'Backend',
    tools: ['Node.js', 'Python', 'PostgreSQL', 'Supabase', 'Firebase', 'GraphQL']
  },
  {
    id: 'ai',
    title: 'AI Engineering',
    tools: ['OpenAI API', 'LangChain', 'Pinecone', 'Vercel AI SDK', 'HuggingFace', 'RAG']
  },
  {
    id: 'tools',
    title: 'DevOps & Tools',
    tools: ['Docker', 'Git', 'Vercel', 'AWS', 'Figma', 'Stripe']
  }
];

// Projects data
const projectsData = [
  {
    id: 1,
    number: '01',
    title: 'Fainancial',
    description: 'AI-powered earnings call analysis platform',
    image: '/fainancial/1.png',
    tags: ['AI', 'Finance', 'SaaS'],
    liveUrl: 'https://fainancial.app/',
    featured: true,
  },
  {
    id: 2,
    number: '02',
    title: 'MeshMind',
    description: 'Visual chain-of-thought builder for AI reasoning',
    image: '/meshmind/1.png',
    tags: ['AI', 'Productivity'],
    liveUrl: 'https://meshmind.vercel.app/',
  },
  {
    id: 3,
    number: '03',
    title: 'CitySwipe',
    description: 'Swipe to find your perfect city',
    image: '/cityswipe.png',
    tags: ['Mobile', 'AI'],
    liveUrl: 'https://cityswipe.city',
  },
  {
    id: 4,
    number: '04',
    title: 'Baitme',
    description: 'A/B test your thumbnails for maximum CTR',
    image: '/baitme/1.png',
    tags: ['Creator Tools', 'Analytics'],
    liveUrl: 'https://baitme.iamdelrio.com/',
  },
];

// Experience data
const experienceData = [
  {
    id: 1,
    company: 'Indie Hacker Journey',
    role: 'Founder & Full Stack Developer',
    period: '2023 — Present',
    responsibilities: [
      'Building AI-powered SaaS products (Fainancial, MeshMind, CitySwipe, Baitme)',
      'Shipping fast and iterating based on user feedback',
      'Full product lifecycle: design, development, marketing, and support',
      'Building in public and sharing learnings with the community',
    ],
  },
  {
    id: 2,
    company: 'Santander Bank',
    role: 'Software Engineer', // Verify specific title
    period: '2025 — Present', // Update with real start date
    responsibilities: [
      'Developing critical financial applications and internal tools',
      'Working with modern web technologies (React, TypeScript, Node.js)',
      'Collaborating with agile teams to deliver banking solutions',
    ],
  },
  {
    id: 3,
    company: 'NWorld',
    role: 'Software Developer', // Verify specific title
    period: '2022 — 2024', // Update with real dates
    responsibilities: [
      'Full stack development for fintech projects',
      'Frontend architecture and optimization',
      'Agile development methodology',
    ],
  }
];

// Blog posts (sample data)
const blogPosts = [
  {
    slug: 'building-in-public',
    title: 'Why I Build in Public',
    excerpt: 'The journey from corporate developer to indie hacker, and why transparency matters.',
    tag: 'Indie Hacking',
    date: '2024-01-10',
    image: '/meshmind/2.png',
  },
  {
    slug: 'ai-first-development',
    title: 'AI-First Product Development',
    excerpt: 'How I integrate AI into every product from day one, and why you should too.',
    tag: 'AI',
    date: '2024-01-05',
    image: '/fainancial/2.png',
  },
  {
    slug: 'solopreneur-stack',
    title: 'My Solopreneur Tech Stack',
    excerpt: 'The tools and technologies I use to ship products fast as a one-person team.',
    tag: 'Tools',
    date: '2023-12-20',
    image: '/meshmind/3.png',
  },
];

// Navigation links
const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#work', label: 'Work' },
  { href: '#blog', label: 'Blog' },
  { href: '#contact', label: 'Contact' },
];

// Marquee items
const marqueeItems = ['INDIE HACKER', 'SOLOBUILDER', 'FULL STACK', 'AI ENTHUSIAST', 'PRODUCT MAKER'];

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Chat state
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hey! 👋 I'm Christian's AI assistant. Ask me anything about his work, skills, or how he can help you!" },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatMessagesRef = useRef(null);
  const experienceListRef = useRef(null);
  const experienceGlowRef = useRef(null);

  const lenisRef = useRef(null);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Update scroll progress
    lenis.on('scroll', ({ scroll, limit }) => {
      setScrollProgress((scroll / limit) * 100);
      setIsScrolled(scroll > 50);
    });

    // Loader animation
    const loaderTimer = setTimeout(() => {
      setIsLoading(false);
      initAnimations();
    }, 2000);

    return () => {
      clearTimeout(loaderTimer);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // Scroll chat to bottom
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  const initAnimations = () => {
    // Hero animations with stagger
    const heroTl = gsap.timeline({ delay: 0.2 });
    heroTl
      .to('.hero-tag', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
      .to('.hero-name-line', {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out'
      }, '-=0.5')
      .to('.hero-subtitle', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
      .to('.hero-cta', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')
      .to('.hero-scroll', { opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.2');

    // Marquee
    gsap.to('.marquee-section', {
      scrollTrigger: {
        trigger: '.marquee-section',
        start: 'top 90%',
        toggleActions: 'play none none reverse',
      },
      opacity: 1,
      duration: 1,
    });

    // About section with parallax
    gsap.to('.about-image-wrapper', {
      scrollTrigger: {
        trigger: '.about',
        start: 'top 70%',
        toggleActions: 'play none none reverse',
      },
      opacity: 1,
      x: 0,
      duration: 1.2,
      ease: 'power3.out',
    });

    gsap.to('.about-content', {
      scrollTrigger: {
        trigger: '.about',
        start: 'top 60%',
        toggleActions: 'play none none reverse',
      },
      opacity: 1,
      x: 0,
      duration: 1.2,
      delay: 0.2,
      ease: 'power3.out',
    });

    // About floating elements
    gsap.utils.toArray('.about-float').forEach((el, i) => {
      gsap.to(el, {
        scrollTrigger: {
          trigger: '.about',
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
        opacity: 1,
        scale: 1,
        duration: 0.6,
        delay: 0.5 + i * 0.15,
        ease: 'back.out(1.5)',
      });
    });

    // Tech Stack Animation
    gsap.utils.toArray('.tech-row').forEach((row, i) => {
      gsap.to(row, {
        scrollTrigger: {
          trigger: row,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: i * 0.1,
        ease: 'power3.out',
      });
    });

    // Project cards with dramatic reveal
    gsap.utils.toArray('.project-card').forEach((card, i) => {
      gsap.to(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        opacity: 1,
        y: 0,
        duration: 1,
        delay: i * 0.1,
        ease: 'power3.out',
      });
    });

    // Experience items
    gsap.utils.toArray('.experience-item').forEach((item, i) => {
      gsap.to(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: i * 0.1,
        ease: 'power3.out',
      });
    });

    // Blog cards
    gsap.utils.toArray('.blog-card').forEach((card, i) => {
      gsap.to(card, {
        scrollTrigger: {
          trigger: '.blog-grid',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: i * 0.1,
        ease: 'power3.out',
      });
    });

    // Contact section
    gsap.to('.contact-info', {
      scrollTrigger: {
        trigger: '.contact',
        start: 'top 70%',
        toggleActions: 'play none none reverse',
      },
      opacity: 1,
      x: 0,
      duration: 1,
      ease: 'power3.out',
    });

    gsap.to('.contact-form', {
      scrollTrigger: {
        trigger: '.contact',
        start: 'top 70%',
        toggleActions: 'play none none reverse',
      },
      opacity: 1,
      x: 0,
      duration: 1,
      delay: 0.2,
      ease: 'power3.out',
    });

    // Section observer
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: '-20% 0px -20% 0px' }
    );

    sections.forEach((section) => observer.observe(section));

    // Project Image Reveal Follower
    const projectItems = document.querySelectorAll('.project-item');
    projectItems.forEach((item) => {
      const img = item.querySelector('.project-image-reveal');

      const moveImage = (e) => {
        gsap.to(img, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.15,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      };

      item.addEventListener('mousemove', moveImage);
      // Cleanup attached to element, simplified for this scope
    });

    return () => {
      observer.disconnect();
      projectItems.forEach(item => {
        // Remove listeners if needed, but standard cleanup handles main observer
      });
    };
  };



  useEffect(() => {
    const list = experienceListRef.current;
    const glow = experienceGlowRef.current;

    if (!list || !glow) return;

    const moveGlow = (e) => {
      const rect = list.getBoundingClientRect();
      const y = e.clientY - rect.top;

      gsap.to(glow, {
        y: y,
        opacity: 1,
        duration: 0.2,
        ease: 'power2.out'
      });
    };

    const hideGlow = () => {
      gsap.to(glow, { opacity: 0, duration: 0.5 });
    };

    list.addEventListener('mousemove', moveGlow);
    list.addEventListener('mouseleave', hideGlow);

    return () => {
      list.removeEventListener('mousemove', moveGlow);
      list.removeEventListener('mouseleave', hideGlow);
    };
  }, []);

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element && lenisRef.current) {
      lenisRef.current.scrollTo(element, { offset: -80 });
    }
    setIsMenuOpen(false);
  };

  const sendMessage = async (content) => {
    if (!content.trim() || isChatLoading) return;

    const userMessage = { role: 'user', content: content.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.filter((m) => m.role !== 'error').slice(1),
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const { answer } = await response.json();
      setMessages([...updatedMessages, { role: 'assistant', content: answer }]);
    } catch (err) {
      setMessages([
        ...updatedMessages,
        { role: 'error', content: 'Sorry, something went wrong. Try again!' },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    sendMessage(chatInput);
  };

  return (
    <>
      {/* Loader */}
      <div className={`loader ${!isLoading ? 'hidden' : ''}`}>
        <div className="loader-logo">
          <span style={{ color: 'var(--color-accent)' }}>del</span>río
        </div>
        <div className="loader-bar">
          <div className="loader-bar-fill" />
        </div>
      </div>

      {/* Scroll Progress */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      {/* Navigation */}
      <nav className={`nav ${isScrolled ? 'scrolled' : ''}`}>
        <a href="#" className="nav-logo" onClick={(e) => { e.preventDefault(); scrollToSection('#hero'); }}>
          <span style={{ color: 'var(--color-accent)' }}>del</span>río
        </a>

        <ul className="nav-links">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`nav-link ${activeSection === link.href.slice(1) ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          className="nav-link"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{ display: 'none' }}
          aria-label="Menu"
        >
          <Menu size={24} />
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center gap-8">
          <button className="absolute top-6 right-6 text-white" onClick={() => setIsMenuOpen(false)}>
            <X size={32} />
          </button>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-3xl font-bold text-white hover:text-[#c8ff00] transition-colors"
              onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}

      <main>
        {/* ==================== HERO SECTION ==================== */}
        <section id="hero" className="hero section" style={{ height: '100vh', padding: 0, justifyContent: 'center' }}>
          <div className="hero-wrapper">
            <div className="hero-background-text">
              CHRISTIAN DEL RIO — DEVELOPER — CREATOR —
            </div>

            <div className="container" style={{ position: 'relative', zIndex: 10 }}>
              <div className="hero-tag" style={{ opacity: 0, transform: 'translateY(20px)', marginBottom: '2rem' }}>
                <span style={{ color: 'var(--color-accent)' }}>●</span> AVAILABLE FOR NEW PROJECTS
              </div>

              <h1 className="title-monumental hero-name">
                <span className="hero-name-line" style={{ opacity: 0, transform: 'translateY(100%)' }}>
                  CHRISTIAN
                </span>
                <span className="hero-name-line" style={{ opacity: 0, transform: 'translateY(100%)' }}>
                  DEL <span className="filled" style={{ display: 'inline', color: 'var(--color-accent)' }}>RÍO</span>
                </span>
              </h1>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginTop: '4rem',
                flexWrap: 'wrap',
                gap: '2rem'
              }}>
                <p className="hero-subtitle" style={{
                  opacity: 0,
                  transform: 'translateY(20px)',
                  fontSize: '1.5rem',
                  maxWidth: '500px',
                  margin: 0,
                  fontFamily: 'var(--font-mono)'
                }}>
                  Software Engineer & Indie Hacker.<br />
                  Crafting <span style={{ color: 'var(--color-text)' }}>digital experiences</span> that leave a mark.
                </p>

                <div className="hero-cta" style={{ opacity: 0, transform: 'translateY(20px)' }}>
                  <a href="#work" className="magnetic-btn" onClick={(e) => { e.preventDefault(); scrollToSection('#work'); }}>
                    See Selected Work
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== MARQUEE ==================== */}
        <div className="marquee-section" style={{ opacity: 0 }}>
          <div className="marquee">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span key={i} className="marquee-item">
                {item}
                <span className="separator">✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* ==================== ABOUT SECTION ==================== */}
        <section id="about" className="about section">
          <div className="container">
            <div className="about-grid">
              <div className="about-image-wrapper" style={{ opacity: 0, transform: 'translateX(-60px)' }}>
                <div className="about-image">
                  <Image
                    src="/me.png"
                    alt="Christian Del Río"
                    width={600}
                    height={800}
                    quality={90}
                    priority
                  />
                </div>
                <div className="about-float about-float-1" style={{ opacity: 0, transform: 'scale(0.8)' }}>
                  <Zap size={16} style={{ display: 'inline', marginRight: '6px', color: 'var(--color-accent)' }} />
                  Building in public
                </div>
                <div className="about-float about-float-2" style={{ opacity: 0, transform: 'scale(0.8)' }}>
                  <Coffee size={16} style={{ display: 'inline', marginRight: '6px', color: 'var(--color-accent)' }} />
                  Coffee-powered
                </div>
                <div className="about-float about-float-3" style={{ opacity: 0, transform: 'scale(0.8)' }}>
                  📍 Madrid, Spain
                </div>
              </div>

              <div className="about-content" style={{ opacity: 0, transform: 'translateX(60px)' }}>
                <span className="section-label">About me</span>
                <h2 style={{ marginBottom: 'var(--space-xl)' }}>
                  Engineer by day.<br />
                  <span style={{ color: 'var(--color-text-muted)' }}>Builder by night.</span>
                </h2>

                <p className="about-text">
                  By day, I work as a <strong>Software Engineer at Santander</strong>, building enterprise applications.
                  By night and weekends, I&apos;m an <strong>indie hacker</strong> shipping my own AI-powered products
                  and chasing the dream of creative freedom.
                </p>

                <p className="about-text">
                  I started building in public in 2023 and haven&apos;t stopped since. From <strong>Fainancial</strong> (AI earnings analysis)
                  to <strong>MeshMind</strong> (chain-of-thought builder), each product is a step towards building something meaningful.
                </p>

                <div className="about-stats">
                  <div>
                    <div className="about-stat-number">4<span className="accent">+</span></div>
                    <div className="about-stat-label">Products Shipped</div>
                  </div>
                  <div>
                    <div className="about-stat-number">8<span className="accent">+</span></div>
                    <div className="about-stat-label">Years Coding</div>
                  </div>
                  <div>
                    <div className="about-stat-number">∞</div>
                    <div className="about-stat-label">Ideas to Build</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== SKILLS SECTION ==================== */}
        {/* ==================== TECH STACK SECTION ==================== */}
        <section className="skills section" style={{ minHeight: 'auto', padding: '10vh 0' }}>
          <div className="container" style={{ marginBottom: '4rem' }}>
            <span className="section-label">THE ARSENAL</span>
            <h2 className="title-monumental" style={{ fontSize: 'clamp(3rem, 8vw, 8rem)', WebkitTextStroke: '0', marginBottom: 0 }}>
              TECH <span style={{ color: 'var(--color-text-muted)' }}>STACK</span>
            </h2>
          </div>

          <div className="container-wide">
            {skillsCategories.map((category, i) => (
              <div key={category.id} className="tech-row" style={{ opacity: 0, transform: 'translateY(30px)' }}>
                <div className="tech-category">{category.title}</div>
                <div className="tech-tags">
                  {category.tools.map((tool, j) => (
                    <span key={tool} className="tech-tag" style={{ transitionDelay: `${j * 50}ms` }}>
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==================== PROJECTS SECTION ==================== */}

        <section id="work" className="section" style={{ padding: '0 0 10vh 0' }}>
          <div className="container" style={{ marginBottom: '4rem' }}>
            <span className="section-label">Selected Works</span>
            <h2 className="title-monumental" style={{ fontSize: 'clamp(3rem, 6vw, 6rem)', WebkitTextStroke: '0' }}>
              FEATURED<br />  <span style={{ color: 'var(--color-text-muted)' }}>PROJECTS</span>
            </h2>
          </div>

          <div className="projects-list">
            {projectsData.map((project) => (
              <a
                key={project.id}
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-item"
              >
                <div className="container">
                  <div className="project-meta">
                    <span>{project.number}</span>
                    <span>{project.tags.join(' / ')}</span>
                  </div>
                  <h3 className="project-title">{project.title}</h3>
                  <div className="project-meta" style={{ marginTop: '0.5rem', opacity: 0.7 }}>
                    {project.description}
                  </div>
                </div>
                <div
                  className="project-image-reveal"
                  style={{ backgroundImage: `url(${project.image})` }}
                />
              </a>
            ))}
          </div>

          <div className="container" style={{ marginTop: '4rem', textAlign: 'center' }}>
            <Link href="/products" className="magnetic-btn">
              View All Projects
            </Link>
          </div>
        </section>

        {/* ==================== EXPERIENCE SECTION ==================== */}
        <section id="experience" className="experience section">
          <div className="container" style={{ marginBottom: '4rem' }}>
            <span className="section-label">Trajectory</span>
            <h2 className="title-monumental" style={{ fontSize: 'clamp(3rem, 6vw, 6rem)', WebkitTextStroke: '0' }}>
              THE <span style={{ color: 'var(--color-text-muted)' }}>JOURNEY</span>
            </h2>
          </div>

          <div className="container-wide">
            <div className="experience-list" ref={experienceListRef} style={{ position: 'relative' }}>
              <div className="experience-timeline">
                <div className="experience-timeline-glow" ref={experienceGlowRef} />
              </div>
              {experienceData.map((exp) => (
                <div
                  key={exp.id}
                  className="experience-item"
                  style={{ opacity: 0, transform: 'translateY(30px)' }}
                >
                  <div className="experience-period">{exp.period}</div>
                  <div className="experience-content">
                    <h3 className="experience-company">{exp.company}</h3>
                    <h4 className="experience-role">{exp.role}</h4>
                    <div className="experience-details-wrapper">
                      <ul className="experience-details">
                        {exp.responsibilities.map((resp, i) => (
                          <li key={i}>{resp}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== BLOG SECTION ==================== */}
        <section id="blog" className="section">
          <div className="container" style={{ marginBottom: '4rem' }}>
            <span className="section-label">Writing</span>
            <h2 className="title-monumental">THOUGHTS</h2>
          </div>

          <div className="container-wide">
            <div className="blog-list">
              {blogPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="blog-item"
                >
                  <div className="blog-item-meta">
                    <span className="blog-item-date">
                      {new Date(post.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="blog-item-title">{post.title}</h3>
                  <div className="blog-item-arrow">
                    <ArrowUpRight size={24} />
                  </div>
                </Link>
              ))}
            </div>

            <div style={{ marginTop: '4rem', display: 'flex', justifyContent: 'center' }}>
              <Link href="/blog" className="magnetic-btn">
                Read All Articles
              </Link>
            </div>
          </div>
        </section>

        {/* ==================== CONTACT SECTION ==================== */}
        <section id="contact" className="section contact-section">
          <div className="container">
            <span className="section-label">Connect</span>
            <h2 className="title-monumental">GET IN TOUCH</h2>

            <div className="contact-container">
              <a href="mailto:hello@iamdelrio.com" className="contact-email-massive">
                hello@iamdelrio.com
              </a>

              <div className="contact-actions">
                <div className="social-links-large">
                  <a href="https://linkedin.com/in/iamdelrio" target="_blank" rel="noopener noreferrer" className="social-btn">
                    <Linkedin size={24} />
                    <span>LinkedIn</span>
                  </a>
                  <a href="https://github.com/delriodevelops" target="_blank" rel="noopener noreferrer" className="social-btn">
                    <Github size={24} />
                    <span>GitHub</span>
                  </a>
                  <a href="https://twitter.com/chrissdelrio" target="_blank" rel="noopener noreferrer" className="social-btn">
                    <Twitter size={24} />
                    <span>Twitter</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-left">
                <p>© {new Date().getFullYear()} Christian Del Río</p>
                <p className="footer-sub">Engineer & Builder</p>
              </div>
              <div className="footer-nav">
                <Link href="#work">Work</Link>
                <Link href="#about">About</Link>
                <Link href="#blog">Writing</Link>
                <Link href="/products">Products</Link>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* ==================== FLOATING CHAT ==================== */}
      {/* ==================== FLOATING CHAT ==================== */}
      <div className="chat-widget">
        {!isChatOpen && (
          <button
            className="chat-toggle"
            onClick={() => setIsChatOpen(true)}
            aria-label="Open chat"
          >
            <MessageCircle size={24} />
          </button>
        )}

        {isChatOpen && (
          <div className="chat-window">
            <div className="chat-header">
              <div className="chat-header-avatar">
                {/* Placeholder or real avatar */}
                <div style={{ width: 30, height: 30, background: 'var(--color-accent)', borderRadius: '50%' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>AI Assistant</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Online</div>
              </div>
              <button className="chat-close" onClick={() => setIsChatOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div className="chat-messages" ref={chatMessagesRef}>
              {messages.map((msg, i) => (
                <div key={i} className={`message message-${msg.role}`}>
                  {msg.content}
                </div>
              ))}
              {isChatLoading && (
                <div className="message message-assistant" style={{ opacity: 0.7 }}>
                  Thinking...
                </div>
              )}
              {messages.length === 1 && !isChatLoading && (
                <div style={{ marginTop: 'auto', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button
                    onClick={() => sendMessage("What's your experience?")}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      padding: '0.6rem 1rem',
                      borderRadius: '12px',
                      color: 'var(--color-text)',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.color = 'white'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'var(--color-text)'; }}
                  >
                    What&apos;s your experience?
                  </button>
                  <button
                    onClick={() => sendMessage("What's your tech stack?")}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      padding: '0.6rem 1rem',
                      borderRadius: '12px',
                      color: 'var(--color-text)',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.color = 'white'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'var(--color-text)'; }}
                  >
                    What&apos;s your tech stack?
                  </button>
                  <button
                    onClick={() => sendMessage("Let's schedule a call")}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      padding: '0.6rem 1rem',
                      borderRadius: '12px',
                      color: 'var(--color-text)',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.color = 'white'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'var(--color-text)'; }}
                  >
                    Let&apos;s schedule a call
                  </button>
                </div>
              )}
            </div>

            <div className="chat-input-area">
              <form style={{ display: 'flex', width: '100%', gap: '0.5rem' }} onSubmit={handleChatSubmit}>
                <input
                  type="text"
                  className="chat-input"
                  placeholder="Ask me anything..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={isChatLoading}
                />
                <button type="submit" className="chat-send" disabled={isChatLoading || !chatInput.trim()}>
                  <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
