/**
 * Single source of truth for Christian's professional profile.
 *
 * The homepage, the CV pages (ES/EN) and the AI assistant's system prompt all
 * read from here. Never duplicate this data anywhere else: before this file
 * existed the site advertised employers ("NWorld") that the CV did not contain,
 * while the chatbot quoted a third, outdated set.
 *
 * Dates are the real ones from CV_CHRISTIAN_DELRIO_RODRIGUEZ_{ES,EN}.pdf.
 */

export type Lang = 'en' | 'es';

/** A string that exists in both site languages. */
export type Localized = Record<Lang, string>;
export type LocalizedList = Record<Lang, string[]>;

export interface Engagement {
  dateStart: Localized;
  dateEnd: Localized | null;
  name: string;
  title: Localized;
  /** Bullet lines; `*text*` marks an emphasised span. */
  description: LocalizedList;
  techs: string[];
}

export interface Company {
  id: string;
  company: string;
  logo: string;
  location: Localized;
  contract: Localized;
  remote: Localized;
  projects: Engagement[];
}

export interface SkillCategory {
  id: string;
  title: string;
  tools: string[];
}

export const identity = {
  name: 'Christian Del Río',
  fullName: 'Christian del Río Rodríguez',
  role: { en: 'Senior Full Stack Engineer · AI Products', es: 'Ingeniero Full Stack Senior · Productos con IA' },
  location: { en: 'Madrid, Spain', es: 'Madrid, España' },
  email: 'hello@iamdelrio.com',
  site: 'https://www.iamdelrio.com',
  languages: { en: ['Spanish', 'English'], es: ['Español', 'Inglés'] },
};

export const socials = {
  linkedin: 'https://www.linkedin.com/in/iamdelrio',
  github: 'https://github.com/delriodevelops',
  twitter: 'https://twitter.com/chrissdelrio',
};

/**
 * Employment history, newest first. `companies[].projects` are the individual
 * engagements inside a single employer (consultancy model).
 */
export const companies: Company[] = [
  {
    id: 'santander',
    company: 'Santander',
    logo: 'https://play-lh.googleusercontent.com/hVn4Xou41ypnqjBpOtudb2WSntOTnlw5WEfeYDI6L-1wh8iDG4NlGWgMh27W5CJ6eW8a',
    location: { en: 'Málaga, Spain', es: 'Málaga, España' },
    contract: { en: 'Full Time', es: 'Jornada completa' },
    remote: { en: 'Hybrid', es: 'Híbrido' },
    projects: [
      {
        dateStart: { en: 'Mar 2025', es: 'Mar 2025' },
        dateEnd: null,
        name: 'Santander Global Tech',
        title: { en: 'Full Stack Developer', es: 'Desarrollador Full Stack' },
        description: {
          en: [
            "• Build Banco Santander's internal *wholesale lending platform* on DLX (Digital Loan Exchange), which runs the *full lifecycle of syndicated and corporate loans* — a business-critical system for the bank.",
            '• *Own the business-logic layer in TypeScript*: modelling facilities, tranches, contracts and participants, and extending the DLX SDK with custom validations, conditions and workflows.',
            '• Turn *legal and operational requirements into production logic*, working directly with lending, legal and operations stakeholders.',
            '• *Automate repetitive back-office processes* and handle complex lending scenarios: syndication structures, participant distribution, financial events and the contractual audit trail.',
          ],
          es: [
            '• Desarrollo la *plataforma interna de préstamos mayoristas* de Banco Santander sobre DLX (Digital Loan Exchange), que gestiona el *ciclo de vida completo de préstamos sindicados y corporativos*: un sistema crítico para el banco.',
            '• *Responsable de la capa de lógica de negocio en TypeScript*: modelado de líneas de crédito, tramos, contratos y participantes, y extensión del SDK de DLX con validaciones, condiciones y flujos propios.',
            '• Convierto *requisitos legales y operativos en lógica de producción*, trabajando directamente con los equipos de préstamos, legal y operaciones.',
            '• *Automatizo procesos repetitivos de back-office* y resuelvo escenarios complejos: estructuras de sindicación, reparto entre participantes, eventos financieros y trazabilidad contractual.',
          ],
        },
        techs: ['TypeScript', 'DLX SDK', 'Node.js', 'Git', 'JavaScript'],
      },
    ],
  },
  {
    id: 'nfq',
    company: 'Nfq Advisory, Solutions, Outsourcing',
    logo: '/logos/nfq.webp',
    location: { en: 'Madrid, Spain', es: 'Madrid, España' },
    contract: { en: 'Full Time', es: 'Jornada completa' },
    remote: { en: 'Hybrid', es: 'Híbrido' },
    projects: [
      {
        dateStart: { en: 'Feb 2024', es: 'Feb 2024' },
        dateEnd: { en: 'Feb 2025', es: 'Feb 2025' },
        name: 'Permira - GAIA',
        title: { en: 'Frontend Developer', es: 'Desarrollador Frontend' },
        description: {
          en: [
            '• Built *GAIA, a generative-AI assistant* for private-equity firm Permira: *RAG over a vector knowledge base* of confidential documents, a chat that accepts images and files, and a PDF viewer with AI summaries.',
            '• *Migrated the frontend to Next.js with server-side rendering*, cutting load times in virtualised desktops and on low-powered devices.',
            '• *Redesigned the interface* with Tailwind and Zustand, removing redundant code and improving navigation and accessibility.',
            '• Integrated *Okta SSO* for enterprise authentication and *worked on the Python backend* to keep the frontend-backend contract fast and stable.',
            '• Worked in English with the *UK-based client* in an agile team (sprints, stand-ups, retrospectives).',
          ],
          es: [
            '• Desarrollé *GAIA, un asistente de IA generativa* para el fondo de capital privado Permira: *RAG sobre una base de conocimiento vectorial* con documentos confidenciales, chat con imágenes y archivos, y visor de PDF con resúmenes generados por IA.',
            '• *Migré el frontend a Next.js con renderizado en servidor*, reduciendo los tiempos de carga en escritorios virtualizados y dispositivos de pocos recursos.',
            '• *Rediseñé la interfaz* con Tailwind y Zustand, eliminando código redundante y mejorando navegación y accesibilidad.',
            '• Integré *Okta SSO* para la autenticación corporativa y *trabajé en el backend en Python* para mantener rápida y estable la integración frontend-backend.',
            '• Trabajo en inglés con el *cliente en Reino Unido* dentro de un equipo ágil (sprints, dailies, retrospectivas).',
          ],
        },
        techs: ['Zustand', 'NextJS', 'React', 'Python', 'Tailwind', 'Node.js', 'Okta', 'JavaScript', 'Git', 'GitLab', 'HTML5', 'CSS3'],
      },
      {
        dateStart: { en: 'Feb 2023', es: 'Feb 2023' },
        dateEnd: { en: 'Feb 2024', es: 'Feb 2024' },
        name: 'Solutions',
        title: { en: 'Frontend Developer', es: 'Desarrollador Frontend' },
        description: {
          en: [
            '• Developed four B2B products for NFQ Solutions: *TRAFIS, SZENA, ALQUID and NETZERO*.',
            '• *Led the frontend logic* of these apps in Vue.js/Vuex and React, becoming the go-to person for how they worked.',
            '• Built *internal component libraries* with Vuetify, designed with the team for reuse across products.',
            '• Kept the codebase *clean and modular* with clear separation of responsibilities and shared mixins.',
          ],
          es: [
            '• Desarrollé cuatro productos B2B de NFQ Solutions: *TRAFIS, SZENA, ALQUID y NETZERO*.',
            '• *Lideré la lógica frontend* de estas aplicaciones en Vue.js/Vuex y React, siendo la persona de referencia sobre su funcionamiento.',
            '• Creé *bibliotecas de componentes internos* con Vuetify, diseñadas con el equipo para reutilizarse entre productos.',
            '• Mantuve el código *limpio y modular*, con separación de responsabilidades y mixins compartidos.',
          ],
        },
        techs: ['Firebase', 'Cloud Firestore', 'Vue Router', 'Mixins', 'Vue.js', 'Vuex', 'Node.js', 'Vuetify', 'React.js', 'JavaScript', 'Git', 'GitLab', 'HTML5', 'CSS3', 'SASS'],
      },
      {
        dateStart: { en: 'Jan 2022', es: 'Ene 2022' },
        dateEnd: { en: 'Feb 2023', es: 'Feb 2023' },
        name: 'Graphenus',
        title: { en: 'Full Stack Developer', es: 'Desarrollador Full Stack' },
        description: {
          en: [
            '• Delivered features *end to end*: Angular frontend (services, routing, Angular Material) and *Node.js/Express backend* with REST APIs and JWT auth.',
            '• Integrated *PostgreSQL and MongoDB* behind the API layer.',
            '• *Containerised deployments with Docker* across environments, with Git/GitLab version control.',
            '• Documented the project processes and conventions the team worked by.',
          ],
          es: [
            '• Desarrollé funcionalidades *de principio a fin*: frontend en Angular (servicios, routing, Angular Material) y *backend en Node.js/Express* con APIs REST y autenticación JWT.',
            '• Integré *PostgreSQL y MongoDB* detrás de la capa de API.',
            '• *Despliegues con Docker* en los distintos entornos, con control de versiones en Git/GitLab.',
            '• Documenté los procesos y convenciones con los que trabajaba el equipo.',
          ],
        },
        techs: ['PostgreSQL', 'TypeScript', 'Angular', 'MongoDB', 'REST API', 'JWT', 'HTML5', 'JavaScript', 'CSS3', 'Git', 'GitHub', 'ECMAScript', 'npm', 'Node.js', 'Express.js'],
      },
    ],
  },
];

/**
 * Flattened view used by the homepage timeline: one entry per engagement.
 */
export const experienceTimeline = companies.flatMap((c) =>
  c.projects.map((p) => ({
    id: `${c.id}-${p.name}`,
    company: c.company,
    project: p.name,
    role: p.title.en,
    period: `${p.dateStart.en} — ${p.dateEnd ? p.dateEnd.en : 'Present'}`,
    techs: p.techs,
    responsibilities: p.description.en.map((line) => line.replace(/^•\s*/, '').replace(/\*/g, '')),
  }))
);

/**
 * Technologies actually used in shipped work (CV + side products).
 * Keep this honest: a recruiter will open the public repo and compare.
 */
export const skillsCategories: SkillCategory[] = [
  { id: 'frontend', title: 'Frontend', tools: ['React', 'Next.js', 'Vue.js', 'Angular', 'TypeScript', 'Tailwind', 'GSAP'] },
  { id: 'backend', title: 'Backend', tools: ['Node.js', 'Express', 'Python', 'PostgreSQL', 'MongoDB', 'Firebase'] },
  { id: 'ai', title: 'AI Engineering', tools: ['LLM agents', 'RAG / vector search', 'MCP', 'OpenAI API', 'Gemini API', 'DeepSeek API', 'In-browser models'] },
  { id: 'tools', title: 'DevOps & Tools', tools: ['Docker', 'Git', 'GitLab', 'Cloudflare Workers', 'Vercel', 'Okta'] },
];

export interface Product {
  name: string;
  url: string;
  /** One line on what it is; shown on the CV. */
  description?: Localized;
}

/** Products built and run independently, strongest first. */
export const products: Product[] = [
  {
    name: 'MotorSportive',
    url: 'https://motorsportive.com',
    description: {
      en: 'Founder. Autonomous AI newsroom for Formula 1: an editor agent assigns stories to AI journalists with their own voice, a pipeline publishes every 15 minutes and posts to social media, with human oversight from an admin console. Since January 2026: 33.1M impressions and 34.2K followers on X, 11.8K web visitors and 19.1K page views. Next.js, Cloudflare Workers, Firestore, Stripe.',
      es: 'Fundador. Redacción autónoma de Fórmula 1 con IA: un agente editor asigna noticias a periodistas IA con voz propia, un pipeline publica cada 15 minutos y lo difunde en redes, con supervisión humana desde un panel de control. Desde enero de 2026: 33,1M de impresiones y 34,2K seguidores en X, 11,8K visitantes web y 19,1K páginas vistas. Next.js, Cloudflare Workers, Firestore, Stripe.',
    },
  },
  {
    name: 'MeshMind',
    url: 'https://delriodevelops.github.io/meshmind/',
    description: {
      en: 'Visual builder for AI flows that run on your own GPU, in the browser: text, image and voice nodes, MCP tools and a tool-calling agent.',
      es: 'Editor visual de flujos de IA que se ejecutan en tu propia GPU, en el navegador: nodos de texto, imagen y voz, herramientas MCP y un agente que usa herramientas.',
    },
  },
  {
    name: 'Fainancial',
    url: 'https://fainancial.iamdelrio.com',
    description: {
      en: 'AI analysis of earnings-call transcripts and market data, with watchlists, paid plans and a market assistant.',
      es: 'Análisis con IA de earnings calls y datos de mercado, con watchlists, planes de pago y un asistente de mercado.',
    },
  },
  {
    name: 'Baitme',
    url: 'https://baitme.iamdelrio.com/',
    description: {
      en: 'Tests a YouTube thumbnail inside real search results and gets an AI art director’s critique.',
      es: 'Prueba una miniatura de YouTube entre resultados reales de búsqueda y recibe la crítica de un director de arte IA.',
    },
  },
  { name: 'Escudo Leal JPT', url: 'https://escudolealjpt.com' },
];

export const about: Localized = {
  en: 'Full stack engineer with 4+ years shipping TypeScript products, from a business-critical lending platform at Banco Santander to a generative-AI assistant for a private-equity client. Outside work I found and run my own AI products end to end — MotorSportive, an autonomous multi-agent F1 newsroom with 33M+ impressions on X, is the largest. I want to work on agentic AI systems that reach real users.',
  es: 'Ingeniero full stack con más de 4 años lanzando productos en TypeScript, desde una plataforma crítica de préstamos en Banco Santander hasta un asistente de IA generativa para un fondo de capital privado. Fuera del trabajo fundo y llevo de principio a fin mis propios productos con IA; el mayor es MotorSportive, una redacción de F1 autónoma con varios agentes y más de 33M de impresiones en X. Quiero trabajar en sistemas de IA agéntica que lleguen a usuarios reales.',
};
