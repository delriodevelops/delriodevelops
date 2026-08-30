import next from 'eslint-config-next/core-web-vitals';

// `next lint` was removed in Next 16, so ESLint runs through its own CLI
// against this flat config (see the `lint` script in package.json).
const config = [
  {
    ignores: ['.next/**', '.open-next/**', 'node_modules/**', 'next-env.d.ts'],
  },
  ...(Array.isArray(next) ? next : [next]),
  {
    // Next's metadata file conventions require a default-exported function or
    // object; the anonymous-default rule does not apply to them.
    files: ['src/app/sitemap.js', 'src/app/robots.js'],
    rules: { 'import/no-anonymous-default-export': 'off' },
  },
];

export default config;
