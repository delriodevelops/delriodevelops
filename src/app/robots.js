const BASE_URL = 'https://www.iamdelrio.com';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // The admin panel and the chat endpoint have nothing to index.
        disallow: ['/admin', '/api/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
