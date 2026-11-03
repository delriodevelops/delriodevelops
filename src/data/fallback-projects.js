/**
 * Shown when Firestore is unreachable or not configured (local dev without
 * env vars, a transient outage, or a deploy that cannot reach it) so pages never
 * render an empty shell and case pages never 404. These are real, live
 * products — keep them in sync with Firestore.
 */
export const FALLBACK_PROJECTS = [
  {
    id: 'motorsportive',
    name: 'Motorsportive',
    description: 'A Formula 1 publication — breaking news, race analysis and live championship standings, with an editorial desk and a shop.',
    longDescription: 'An independent Formula 1 journal: the news as it breaks, technical analysis, the championship as a timing tower, and every race weekend with its countdown and schedule in your own time zone. Server-rendered on Cloudflare Workers so every page reaches search. The launch film above is the site itself, its real pages and data cut to the beat.',
    image: '/motorsportive.webp',
    images: ['/motorsportive/1.webp', '/motorsportive/2.webp', '/motorsportive/3.webp', '/motorsportive/4.webp'],
    video: '/motorsportive/film.mp4',
    videoPoster: '/motorsportive/film-poster.webp',
    tags: ['Editorial', 'Publishing', 'SaaS'],
    href: 'https://motorsportive.com',
    date: '2026-11-03',
  },
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
  {
    id: 'cityswipe',
    name: 'CitySwipe',
    description: 'What would your life cost in another city? Say what you earn and spend, and see the same life priced in 522 cities.',
    longDescription: 'A calculator for remote workers and anyone thinking of moving: each part of your month is scaled by the Numbeo index that measures it, then every city is ranked by what you would have left, how long your savings would last and value for money, with a planner for months on the move. A static site, no server and no account. The launch film above is the app itself, rebuilt frame by frame from its own data.',
    image: '/cityswipe/1.webp',
    images: ['/cityswipe/1.webp', '/cityswipe/2.webp', '/cityswipe/3.webp', '/cityswipe/4.webp'],
    video: '/cityswipe/film.mp4',
    videoPoster: '/cityswipe/film-poster.webp',
    // no link yet: the site is not published and the repository is private
    tags: ['Data', 'Next.js', 'Remote work'],
    date: '2026-11-03',
  },
  {
    id: 'billonario',
    name: 'Billonario',
    description: 'A property-trading board game for two to eight friends, in the browser: make a room, share the link and play on any phone or computer.',
    longDescription: 'Roll, buy cities and charge rent, bid in auctions, draw Surprise and Treasure cards, build hotels on full sets, mortgage your way out of the red and trade anything: every offer and counter-offer shows up live for the whole table. The rules run on the server, one Cloudflare Durable Object per room, so nobody can cheat and a dropped phone rejoins where it was. No menus or tabs, everything happens on the board, with haptics, a musical WebAudio sound engine and a battery saver. The launch film above is the game itself, rebuilt frame by frame from real matches.',
    image: '/billonario/1.webp',
    images: ['/billonario/1.webp', '/billonario/2.webp', '/billonario/3.webp', '/billonario/4.webp'],
    video: '/billonario/film.mp4',
    videoPoster: '/billonario/film-poster.webp',
    tags: ['Multiplayer', 'Game', 'Cloudflare'],
    href: 'https://billonario.pages.dev',
    date: '2026-11-03',
  },
  { id: 'baitme', name: 'Baitme', description: 'A/B test your thumbnails before you publish, not after the CTR disappoints you.', image: '/baitme/1.webp', tags: ['Creator Tools', 'Analytics'], href: 'https://baitme.iamdelrio.com/' },
];

/** The fallback entry for a case page, when Firestore has none. */
export const fallbackProject = (id) => FALLBACK_PROJECTS.find((project) => project.id === id) || null;
