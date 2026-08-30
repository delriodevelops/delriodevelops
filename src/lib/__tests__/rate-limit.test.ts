import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest';
import { rateLimit, clientIp, __resetRateLimiter } from '../rate-limit';

describe('rateLimit', () => {
  beforeEach(() => {
    __resetRateLimiter();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('allows requests up to the limit', () => {
    for (let i = 0; i < 3; i += 1) {
      expect(rateLimit('1.2.3.4', 3, 1000).allowed).toBe(true);
    }
  });

  it('blocks the request past the limit and reports a retry delay', () => {
    for (let i = 0; i < 3; i += 1) rateLimit('1.2.3.4', 3, 60_000);

    const result = rateLimit('1.2.3.4', 3, 60_000);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.retryAfter).toBeGreaterThan(0);
  });

  it('tracks callers independently', () => {
    for (let i = 0; i < 3; i += 1) rateLimit('1.1.1.1', 3, 60_000);

    expect(rateLimit('1.1.1.1', 3, 60_000).allowed).toBe(false);
    expect(rateLimit('2.2.2.2', 3, 60_000).allowed).toBe(true);
  });

  it('opens a fresh window once the old one expires', () => {
    for (let i = 0; i < 3; i += 1) rateLimit('1.2.3.4', 3, 1000);
    expect(rateLimit('1.2.3.4', 3, 1000).allowed).toBe(false);

    vi.advanceTimersByTime(1001);
    expect(rateLimit('1.2.3.4', 3, 1000).allowed).toBe(true);
  });
});

describe('clientIp', () => {
  const withHeaders = (headers: Record<string, string>) =>
    new Request('https://example.com', { headers });

  it('prefers the Cloudflare header', () => {
    expect(clientIp(withHeaders({ 'cf-connecting-ip': '9.9.9.9', 'x-real-ip': '8.8.8.8' })))
      .toBe('9.9.9.9');
  });

  it('takes the first hop of x-forwarded-for', () => {
    expect(clientIp(withHeaders({ 'x-forwarded-for': '7.7.7.7, 6.6.6.6' }))).toBe('7.7.7.7');
  });

  it('falls back to a sentinel when no header is present', () => {
    expect(clientIp(withHeaders({}))).toBe('unknown');
  });
});
