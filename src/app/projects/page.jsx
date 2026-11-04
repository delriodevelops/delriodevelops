import ProjectsPageContent from './page-content';
import { getAllProjects } from '../../lib/all-projects';

export const revalidate = 300;

export const metadata = {
  title: 'Selected Work | Christian Del Río',
  description:
    'Everything Christian Del Río has built — products, AI tools, games and experiments.',
  alternates: { canonical: '/projects' },
  openGraph: { title: 'Selected Work | Christian Del Río', url: '/projects', type: 'website' },
};

export default async function Page() {
  // Everything: products included, so "All projects" means all of them
  const projects = (await getAllProjects()).map((project, index) => ({
    ...project,
    number: String(index + 1).padStart(2, '0'),
  }));

  return <ProjectsPageContent projects={projects} />;
}
