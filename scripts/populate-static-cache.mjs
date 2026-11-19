// Copies OpenNext's prerendered pages into the Worker's static assets, where the read-only
// static-assets incremental cache (open-next.config.ts) reads them: every page of the site, built
// once per deploy. `opennextjs-cloudflare deploy` does the same copy; doing it in the build keeps it
// true however the build is deployed (Workers Builds may run plain `wrangler deploy`).
// The folder is CACHE_DIR in @opennextjs/cloudflare's static-assets-incremental-cache.
import { cpSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const source = join('.open-next', 'cache');
const target = join('.open-next', 'assets', 'cdn-cgi', '_next_cache');

if (!existsSync(source)) {
  console.error(`populate-static-cache: ${source} is missing; run the OpenNext build first`);
  process.exit(1);
}
cpSync(source, target, { recursive: true });
const count = (dir) => readdirSync(dir, { withFileTypes: true }).reduce((n, e) => n + (e.isDirectory() ? count(join(dir, e.name)) : 1), 0);
console.log(`populate-static-cache: ${count(target)} prerendered files in ${target}`);
