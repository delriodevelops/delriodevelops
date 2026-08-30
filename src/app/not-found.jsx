'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NotFound() {
  // usePathname stays consistent between the server pass and hydration, which
  // reading window.location in an effect did not.
  const path = usePathname();

  return (
    <div className="ed-root">
      <main className="ed-404 ed-page" id="main">
        <div className="ed-cover-head ed-mono">
          <span className="ed-mono--fg">Christian Del Río</span>
          <span className="ed-mono--signal">Error 404</span>
        </div>

        <h1 className="ed-404-number">404</h1>

        <div className="ed-404-body">
          <div>
            <p className="ed-404-copy">
              This page doesn&apos;t exist — or it moved while you weren&apos;t looking.
            </p>
            {path && (
              <p className="ed-mono" style={{ marginTop: '1rem' }}>
                Requested: {path}
              </p>
            )}
          </div>

          <div className="ed-404-actions">
            <Link href="/" className="ed-btn ed-btn--solid">Home</Link>
            <Link href="/projects" className="ed-btn">Work</Link>
            <Link href="/blog" className="ed-btn">Writing</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
