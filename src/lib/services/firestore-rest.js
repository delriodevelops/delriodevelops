/**
 * Server-side Firestore access over the REST API.
 *
 * The `firebase/firestore` JS SDK is a browser client: it cannot run reliably
 * inside a Cloudflare Worker / edge runtime, which is why every page used to be
 * `dynamic(..., { ssr: false })` and the whole site shipped an empty HTML shell.
 * The REST API is plain `fetch`, so Server Components can render real content
 * and Next can cache it.
 *
 * Read-only. Writes still go through the client SDK from the admin panel, where
 * Firestore security rules authenticate the user.
 */

import { currentLink } from '../../data/moved-links';

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

// Revalidate server-rendered data every 5 minutes.
export const REVALIDATE_SECONDS = 300;

const BASE = PROJECT_ID
  ? `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`
  : null;

export const isConfigured = Boolean(BASE && API_KEY);

/** Unwrap Firestore's typed value envelope into a plain JS value. */
function decodeValue(value) {
  if (value == null) return null;
  if ('nullValue' in value) return null;
  if ('stringValue' in value) return value.stringValue;
  if ('booleanValue' in value) return value.booleanValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return value.doubleValue;
  if ('timestampValue' in value) return value.timestampValue;
  if ('arrayValue' in value) return (value.arrayValue.values || []).map(decodeValue);
  if ('mapValue' in value) return decodeFields(value.mapValue.fields || {});
  return null;
}

function decodeFields(fields) {
  const out = {};
  for (const [key, value] of Object.entries(fields)) out[key] = decodeValue(value);
  return out;
}

/** Turn a REST document resource into `{ id, ...fields }`. */
function decodeDocument(doc) {
  if (!doc?.name) return null;
  const id = doc.name.split('/').pop();
  const data = decodeFields(doc.fields || {});
  return {
    id,
    ...data,
    createdAt: data.createdAt || doc.createTime || null,
    updatedAt: data.updatedAt || doc.updateTime || null,
  };
}

async function request(path, init) {
  if (!isConfigured) return null;
  try {
    const res = await fetch(`${BASE}${path}${path.includes('?') ? '&' : '?'}key=${API_KEY}`, {
      ...init,
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) {
      console.warn(`Firestore REST ${res.status} on ${path}`);
      return null;
    }
    return await res.json();
  } catch (error) {
    console.warn('Firestore REST request failed:', error.message);
    return null;
  }
}

/**
 * Fetch a whole collection. Returns `[]` when Firebase is unconfigured or the
 * request fails, so callers can fall back to static data.
 */
export async function fetchCollection(collection) {
  const json = await request(`/${collection}?pageSize=300`);
  if (!json?.documents) return [];
  return json.documents.map(decodeDocument).filter(Boolean);
}

/** Fetch the single document in `collection` whose `field` equals `value`. */
export async function fetchWhere(collection, field, value) {
  const json = await request(':runQuery', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: collection }],
        where: {
          fieldFilter: {
            field: { fieldPath: field },
            op: 'EQUAL',
            value: { stringValue: value },
          },
        },
        limit: 1,
      },
    }),
  });
  const hit = Array.isArray(json) ? json.find((row) => row.document) : null;
  return hit ? decodeDocument(hit.document) : null;
}

/** Fetch a document by its id. */
export async function fetchDocument(collection, id) {
  const json = await request(`/${collection}/${id}`);
  return json ? decodeDocument(json) : null;
}

// ---------------------------------------------------------------- collections

export async function getPosts() {
  const posts = await fetchCollection('blog_posts');
  return posts.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
}

export async function getPostBySlug(slug) {
  return fetchWhere('blog_posts', 'slug', slug);
}

// Links to projects that moved hosts are rewritten until Firestore is edited (data/moved-links)
const withCurrentLink = (project) => (project ? { ...project, href: currentLink(project.href) } : project);

export async function getProjects() {
  const projects = await fetchCollection('projects');
  return projects.map(withCurrentLink).sort((a, b) => (a.order || 0) - (b.order || 0));
}

export async function getProjectById(id) {
  return withCurrentLink(await fetchDocument('projects', id));
}
