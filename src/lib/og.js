/**
 * Shared pieces for the generated social cards.
 *
 * Satori (next/og) cannot read the app's next/font files, so the faces are
 * fetched from a CDN. Every card degrades to the built-in sans if that fetch
 * fails — the layout is hairlines and flat colour, so it survives the swap.
 */

export const OG = {
  paper: '#efece5',
  ink: '#14120f',
  grey: '#6f6a60',
  rule: 'rgba(20, 18, 15, 0.18)',
  signal: '#ff3b12',
};

const FILES = [
  { name: 'Display', weight: 800, style: 'normal', url: 'https://cdn.jsdelivr.net/npm/@fontsource/bricolage-grotesque@5/files/bricolage-grotesque-latin-800-normal.woff' },
  { name: 'Mono', weight: 400, style: 'normal', url: 'https://cdn.jsdelivr.net/npm/@fontsource/geist-mono@5/files/geist-mono-latin-400-normal.woff' },
  { name: 'Serif', weight: 400, style: 'italic', url: 'https://cdn.jsdelivr.net/npm/@fontsource/instrument-serif@5/files/instrument-serif-latin-400-italic.woff' },
];

/** Returns the font list next/og expects, or undefined if none loaded. */
export async function loadOgFonts() {
  const loaded = await Promise.all(
    FILES.map(async ({ url, ...font }) => {
      try {
        const response = await fetch(url, { cache: 'force-cache' });
        if (!response.ok) return null;
        return { ...font, data: await response.arrayBuffer() };
      } catch {
        return null;
      }
    })
  );

  const fonts = loaded.filter(Boolean);
  return fonts.length > 0 ? fonts : undefined;
}

/** Font stacks that resolve whether or not the CDN answered. */
export const FAMILY = {
  display: 'Display, sans-serif',
  mono: 'Mono, monospace',
  serif: 'Serif, serif',
};
