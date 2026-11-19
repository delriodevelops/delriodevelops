import { notFound } from 'next/navigation';
import BlogPostContent from './page-content';
import { getPostBySlug, getPosts } from '../../../lib/services/firestore-rest';

// Generated once per deploy, never at request time: on Workers a page rendered on demand can
// run past the CPU limit (error 1102) and strand the regeneration for the requests after it.
// Content edited in the admin shows after the next deploy (a push, or Retry build in Cloudflare).
export const revalidate = false;
// an unknown slug is a 404, not a render
export const dynamicParams = false;

/** Pre-render every published post at build time. */
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.filter((post) => post.slug).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: 'Article not found | Christian Del Río' };
  }

  const description = post.excerpt || `An article by Christian Del Río.`;

  return {
    title: `${post.title} | Christian Del Río`,
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description,
      url: `/blog/${slug}`,
      type: 'article',
      publishedTime: post.createdAt || undefined,
      authors: ['Christian Del Río'],
      tags: post.tag ? [post.tag] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
    },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const serialised = {
    ...post,
    title: post.title || 'Untitled',
    excerpt: post.excerpt || '',
    content: post.content || '',
    date: post.createdAt || new Date().toISOString(),
  };

  // JSON-LD so the article is eligible for rich results.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: serialised.title,
    description: serialised.excerpt,
    datePublished: serialised.date,
    dateModified: post.updatedAt || serialised.date,
    author: { '@type': 'Person', name: 'Christian Del Río', url: 'https://www.iamdelrio.com' },
    mainEntityOfPage: `https://www.iamdelrio.com/blog/${slug}`,
    image: post.image ? `https://www.iamdelrio.com${post.image}` : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPostContent post={serialised} slug={slug} />
    </>
  );
}
