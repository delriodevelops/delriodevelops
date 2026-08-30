'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function ProductsPageContent({ products = [] }) {
  return (
    <>

      <header className="ed-masthead ed-page">
        <Link href="/" className="ed-article-back ed-mono">
          <span aria-hidden="true">←</span> Christian Del Río
        </Link>

        <h1 className="ed-masthead-title">Products</h1>

        <p className="ed-masthead-lede">
          Things I built, shipped and still maintain on my own. Every one of these is live.
        </p>
      </header>

      <main className="ed-index-page ed-page" id="main">
        {products.length === 0 ? (
          <p className="ed-mono" style={{ paddingBlock: '3rem' }}>Nothing here yet.</p>
        ) : (
          <>
            <div
              className="ed-mono"
              style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0' }}
            >
              <span>Index</span>
              <span>{String(products.length).padStart(2, '0')} entries</span>
            </div>

            {products.map((product, i) => (
              <a
                className="ed-index-row"
                key={product.id}
                href={product.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="ed-mono">{String(i + 1).padStart(2, '0')}</span>

                <div>
                  <h2 className="ed-index-row-title">{product.name}</h2>
                  {product.description && (
                    <p className="ed-index-row-excerpt">{product.description}</p>
                  )}
                  {product.tags.length > 0 && (
                    <div className="ed-cv-tags">
                      {product.tags.slice(0, 4).map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="ed-index-row-side ed-mono">
                  {product.wip && <div className="ed-mono--signal">WIP</div>}
                  <div style={{ marginTop: product.wip ? '0.4rem' : 0 }}>Visit ↗</div>
                </div>

                {product.images?.[0] && (
                  <figure className="ed-plate" style={{ gridColumn: '2 / -1', marginTop: '1rem' }}>
                    <Image
                      src={product.images[0]}
                      alt={`${product.name} interface`}
                      width={1200}
                      height={750}
                      sizes="(max-width: 760px) 100vw, 70vw"
                    />
                  </figure>
                )}
              </a>
            ))}
          </>
        )}
      </main>
    </>
  );
}
