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
  role: { en: 'Full Stack Developer', es: 'Desarrollador Full Stack' },
  location: { en: 'Málaga, Spain', es: 'Málaga, España' },
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
            "• Part of the team building an internal wholesale lending application for Banco Santander, using DLX (Digital Loan Exchange) — a *specialized platform for managing the full lifecycle of syndicated and corporate loans*.",
            "• While I have a technical background, I don't work on traditional frontend development. DLX provides its own UI through an SDK, so my *focus is on implementing business logic* and adapting flows to meet the bank's needs.",
            '• I work mostly in TypeScript, configuring and extending the DLX SDK to:',
            '• *Model financial entities* like facilities, tranches, contracts, and participants.',
            '• Define custom validations, conditions, and workflow logic tailored to Santander.',
            '• Connect internal components and *manage complex lending scenarios*.',
            '• Automate repetitive tasks and *optimize business processes*.',
            '• I also collaborate with non-technical stakeholders to *turn legal and operational requirements into logic* that fits into the DLX ecosystem.',
            "• What makes this role *unique* is the *exposure to the world of wholesale lending*: syndication structures, participant distribution, role assignment, financial events, and the contractual audit trail — all from a developer's perspective.",
          ],
          es: [
            '• Parte del equipo que desarrolla una aplicación interna de préstamos mayoristas para Banco Santander, utilizando DLX (Digital Loan Exchange), una *plataforma especializada en la gestión del ciclo de vida completo de préstamos sindicados y corporativos*.',
            '• Aunque tengo formación técnica, no trabajo en desarrollo frontend tradicional. DLX proporciona su propia interfaz a través de un SDK, por lo que mi *enfoque está en implementar la lógica de negocio* y adaptar los flujos a las necesidades del banco.',
            '• Trabajo principalmente con TypeScript, configurando y ampliando el SDK de DLX para:',
            '• *Modelar entidades financieras* como líneas de crédito, tramos, contratos y participantes.',
            '• Definir validaciones personalizadas, condiciones y lógica de flujo de trabajo adaptadas a Santander.',
            '• Conectar componentes internos y *gestionar escenarios complejos de préstamos*.',
            '• Automatizar tareas repetitivas y *optimizar procesos de negocio*.',
            '• También colaboro con personas no técnicas para *convertir requisitos legales y operativos en lógica* que se integra en el ecosistema DLX.',
            '• Lo que hace que este rol sea *único* es la *exposición al mundo de los préstamos mayoristas*: estructuras de sindicación, distribución de participantes, asignación de roles, eventos financieros y trazabilidad contractual, todo desde la perspectiva de un desarrollador.',
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
            '• Implemented Next.js with server-side rendering, *improving speed* in virtualized environments, *reducing load times*, and *enhancing the user experience on low-performance devices.*',
            '• Using Tailwind and Zustand, I *redesigned the interface*, eliminated redundant code, and *optimized navigation and accessibility.*',
            '• Vector knowledge base to facilitate *search in confidential documents*, a chat with image and document support, PDF viewer with summaries, etc.',
            '• Integrated Okta SDK to ensure secure *authentication and robust data protection.*',
            '• *Contributed to Python-based optimizations*, ensuring seamless frontend-backend integration and enhancing system efficiency.',
            '• *Agile* collaboration & international communication: worked in sprints, daily stand-ups and retrospectives, managed tasks via ClickUp, and collaborated in English with the *UK-based client.*',
          ],
          es: [
            '• Implementé Next.js con *renderizado del lado del servidor*, mejorando velocidad en entornos virtualizados y experiencia de usuario en dispositivos de bajos recursos.',
            '• Rediseñé la interfaz usando *Tailwind y Zustand*, optimizando navegación y accesibilidad.',
            '• *Base de conocimiento vectorial* para búsqueda en documentos confidenciales, chat con soporte de imágenes y documentos, visor PDF con resúmenes, etc.',
            '• Integré *Okta SDK* para autenticación segura y protección de datos.',
            '• Contribuí a optimizaciones en *Python* asegurando integración frontend-backend.',
            '• Colaboración *ágil* con cliente en UK mediante sprints, dailys y retrospectivas.',
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
            "• Integral in Solutions' B2B apps: TRAFIS, SZENA, ALQUID, NETZERO.",
            '• Skilled in Vuetify for *internal component libraries*.',
            '• Expertise in *front-end tech*: Vue.js, Vuex, React.js, JavaScript.',
            '• Lead frontend logic and functionality, ensuring *deep application knowledge*.',
            '• Collaborative in design for *efficient, reusable components*.',
            '• Employ *separation of responsibilities* and *mixins* for *clear functionality*.',
            '• Committed to *clean*, *modular* code for *easy maintenance*.',
          ],
          es: [
            '• Desarrollo de aplicaciones B2B: TRAFIS, SZENA, ALQUID, NETZERO.',
            '• Creación de *bibliotecas de componentes internos* con Vuetify.',
            '• Desarrollo con *Vue.js y React.js* implementando lógica frontend compleja.',
            '• Colaboración en diseño de *componentes reutilizables* y eficientes.',
            '• Implementación de *mixins* y *separación de responsabilidades*.',
            '• Mantenimiento de código *limpio y modular*.',
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
            '• Leveraged Angular for frontend development, including *services*, *routing*, and *Angular Material*.',
            '• Managed *backend* tasks including *routing*, *controller maintenance*, and *database/API integration*.',
            '• Ensured project *deployment* across *environments* and *version control* using Docker and Git/GitLab.',
            '• Documented project processes and conventions for clarity and consistency.',
            '• Facilitated user interaction on the frontend with clear information display and interactive input options.',
          ],
          es: [
            '• Desarrollo Frontend con *Angular* (servicios, routing, Angular Material).',
            '• Gestión *Backend*: routing, mantenimiento de controladores e integración DB/API.',
            '• Implementación de *despliegues con Docker* y control de versiones Git/GitLab.',
            '• Documentación técnica de procesos y convenciones.',
            '• Implementación de interacción de usuario clara e intuitiva.',
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
  { id: 'ai', title: 'AI Engineering', tools: ['OpenAI API', 'DeepSeek API', 'Vector search / RAG', 'Prompt engineering'] },
  { id: 'tools', title: 'DevOps & Tools', tools: ['Docker', 'Git', 'GitLab', 'Cloudflare Workers', 'Vercel', 'Okta'] },
];

export const products: { name: string; url: string }[] = [
  { name: 'Fainancial', url: 'https://fainancial.app' },
  { name: 'MeshMind', url: 'https://meshmind.vercel.app' },
  { name: 'Escudo Leal JPT', url: 'https://escudolealjpt.com' },
  { name: 'Baitme', url: 'https://baitme.iamdelrio.com/' },
];

export const about: Localized = {
  en: 'Experience in both professional and personal projects, focusing on emerging technologies and modern web development. I seek opportunities to grow and learn in the fields of programming and AI.',
  es: 'Experiencia tanto en proyectos profesionales como personales, centrada en tecnologías emergentes y desarrollo web moderno. Busco oportunidades para crecer y aprender en los campos de la programación y la IA.',
};
