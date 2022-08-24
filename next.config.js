/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    USER: process.env.USER,
    PASS:process.env.PASS
  }
}

module.exports = nextConfig
