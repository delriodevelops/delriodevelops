import HomeContent from './page-content';
import { getPosts, getProjects } from '../lib/services/firestore-rest';
import { identity, socials, companies } from '../data/profile';
import { FALLBACK_PROJECTS } from '../data/fallback-projects';
import { repoNames, withRepoMedia } from '../lib/repo-media';

// Generated once per deploy, never at request time: on Workers a page rendered on demand can
// run past the CPU limit (error 1102) and strand the regeneration for the requests after it.
// Content edited in the admin shows after the next deploy (a push, or Retry build in Cloudflare).
export const revalidate = false;

export default async function Page() {
  const [stored, allPosts] = await Promise.all([getProjects(), getPosts()]);
  // current covers, galleries and film clips from the repo (lib/repo-media)
  const allProjects = stored.map(withRepoMedia);

  // Without Firestore the work list is the repo's entries, minus the concept sites: fictional
  // brands, not products shipped (they have their own index after the work)
  const products = FALLBACK_PROJECTS.filter((project) => !project.concept);
  const source = allProjects.length > 0 ? allProjects : products;
  const featured = source.filter((project) => project.featured);
  const picked = featured.length > 0 ? featured : source;
  // Every product with a launch film is in the strip as well, even one that lives only in this repo
  // (CitySwipe, Billonario): the strip is the one place on the home where each product shows
  const isPicked = (entry) => picked.some((project) => repoNames(entry).includes((project.name || '').toLowerCase()));
  const display = [...picked, ...products.filter((entry) => entry.video && !isPicked(entry))].slice(0, 8);

  const projects = display.map((project, index) => ({
    id: project.id,
    number: String(index + 1).padStart(2, '0'),
    title: project.name,
    description: project.description,
    image: project.image,
    clip: project.clip || null,
    tags: project.tags || [],
    category:
      project.type ||
      project.category ||
      (project.tags?.includes('Product') ? 'Product' : 'Project'),
    liveUrl: project.href,
    featured: project.featured ?? false,
  }));

  // The concept sites (fictional brands, built with immersive-web) have their own index, in the
  // repo's order; on hover a row plays its film's clip, or shows its still until the film lands,
  // and links to its case page
  const conceptEntries = FALLBACK_PROJECTS.filter((project) => project.concept);
  const concepts = conceptEntries.map((project, index) => ({
    id: project.id,
    number: String(index + 1).padStart(2, '0'),
    name: project.name,
    tagline: project.tagline || project.description,
    tags: (project.tags || []).filter((tag) => tag !== 'Concept'),
    image: project.image,
    clip: project.clip || null,
    film: Boolean(project.video),
  }));

  // How fast they were made, from the entries' own dates: the first batch to the latest site
  const conceptDates = conceptEntries.map((project) => project.date).filter(Boolean).sort();
  const days = conceptDates.length
    ? Math.round((Date.parse(conceptDates[conceptDates.length - 1]) - Date.parse(conceptDates[0])) / 86400000) + 1
    : 0;
  const conceptPace = days
    ? {
        count: concepts.length,
        span: days >= 10 ? `${Math.round(days / 7)} weeks` : `${days} days`,
        from: conceptDates[0],
        to: conceptDates[conceptDates.length - 1],
      }
    : null;

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
      <HomeContent projects={projects} posts={posts} totalProjects={source.length} concepts={concepts} conceptPace={conceptPace} />
    </>
  );
}
