import { FALLBACK_PROJECTS } from '../data/fallback-projects';

const repoEntry = (project) =>
  FALLBACK_PROJECTS.find((p) => p.name?.toLowerCase() === (project?.name || project?.title)?.toLowerCase());

/**
 * A Firestore project with media in this repo (data/fallback-projects + public/) shows the repo's:
 * those are the current shots, re-taken with each product's film, while Firestore can still hold
 * the covers and galleries from before a redesign. The cover, the gallery and the film come from
 * the repo when it has them; a film set in the admin still wins, and every other field stays
 * Firestore's.
 */
export function withRepoMedia(project) {
  if (!project) return project;
  const local = repoEntry(project);
  if (!local) return project;
  const merged = { ...project };
  if (local.image) merged.image = local.image;
  if (local.images?.length) {
    merged.images = local.images;
    merged.gallery = local.images;
  }
  if (local.video && !project.video) {
    merged.video = local.video;
    merged.videoPoster = local.videoPoster;
  }
  if (!project.longDescription && local.longDescription) merged.longDescription = local.longDescription;
  return merged;
}
