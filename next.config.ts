import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: { dirs: ['src'] },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { hostname: 'images.mapbox.com' },
      { hostname: 'flagcdn.com' },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  },
  headers: async () => [
    {
      source: '/api/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
      ],
    },
  ],
}

export default nextConfig
