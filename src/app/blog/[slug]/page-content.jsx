'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Prose from '../../../components/Prose';

const formatDate = (value) =>
  new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

/** Reading progress as a single hairline. Cheap, passive, no library. */
function useReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const limit = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(limit > 0 ? Math.min(100, (window.scrollY / limit) * 100) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return progress;
}

export default function BlogPostPage({ post = null, slug = '' }) {
  const progress = useReadingProgress();

  if (!post) {
    return (
      <main className="ed-page" id="main" style={{ paddingBlock: '8rem' }}>
        <h1 className="ed-masthead-title">Not found</h1>
        <Link href="/blog" className="ed-article-back ed-mono">
          <span aria-hidden="true">←</span> Back to writing
        </Link>
      </main>
    );
  }

  const shareUrl = `https://www.iamdelrio.com/blog/${slug}`;

  return (
    <>
      <div className="ed-progress" style={{ width: `${progress}%` }} aria-hidden="true" />

      <article className="ed-article ed-page" id="main">
        <header className="ed-article-head">
          <Link href="/blog" className="ed-article-back ed-mono">
            <span aria-hidden="true">←</span> Writing
          </Link>

          {post.tag && <div className="ed-mono ed-mono--signal">{post.tag}</div>}

          <h1 className="ed-article-title">{post.title}</h1>
        </header>

        <div className="ed-article-meta ed-mono">
          <span>{formatDate(post.date)}</span>
          {post.readTime && <span>{post.readTime}</span>}
          <span>Christian Del Río</span>
        </div>

        {post.image && (
          <figure className="ed-article-figure">
            <Image src={post.image} alt={post.title} width={1600} height={686} priority />
          </figure>
        )}

        {post.excerpt && <p className="ed-article-lede">{post.excerpt}</p>}

        <Prose content={post.content} />

        <footer className="ed-article-foot ed-mono">
          <span>Thanks for reading.</span>
          <div className="ed-share">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Share on X
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <Link href="/blog">All posts →</Link>
          </div>
        </footer>
      </article>
    </>
  );
}
