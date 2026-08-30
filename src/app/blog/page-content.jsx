'use client';

import Link from 'next/link';

const formatDate = (value) =>
  new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

export default function BlogIndex({ posts = [] }) {
  return (
    <>

      <header className="ed-masthead ed-page">
        <Link href="/" className="ed-article-back ed-mono">
          <span aria-hidden="true">←</span> Christian Del Río
        </Link>

        <h1 className="ed-masthead-title">Writing</h1>

        <p className="ed-masthead-lede">
          Notes on shipping products alone, AI engineering, and what the day job teaches
          the night job.
        </p>
      </header>

      <main className="ed-index-page ed-page" id="main">
        {posts.length === 0 ? (
          <p className="ed-mono" style={{ paddingBlock: '3rem' }}>
            Nothing published yet — check back soon.
          </p>
        ) : (
          <>
            <div
              className="ed-mono"
              style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0' }}
            >
              <span>Index</span>
              <span>{String(posts.length).padStart(2, '0')} entries</span>
            </div>

            {posts.map((post, i) => (
              <Link className="ed-index-row" key={post.slug} href={`/blog/${post.slug}`}>
                <span className="ed-mono">{String(i + 1).padStart(2, '0')}</span>

                <div>
                  <h2 className="ed-index-row-title">{post.title}</h2>
                  {post.excerpt && <p className="ed-index-row-excerpt">{post.excerpt}</p>}
                </div>

                <div className="ed-index-row-side ed-mono">
                  <div>{formatDate(post.date)}</div>
                  {post.tag && (
                    <div className="ed-mono--signal" style={{ marginTop: '0.4rem' }}>
                      {post.tag}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </>
        )}
      </main>
    </>
  );
}
