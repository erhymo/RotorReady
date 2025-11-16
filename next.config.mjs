import { fileURLToPath } from 'url';
import path from 'path';
import withPWAInit from 'next-pwa';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  skipWaiting: true,
  reloadOnOnline: true,
  cacheStartUrl: false,
  disable: process.env.NODE_ENV === 'development',
  fallbacks: {
    document: '/offline',
  },
  runtimeCaching: [
    {
      // Quiz JSON and model JSON: network first for freshness, fall back to cache for offline
      urlPattern: ({ url }) =>
        url.pathname.startsWith('/quiz-data/') || url.pathname.startsWith('/model-data/'),
      handler: 'NetworkFirst',
      options: {
        cacheName: 'quiz-json',
        expiration: { maxEntries: 400, maxAgeSeconds: 60 * 60 * 24 * 30 },
      },
    },
    {
      // Static assets and icons
      urlPattern: ({ request }) =>
        request.destination === 'image' ||
        request.destination === 'style' ||
        request.destination === 'font',
      handler: 'StaleWhileRevalidate',
      options: { cacheName: 'assets' },
    },
    {
      // Ensure quiz amount-selection pages are cached and available offline
      // Place this before the generic navigate handler so /quiz/* navigations
      // reuse the 'quiz-pages' cache that we warm up from the Offline page.
      urlPattern: ({ url }) => url.pathname.startsWith('/quiz/'),
      handler: 'NetworkFirst',
      options: { cacheName: 'quiz-pages' },
    },
    {
      // HTML navigations (fallback for all other pages)
      urlPattern: ({ request }) => request.mode === 'navigate',
      handler: 'NetworkFirst',
      options: { cacheName: 'pages' },
    },
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      { source: "/auth/signin", destination: "/login", permanent: true },
      { source: "/auth/signup", destination: "/signup", permanent: true },
    ];
  },
};

export default withPWA(nextConfig);

