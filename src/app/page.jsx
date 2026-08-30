import HomeContent from './page-content';
import { getPosts, getProjects } from '../lib/services/firestore-rest';
import { identity, socials, companies } from '../data/profile';

export const revalidate = 300;

/**
 * Shown when Firestore is unreachable or not configured (local dev without
 * env vars, or a transient outage) so the page never renders an empty shell.
 * These are real, live products — keep them in sync with Firestore.
 */
const FALLBACK_PROJECTS = [
  { id: 'motorsportive', name: 'Motorsportive', description: 'A Formula 1 publication — breaking news, race analysis and live championship standings, with an editorial desk and a shop.', image: '/motorsportive.webp', tags: ['Editorial', 'Publishing', 'SaaS'], href: 'https://motorsportive.com' },
  { id: 'fainancial', name: 'Fainancial', description: 'AI-powered earnings call analysis. Turns a 60-minute call into the three things that moved the number.', image: '/fainancial/1.webp', tags: ['AI', 'Finance', 'SaaS'], href: 'https://fainancial.app/' },
  { id: 'meshmind', name: 'MeshMind', description: 'A visual chain-of-thought builder. Draw the reasoning, watch the model follow it.', image: '/meshmind/1.webp', tags: ['AI', 'Productivity'], href: 'https://meshmind.vercel.app/' },
  { id: 'cityswipe', name: 'CitySwipe', description: 'Swipe through cities until one fits. Relocation as a matching problem.', image: '/cityswipe.webp', tags: ['Mobile', 'AI'], href: 'https://cityswipe.city' },
  { id: 'baitme', name: 'Baitme', description: 'A/B test your thumbnails before you publish, not after the CTR disappoints you.', image: '/baitme/1.webp', tags: ['Creator Tools', 'Analytics'], href: 'https://baitme.iamdelrio.com/' },
];

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
    address: { '@type': 'PostalAddress', addressLocality: 'Málaga', addressCountry: 'ES' },
    sameAs: [socials.linkedin, socials.github, socials.twitter],
    worksFor: { '@type': 'Organization', name: companies[0].company },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="ed-root">
        <HomeContent projects={projects} posts={posts} totalProjects={source.length} />
      </div>
    </>
  );
}
