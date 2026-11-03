import { ImageResponse } from 'next/og';
import { getPostBySlug } from '../../../lib/services/firestore-rest';
import { OG, FAMILY, loadOgFonts } from '../../../lib/og';

export const alt = 'Article by Christian Del Río';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }) {
  const { slug } = await params;

  // Firestore over REST works in the edge runtime, so the card can carry the
  // real headline instead of a title reconstructed from the slug.
  const post = await getPostBySlug(slug);
  const title =
    post?.title ||
    slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  const fonts = await loadOgFonts();

  // Long headlines need to step down or they overflow the card.
  const fontSize = title.length > 70 ? 62 : title.length > 45 ? 76 : 94;

  const date = post?.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: OG.paper,
          color: OG.ink,
          padding: '48px 56px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: 22,
            borderBottom: `2px solid ${OG.rule}`,
            fontFamily: FAMILY.mono,
            fontSize: 20,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: OG.grey,
          }}
        >
          <span>Writing — Christian Del Río</span>
          {post?.tag ? <span style={{ color: OG.signal }}>{post.tag}</span> : <span />}
        </div>

        <div
          style={{
            display: 'flex',
            fontFamily: FAMILY.display,
            fontSize,
            lineHeight: 0.98,
            letterSpacing: '-0.04em',
            paddingTop: 16,
            paddingBottom: 16,
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 22,
            borderTop: `2px solid ${OG.rule}`,
            fontFamily: FAMILY.mono,
            fontSize: 20,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: OG.grey,
          }}
        >
          <span>{date || 'iamdelrio.com'}</span>
          <span>iamdelrio.com/blog</span>
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
