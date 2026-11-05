import { getProjects } from './services/firestore-rest';
import { FALLBACK_PROJECTS } from '../data/fallback-projects';
import { withRepoMedia } from './repo-media';

/**
 * Every project the site has: the Firestore ones, in their admin order, each
 * showing the cover, gallery, film and long description this repo holds for it, followed by
 * the projects that exist only here (data/fallback-projects), such as those
 * featured by their launch films. Without Firestore it is the repo list alone.
 */
export async function getAllProjects() {
  const stored = await getProjects().catch(() => []);
  const known = new Set(stored.map((project) => project.name?.toLowerCase()));

  return [
    ...stored.map(withRepoMedia),
    ...FALLBACK_PROJECTS.filter((project) => !known.has(project.name.toLowerCase())),
  ];
}
