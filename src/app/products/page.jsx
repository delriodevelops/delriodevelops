import ProductsPageContent from './page-content';
import { getProjects } from '../../lib/services/firestore-rest';
import { withRepoMedia } from '../../lib/repo-media';

// Generated once per deploy, never at request time: on Workers a page rendered on demand can
// run past the CPU limit (error 1102) and strand the regeneration for the requests after it.
// Content edited in the admin shows after the next deploy (a push, or Retry build in Cloudflare).
export const revalidate = false;

export const metadata = {
  title: 'Products | Christian Del Río',
  description:
    'Shipped SaaS products built and maintained solo by Christian Del Río.',
  alternates: { canonical: '/products' },
  openGraph: { title: 'Products | Christian Del Río', url: '/products', type: 'website' },
};

export default async function Page() {
  const all = (await getProjects()).map(withRepoMedia);

  const products = all
    .map((project, index) => ({
      id: project.id,
      number: String(index + 1).padStart(2, '0'),
      name: project.name || project.title,
      description: project.description,
      images: project.image ? [project.image] : [],
      href: project.href || project.liveUrl,
      tags: project.tags || [],
      wip: project.wip ?? null,
      category:
        project.type ||
        project.category ||
        (project.tags?.includes('Product') ? 'Product' : 'Project'),
    }))
    .filter((product) => product.category.toUpperCase() === 'PRODUCT');

  return <ProductsPageContent products={products} />;
}
