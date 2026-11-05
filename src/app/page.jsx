import HomeContent from './page-content';
import { getPosts, getProjects } from '../lib/services/firestore-rest';
import { identity, socials, companies } from '../data/profile';
import { FALLBACK_PROJECTS } from '../data/fallback-projects';

export const revalidate = 300;

export default async function Page() {
  const [allProjects, allPosts] = await Promise.all([getProjects(), getPosts()]);

  const source = allProjects.length > 0 ? allProjects : FALLBACK_PROJECTS;
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
