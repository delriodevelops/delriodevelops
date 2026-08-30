/**
 * Minimal fixed-window rate limiter.
 *
 * `/api/chat` is a public endpoint that spends real money on every call, and it
 * previously had no throttle at all: a three-line curl loop could drain the
 * DeepSeek key. This keeps state in module memory, which on Cloudflare Workers
 * means per-isolate — good enough to stop casual abuse and accidental loops.
 * Move to Workers KV or Durable Objects if you ever need a global counter.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

// Stop the map from growing without bound in a long-lived isolate.
const MAX_TRACKED_KEYS = 5000;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  /** Seconds until the window resets. Zero when the request was allowed. */
  retryAfter: number;
}

/**
 * @param key      Identifier to throttle on (usually the client IP).
 * @param limit    Allowed requests per window.
 * @param windowMs Window length in milliseconds.
 */
export function rateLimit(key: string, limit = 10, windowMs = 60_000): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    if (buckets.size >= MAX_TRACKED_KEYS) {
      for (const [existingKey, value] of buckets) {
        if (now >= value.resetAt) buckets.delete(existingKey);
      }
      if (buckets.size >= MAX_TRACKED_KEYS) buckets.clear();
    }
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfter: 0 };
  }

  if (bucket.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  bucket.count += 1;
  return { allowed: true, remaining: limit - bucket.count, retryAfter: 0 };
}

/** Best-effort client IP from the proxy headers Cloudflare/Vercel set. */
export function clientIp(request: Request): string {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-real-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

/** Exposed for tests. */
export function __resetRateLimiter() {
  buckets.clear();
}
