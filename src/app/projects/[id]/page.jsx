import { notFound } from 'next/navigation';
import ProjectDetailContent from './page-content';
import { getProjectById, getProjects } from '../../../lib/services/firestore-rest';

export const revalidate = 300;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ id: project.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const project = await getProjectById(id);

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
  const project = await getProjectById(id);

  if (!project) notFound();

  return <ProjectDetailContent project={project} />;
}
