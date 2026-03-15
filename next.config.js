/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    '127.0.0.1',
    'localhost',
    ...(process.env.REPLIT_DEV_DOMAIN ? [process.env.REPLIT_DEV_DOMAIN] : []),
    ...(process.env.REPLIT_DOMAINS ? process.env.REPLIT_DOMAINS.split(',') : []),
  ],
  serverExternalPackages: ['undici', 'cheerio'],
}

module.exports = nextConfig
