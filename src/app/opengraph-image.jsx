import { ImageResponse } from 'next/og';
import { OG, FAMILY, loadOgFonts } from '../lib/og';

export const alt = 'Christian Del Río — Engineer & Builder';
export const size = { width: 1200, height: 630 };
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
          padding: '48px 56px',
        }}
      >
        {/* Running head */}
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
          <span>Christian Del Río</span>
          <span>Madrid · 40.4°N</span>
        </div>

        {/* The name, set the way the site cover sets it */}
        <div style={{ display: 'flex', flexDirection: 'column', paddingTop: 8 }}>
          <div
            style={{
              display: 'flex',
              fontFamily: FAMILY.display,
              fontSize: 148,
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
              fontSize: 148,
              lineHeight: 0.94,
              letterSpacing: '-0.05em',
              textTransform: 'uppercase',
              marginLeft: 72,
            }}
          >
            <span style={{ color: OG.grey }}>Del&nbsp;</span>
            <span style={{ color: OG.signal }}>Río</span>
          </div>
        </div>

        {/* Foot: the positioning line, plus the specs strip */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontFamily: FAMILY.serif,
              fontStyle: 'italic',
              fontSize: 40,
              color: OG.ink,
              paddingBottom: 22,
            }}
          >
            Enterprise engineer by day. Indie hacker by night.
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
            <span>Software engineer at Santander</span>
            <span>iamdelrio.com</span>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
