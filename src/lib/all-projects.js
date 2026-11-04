import { getProjects } from './services/firestore-rest';
import { FALLBACK_PROJECTS } from '../data/fallback-projects';

/**
 * Every project the site has: the Firestore ones, in their admin order, each
 * borrowing the film and long description this repo holds for it, followed by
 * the projects that exist only here (data/fallback-projects), such as those
 * featured by their launch films. Without Firestore it is the repo list alone.
 */
export async function getAllProjects() {
  const stored = await getProjects().catch(() => []);
  const byName = (name) => FALLBACK_PROJECTS.find((p) => p.name.toLowerCase() === name?.toLowerCase());
  const known = new Set(stored.map((project) => project.name?.toLowerCase()));

  return [
    ...stored.map((project) => {
      const local = byName(project.name);
      if (!local) return project;
      return {
        ...project,
        video: project.video || local.video,
        videoPoster: project.videoPoster || local.videoPoster,
        longDescription: project.longDescription || local.longDescription,
      };
    }),
    ...FALLBACK_PROJECTS.filter((project) => !known.has(project.name.toLowerCase())),
  ];
}
