import { FALLBACK_PROJECTS } from '../data/fallback-projects';

const lower = (name) => (name || '').toLowerCase();

/** Every name an entry of this repo answers to: its own and the other spellings Firestore has for it. */
export const repoNames = (entry) => [entry.name, ...(entry.aliases || [])].map(lower);

const repoEntry = (project) => {
  const name = lower(project?.name || project?.title);
  return name ? FALLBACK_PROJECTS.find((p) => repoNames(p).includes(name)) : undefined;
};

/**
 * A Firestore project with media in this repo (data/fallback-projects + public/) shows the repo's:
 * those are the current shots, re-taken with each product's film or after a redesign, while
 * Firestore can still hold the covers and galleries from before. The cover, the gallery, the film
 * and the film's clip come from the repo when it has them; a film set in the admin still wins, and
 * every other field stays Firestore's, except a name the repo lists as a misspelling (`aliases`),
 * which shows as the repo spells it.
 */
export function withRepoMedia(project) {
  if (!project) return project;
  const local = repoEntry(project);
  if (!local) return project;
  const merged = { ...project };
  if (lower(project.name || project.title) !== lower(local.name)) merged.name = local.name;
  if (local.image) merged.image = local.image;
  if (local.images?.length) {
    merged.images = local.images;
    merged.gallery = local.images;
  }
  if (local.video && !project.video) {
    merged.video = local.video;
    merged.videoPoster = local.videoPoster;
  }
  if (local.clip) merged.clip = local.clip;
  if (!project.longDescription && local.longDescription) merged.longDescription = local.longDescription;
  return merged;
}
