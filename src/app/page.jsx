import HomeContent from './page-content';
import { getPosts, getProjects } from '../lib/services/firestore-rest';
import { identity, socials, companies } from '../data/profile';
import { FALLBACK_PROJECTS } from '../data/fallback-projects';
import { withRepoMedia } from '../lib/repo-media';

export const revalidate = 300;

export default async function Page() {
  const [stored, allPosts] = await Promise.all([getProjects(), getPosts()]);
  // current covers from the repo for the products re-shot with their films (lib/repo-media)
  const allProjects = stored.map(withRepoMedia);

  // Without Firestore the work list is the repo's entries, minus the concept sites: fictional
  // brands, not products shipped (they have their own film scenes and case pages)
  const source = allProjects.length > 0 ? allProjects : FALLBACK_PROJECTS.filter((project) => !project.concept);
  const featured = source.filter((project) => project.featured);
  const display = (featured.length > 0 ? featured : source).slice(0, 6);

  const projects = display.map((project, index) => ({
    id: project.id,
    number: String(index + 1).padStart(2, '0'),
    title: project.name,
    description: project.description,
    image: project.image,
    tags: project.tags || [],
    category:
      project.type ||
      project.category ||
      (project.tags?.includes('Product') ? 'Product' : 'Project'),
    liveUrl: project.href,
    featured: project.featured ?? false,
  }));

  // Each featured film's button goes to its project's case page, wherever the entry lives
  const caseHref = (pattern, fallback) => `/projects/${source.find((project) => pattern.test(project.name || ''))?.id || fallback}`;
  const featureHrefs = {
    meshmind: caseHref(/meshmind/i, 'meshmind'),
    cityswipe: caseHref(/cityswipe/i, 'cityswipe'),
    billonario: caseHref(/billonario/i, 'billonario'),
    motorsportive: caseHref(/motorsportive/i, 'motorsportive'),
    resonant: caseHref(/resonant/i, 'resonant'),
    // the concept sites live only in this repo, so these fall back to their own ids
    orbita: caseHref(/^órbita$/i, 'orbita'),
    'casa-alba': caseHref(/^casa alba$/i, 'casa-alba'),
    kern: caseHref(/^kern$/i, 'kern'),
    bloop: caseHref(/^bloop$/i, 'bloop'),
    fractura: caseHref(/^fractura$/i, 'fractura'),
  };

  const posts = allPosts.slice(0, 4).map((post) => ({
    slug: post.slug,
    title: post.title || 'Untitled',
    excerpt: post.excerpt || '',
    tag: post.tag || null,
    date: post.createdAt || new Date().toISOString(),
    image: post.image || null,
  }));

  // Person schema so search engines can tie the site to a real profile.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: identity.fullName,
    alternateName: identity.name,
    url: identity.site,
    email: `mailto:${identity.email}`,
    jobTitle: identity.role.en,
    address: { '@type': 'PostalAddress', addressLocality: 'Madrid', addressCountry: 'ES' },
    sameAs: [socials.linkedin, socials.github, socials.twitter],
    worksFor: { '@type': 'Organization', name: companies[0].company },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeContent projects={projects} posts={posts} totalProjects={source.length} featureHrefs={featureHrefs} />
    </>
  );
}
