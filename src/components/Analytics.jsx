import Script from 'next/script';

/**
 * Cloudflare Web Analytics — privacy-first, no cookies, no consent banner
 * needed, and it works on the Workers deployment the site already uses.
 *
 * Set NEXT_PUBLIC_CF_ANALYTICS_TOKEN in .env.local (and in the Worker's
 * variables) to switch it on. Without the token this renders nothing, so local
 * development and previews stay clean.
 */
export default function Analytics() {
  const token = process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN;
  if (!token) return null;

  return (
    <Script
      src="https://static.cloudflareinsights.com/beacon.min.js"
      strategy="afterInteractive"
      data-cf-beacon={JSON.stringify({ token })}
    />
  );
}
