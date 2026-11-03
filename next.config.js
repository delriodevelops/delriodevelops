/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        // The Next image optimizer has no runtime on Cloudflare Workers, so
        // images are served as authored. That is only acceptable because
        // everything in /public is pre-compressed WebP (see
        // `npm run optimize:images`) — do not drop large PNGs in there.
        unoptimized: true,
        // Next 16 requires every `quality` used in the app to be declared here.
        qualities: [75, 90],
        remotePatterns: [
            { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
            { protocol: 'https', hostname: 'play-lh.googleusercontent.com' },
        ],
    },
}

module.exports = nextConfig
