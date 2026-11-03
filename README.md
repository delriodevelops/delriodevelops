# iamdelrio.com

Personal portfolio of Christian del Río Rodríguez — Next.js 16 App Router,
deployed to Cloudflare Workers via OpenNext, with content in Firestore.

## Getting started

```bash
npm install
npm run dev
```

For real data, put the variables listed under [Deployment](#deployment) in
`.env.local`. The site runs without any of them: Firebase-backed sections fall
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
| `npm run cf:deploy` | Deploy the Worker named in `wrangler.jsonc` — not production, see [Deployment](#deployment) |

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

Production is the Worker **`delriodevelops`**, which serves iamdelrio.com and
www. Cloudflare Workers Builds builds it with `@opennextjs/cloudflare` and
deploys it on every push to `main`, so pushing is the whole release. A build
takes about 5 to 15 minutes; its result shows on the commit in GitHub as the
check "Workers Builds: delriodevelops".

`wrangler.jsonc` names the Worker `portfolio`. Workers Builds deploys to
`delriodevelops` regardless, but wrangler run locally follows the config:
`npm run cf:deploy` does not reach production, it creates or updates a separate
`portfolio` Worker on workers.dev. Pass `--name delriodevelops` to any wrangler
command meant for production.

| Variable | Set as | For |
| --- | --- | --- |
| `NEXT_PUBLIC_FIREBASE_API_KEY`, `_AUTH_DOMAIN`, `_PROJECT_ID`, `_STORAGE_BUCKET`, `_MESSAGING_SENDER_ID`, `_APP_ID` | Build variables | Firestore reads, and the admin's Firebase client |
| `NEXT_PUBLIC_ADMIN_EMAIL` | Build variable | The account allowed into `/admin` |
| `NEXT_PUBLIC_CF_ANALYTICS_TOKEN` | Build variable (optional) | Cloudflare Web Analytics |
| `DEEPSEEK_API_KEY` | Runtime secret | The AI assistant |

Next.js inlines `NEXT_PUBLIC_*` values when it builds, so they belong in the
Worker's build settings (Settings → Build → Variables and secrets), not only in
its runtime variables. Without them the build still passes but renders from
`FALLBACK_PROJECTS`: the blog is empty, its posts 404 and the archive lists only
the fallback projects. Set the secret with
`npx wrangler secret put DEEPSEEK_API_KEY --name delriodevelops`.

To try the production bundle locally: `npm run cf:build && npm run cf:preview`.

## Outstanding

- Add the Google Search Console verification token to `metadata.verification` in
  `src/app/layout.jsx`.
- `src/app/admin/page-content.jsx` is still ~950 lines and worth splitting further.
- Only the data/utility layer is TypeScript; components are still JSX.
