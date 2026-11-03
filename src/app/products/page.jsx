import ProductsPageContent from './page-content';
import { getProjects } from '../../lib/services/firestore-rest';

export const revalidate = 300;

export const metadata = {
  title: 'Products | Christian Del Río',
  description:
    'Shipped SaaS products built and maintained solo by Christian Del Río.',
  alternates: { canonical: '/products' },
  openGraph: { title: 'Products | Christian Del Río', url: '/products', type: 'website' },
};

export default async function Page() {
  const all = await getProjects();

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
