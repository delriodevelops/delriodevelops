import { ImageResponse } from 'next/og';
import { OG, FAMILY, loadOgFonts } from '../lib/og';

export const alt = 'Christian Del Río — Engineer & Builder';
export const size = { width: 1200, height: 600 };
export const contentType = 'image/png';

export default async function Image() {
  const fonts = await loadOgFonts();

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
          padding: '44px 52px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: 20,
            borderBottom: `2px solid ${OG.rule}`,
            fontFamily: FAMILY.mono,
            fontSize: 19,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: OG.grey,
          }}
        >
          <span>Christian Del Río</span>
          <span>iamdelrio.com</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontFamily: FAMILY.display,
              fontSize: 132,
              lineHeight: 0.94,
              letterSpacing: '-0.05em',
              textTransform: 'uppercase',
            }}
          >
            Christian
          </div>
          <div
            style={{
              display: 'flex',
              fontFamily: FAMILY.display,
              fontSize: 132,
              lineHeight: 0.94,
              letterSpacing: '-0.05em',
              textTransform: 'uppercase',
              marginLeft: 64,
            }}
          >
            <span style={{ color: OG.grey }}>Del&nbsp;</span>
            <span style={{ color: OG.signal }}>Río</span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 20,
            borderTop: `2px solid ${OG.rule}`,
            fontFamily: FAMILY.mono,
            fontSize: 19,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: OG.grey,
          }}
        >
          <span>Engineer · Indie hacker</span>
          <span style={{ color: OG.signal }}>Available</span>
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
