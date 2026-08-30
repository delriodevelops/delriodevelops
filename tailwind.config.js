/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Mirror the CSS custom properties from globals.css so Tailwind classes
      // and hand-written CSS share one palette. Previously the theme was empty
      // and every file reached for arbitrary values like
      // `text-[var(--color-accent)]`.
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        accent: 'var(--color-accent)',
        'accent-dim': 'var(--color-accent-dim)',
        muted: 'var(--color-text-muted)',
        line: 'var(--color-border)',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
    },
  },
  plugins: [],
};
