import { defineCloudflareConfig } from '@opennextjs/cloudflare/config';
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache';

// The pages are static, generated once per deploy (see src/app/page.jsx). Without an incremental
// cache the Worker had nowhere to read them from and rendered every page on every visit, past
// its CPU limit (error 1102). This read-only cache serves the build's own prerendered pages from
// the Worker's static assets, and cache interception answers a cached page before the Next.js
// server even loads, so a visit costs almost no CPU.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
