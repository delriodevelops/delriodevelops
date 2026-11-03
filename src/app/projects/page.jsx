import ProjectsPageContent from './page-content';
import { getProjects } from '../../lib/services/firestore-rest';
import { FALLBACK_PROJECTS } from '../../data/fallback-projects';

export const revalidate = 300;

export const metadata = {
  title: 'Selected Work | Christian Del Río',
  description:
    'Side projects and experiments built by Christian Del Río — AI tools, web apps and utilities.',
  alternates: { canonical: '/projects' },
  openGraph: { title: 'Selected Work | Christian Del Río', url: '/projects', type: 'website' },
};

export default async function Page() {
  const fetched = await getProjects();
  const all = fetched.length > 0 ? fetched : FALLBACK_PROJECTS;

  const projects = all
    .map((project, index) => ({
      ...project,
      number: String(index + 1).padStart(2, '0'),
      category:
        project.type ||
        project.category ||
        (project.tags?.includes('Product') ? 'Product' : 'Project'),
    }))
    .filter((project) => project.category.toUpperCase() !== 'PRODUCT');

  return <ProjectsPageContent projects={projects} />;
}
