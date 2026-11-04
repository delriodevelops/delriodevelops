/**
 * The assistant's question log, in Cloudflare D1 (binding CHAT_DB, see
 * migrations/). It records what visitors ask, and backs the daily limits:
 * unlike the in-memory rate limiter, D1 is shared by every Worker isolate.
 *
 * Visitors are identified only by a salted hash of their IP. Without the
 * binding (plain `next dev`), logging and the daily limits are skipped.
 */
import { getCloudflareContext } from '@opennextjs/cloudflare';

function database() {
  try {
    return getCloudflareContext().env.CHAT_DB ?? null;
  } catch {
    return null;
  }
}

/** A stable, non-reversible id for a visitor's IP. */
export async function visitorId(ip) {
  const salt = process.env.CHAT_LOG_SALT || 'iamdelrio-chat';
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${salt}:${ip}`));
  return Array.from(new Uint8Array(digest).slice(0, 8), (b) => b.toString(16).padStart(2, '0')).join('');
}

const startOfDay = () => `${new Date().toISOString().slice(0, 10)}T00:00:00.000Z`;

/** Questions asked today, by this visitor and by everyone. Null without D1. */
export async function countToday(visitor) {
  const db = database();
  if (!db) return null;
  const since = startOfDay();
  const [mine, all] = await db.batch([
    db.prepare('SELECT COUNT(*) AS n FROM chat_log WHERE visitor = ? AND at >= ?').bind(visitor, since),
    db.prepare('SELECT COUNT(*) AS n FROM chat_log WHERE at >= ?').bind(since),
  ]);
  return { visitor: mine.results[0].n, all: all.results[0].n };
}

export async function logChat({ visitor, country, page, question, answer, model, status = 'ok' }) {
  const db = database();
  if (!db) return;
  await db
    .prepare('INSERT INTO chat_log (visitor, country, page, question, answer, model, status) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .bind(visitor, country ?? null, page ?? null, question, answer ?? null, model ?? null, status)
    .run();
}

/** Newest first; pass the last id seen as `before` for the next page. */
export async function listChats({ limit = 50, before } = {}) {
  const db = database();
  if (!db) return [];
  const query = before
    ? db.prepare('SELECT * FROM chat_log WHERE id < ? ORDER BY id DESC LIMIT ?').bind(before, limit)
    : db.prepare('SELECT * FROM chat_log ORDER BY id DESC LIMIT ?').bind(limit);
  const { results } = await query.all();
  return results;
}
