/**
 * Projects that moved off Vercel to Cloudflare Workers. Firestore still holds their
 * old URLs; the public pages rewrite them through this map until each project is
 * edited in /admin, after which the entry here is dead and can go.
 *
 * `null` drops the link of a project that is offline.
 */
export const MOVED_LINKS = {
  // paused; not deployed anywhere
  'https://thumbly-seven.vercel.app': null,
};

const normalize = (url) => url.replace(/\/+$/, '');

/** The working URL for a project link, or null when the project is offline. */
export function currentLink(url) {
  if (!url) return url;
  const key = normalize(url);
  return key in MOVED_LINKS ? MOVED_LINKS[key] : url;
}
