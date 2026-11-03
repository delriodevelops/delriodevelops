import BlogPageContent from './page-content';
import { getPosts } from '../../lib/services/firestore-rest';

export const revalidate = 300;

export const metadata = {
  title: 'Writing | Christian Del Río',
  description:
    'Articles on indie hacking, AI engineering and modern web development by Christian Del Río.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Writing | Christian Del Río',
    description: 'Articles on indie hacking, AI engineering and modern web development.',
    url: '/blog',
    type: 'website',
  },
};

export default async function Page() {
  const posts = await getPosts();

  // Normalise the shape the client component expects.
  const serialised = posts.map((post) => ({
    slug: post.slug,
    title: post.title || 'Untitled',
    excerpt: post.excerpt || '',
    tag: post.tag || null,
    image: post.image || null,
    date: post.createdAt || new Date().toISOString(),
  }));

  return <BlogPageContent posts={serialised} />;
}
