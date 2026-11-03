/**
 * Shown when Firestore is unreachable or not configured (local dev without
 * env vars, a transient outage, or a deploy that cannot reach it) so pages never
 * render an empty shell and case pages never 404. These are real, live
 * products — keep them in sync with Firestore.
 */
export const FALLBACK_PROJECTS = [
  { id: 'motorsportive', name: 'Motorsportive', description: 'A Formula 1 publication — breaking news, race analysis and live championship standings, with an editorial desk and a shop.', image: '/motorsportive.webp', tags: ['Editorial', 'Publishing', 'SaaS'], href: 'https://motorsportive.com' },
  { id: 'fainancial', name: 'Fainancial', description: 'AI-powered earnings call analysis. Turns a 60-minute call into the three things that moved the number.', image: '/fainancial/1.webp', tags: ['AI', 'Finance', 'SaaS'], href: 'https://fainancial.app/' },
  {
    id: 'meshmind',
    name: 'MeshMind',
    description: 'Wire AI models into flows that think, see, listen and speak — on your own graphics card, inside a browser tab. No server, no account, no API key.',
    longDescription: 'Drop nodes, drag a wire, press enter: assistants answer in parallel, see images, transcribe and speak, and you watch the signal travel through every step. Every model runs on WebGPU in the browser and downloads once. The launch film above is the app itself, rebuilt frame by frame.',
    image: '/meshmind/1.webp',
    images: ['/meshmind/1.webp', '/meshmind/2.webp', '/meshmind/3.webp', '/meshmind/4.webp'],
    video: '/meshmind/film.mp4',
    videoPoster: '/meshmind/film-poster.webp',
    tags: ['AI', 'WebGPU', 'React'],
    href: 'https://delriodevelops.github.io/meshmind/',
    githubUrl: 'https://github.com/delriodevelops/meshmind',
    date: '2026-11-03',
  },
  { id: 'cityswipe', name: 'CitySwipe', description: 'Swipe through cities until one fits. Relocation as a matching problem.', image: '/cityswipe.webp', tags: ['Mobile', 'AI'], href: 'https://cityswipe.city' },
  { id: 'baitme', name: 'Baitme', description: 'A/B test your thumbnails before you publish, not after the CTR disappoints you.', image: '/baitme/1.webp', tags: ['Creator Tools', 'Analytics'], href: 'https://baitme.iamdelrio.com/' },
];

/** The fallback entry for a case page, when Firestore has none. */
export const fallbackProject = (id) => FALLBACK_PROJECTS.find((project) => project.id === id) || null;
