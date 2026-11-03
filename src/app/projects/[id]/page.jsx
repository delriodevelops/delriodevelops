import { notFound } from 'next/navigation';
import ProjectDetailContent from './page-content';
import { getProjectById, getProjects } from '../../../lib/services/firestore-rest';
import { FALLBACK_PROJECTS, fallbackProject } from '../../../data/fallback-projects';

export const revalidate = 300;

// Without Firestore the case pages still render, from the fallback entries
const loadProjects = async () => {
  const projects = await getProjects();
  return projects.length > 0 ? projects : FALLBACK_PROJECTS;
};
// A Firestore entry without a film borrows the one in this repo (its files live in public/),
// matched by name; a film set in the admin always wins
const withRepoFilm = (project) => {
  if (!project || project.video) return project;
  const local = FALLBACK_PROJECTS.find((p) => p.video && p.name?.toLowerCase() === project.name?.toLowerCase());
  if (!local) return project;
  return { ...project, video: local.video, videoPoster: local.videoPoster, longDescription: project.longDescription || local.longDescription };
};
const loadProject = async (id) => withRepoFilm((await getProjectById(id)) || fallbackProject(id));

export async function generateStaticParams() {
  const projects = await loadProjects();
  return projects.map((project) => ({ id: project.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const project = await loadProject(id);

  if (!project) return { title: 'Project not found | Christian Del Río' };

  const name = project.name || project.title || 'Project';
  const description = project.description || `A project by Christian Del Río.`;

  return {
    title: `${name} | Christian Del Río`,
    description,
    alternates: { canonical: `/projects/${id}` },
    openGraph: { title: name, description, url: `/projects/${id}`, type: 'article' },
  };
}

export default async function Page({ params }) {
  const { id } = await params;
  const [project, all] = await Promise.all([loadProject(id), loadProjects()]);

  if (!project) notFound();

  // "Next case" link: the following entry in the same archive (products stay with products)
  const isProduct = (p) => (p.type || p.category || '').toUpperCase() === 'PRODUCT';
  const siblings = all.filter((p) => isProduct(p) === isProduct(project));
  const index = siblings.findIndex((p) => p.id === project.id);
  const nextProject = siblings.length > 1 && index !== -1 ? siblings[(index + 1) % siblings.length] : null;
  const next = nextProject ? { id: nextProject.id, name: nextProject.name || nextProject.title } : null;

  return <ProjectDetailContent project={project} next={next} />;
}
