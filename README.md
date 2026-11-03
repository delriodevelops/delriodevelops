# iamdelrio.com

Personal portfolio of Christian del Río Rodríguez — Next.js 16 App Router,
deployed to Cloudflare Workers via OpenNext, with content in Firestore.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in the values
npm run dev
```

The site runs without any environment variables: Firebase-backed sections fall
back to static data, and the AI assistant returns a 503.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm test` | Unit tests (Vitest) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run optimize:images` | Re-compress everything in `public/` to WebP |
| `npm run cf:build` | Build + OpenNext bundle for Cloudflare |
| `npm run cf:preview` | Run the Worker locally |
| `npm run cf:deploy` | Deploy the Worker |

## Architecture

### Rendering

Every route is server-rendered. `/`, `/blog`, `/projects` and `/products` are
prerendered with a 5-minute ISR window; `/blog/[slug]` and `/projects/[id]` are
generated from `generateStaticParams`.

Server-side reads go through **`src/lib/services/firestore-rest.js`**, which
talks to the Firestore REST API over plain `fetch`. The `firebase/firestore` JS
SDK is a browser client and does not run reliably in a Worker, which is why the
reads are split:

- **Reads, public pages** → `firestore-rest.js` (server, cached)
- **Reads, admin dashboard** → `services/blog.js` / `services/projects.js`
  (client SDK, live)
- **Writes** → client SDK only, so Firestore rules can authenticate the user

### Single source of truth for the CV

`src/data/profile.ts` holds the work history, skills and contact details. The
homepage timeline, both CV pages and the AI assistant's system prompt are all
generated from it. Do not copy this data anywhere else — the three copies that
existed before had drifted into naming *different employers*.
`src/data/__tests__/profile.test.ts` guards against that regression.

### Motion and accessibility

The site uses GSAP, Lenis smooth scroll and a custom cursor. Everything animated
checks `prefersReducedMotion()` from `src/lib/motion.ts`, and `globals.css` has a
matching `prefers-reduced-motion` block that force-reveals elements which start
at `opacity: 0` — without it, reduced-motion visitors would see a blank page.
Keep `REVEAL_SELECTOR` in `src/app/page-content.jsx` in sync with that CSS block.

### Images

`next.config.js` sets `images.unoptimized` because Workers has no image
optimizer runtime. Everything in `public/` is therefore pre-compressed WebP.
**Run `npm run optimize:images` after adding any image** — the folder was 42 MB
of raw PNGs before that script existed (one file was 9.3 MB).

### The AI assistant

`/api/chat` proxies DeepSeek. It is public and costs money per call, so it is
rate limited to 10 requests/minute per IP (`src/lib/rate-limit.ts`), caps
messages at 1 000 characters and forwards at most 10 turns of history. The
limiter is per-Worker-isolate; move it to KV or a Durable Object if you need a
global counter.

## Deployment

Cloudflare Workers via `@opennextjs/cloudflare`:

```bash
npm run cf:build && npm run cf:deploy
```

Set every variable from `.env.example` in the Worker. `DEEPSEEK_API_KEY` must be
a secret (`npx wrangler secret put DEEPSEEK_API_KEY`).

## Outstanding

- Add the Google Search Console verification token to `metadata.verification` in
  `src/app/layout.jsx`.
- `src/app/admin/page-content.jsx` is still ~950 lines and worth splitting further.
- Only the data/utility layer is TypeScript; components are still JSX.
