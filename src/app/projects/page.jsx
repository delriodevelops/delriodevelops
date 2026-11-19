import ProjectsPageContent from './page-content';
import { getAllProjects } from '../../lib/all-projects';

// Generated once per deploy, never at request time: on Workers a page rendered on demand can
// run past the CPU limit (error 1102) and strand the regeneration for the requests after it.
// Content edited in the admin shows after the next deploy (a push, or Retry build in Cloudflare).
export const revalidate = false;

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
