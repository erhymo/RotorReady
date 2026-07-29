import { fileURLToPath } from 'url';
import path from 'path';
import withPWAInit from 'next-pwa';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const firebaseAdminExternals = {
  'firebase-admin': 'commonjs firebase-admin',
  'firebase-admin/app': 'commonjs firebase-admin/app',
  'firebase-admin/auth': 'commonjs firebase-admin/auth',
  'firebase-admin/firestore': 'commonjs firebase-admin/firestore',
};

const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  skipWaiting: true,
  reloadOnOnline: true,
  cacheStartUrl: false,
  disable: process.env.NODE_ENV === 'development',
  // Next.js App Router emits app-build-manifest.json as a webpack asset, but it isn't served
  // as a fetchable static route — precaching it makes workbox's install() reject (404), which
  // silently discards the ENTIRE service worker registration. next-pwa 5.6.0 predates the App
  // Router and doesn't know to exclude it, so we exclude it ourselves.
  buildExcludes: [/app-build-manifest\.json$/],
  // Don't blanket-precache large reference PDFs (RFMs/QRHs) onto every visitor's device just
  // because they live under public/ — fetch them on demand instead. One of them (an AW139 QRH
  // with special characters in its filename) also currently 404s, which broke SW install the
  // same way as app-build-manifest.json above.
  publicExcludes: ['!**/*.pdf'],
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
      // Global AW169 lights JSON lives outside /model-data and must also be cached for offline.
      urlPattern: ({ url }) =>
        url.pathname === '/training/lights/manifest.json' ||
        (url.pathname.startsWith('/training/lights/') && url.pathname.endsWith('.json')),
      handler: 'NetworkFirst',
      options: {
        cacheName: 'lights-json',
        expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
      },
    },
    {
      // Podcast episode listings (not the mp3 files themselves — those are handled by the
      // explicit per-episode "download for offline" feature, not auto-cached here).
      urlPattern: ({ url }) => url.pathname.startsWith('/audio/') && url.pathname.endsWith('.json'),
      handler: 'NetworkFirst',
      options: {
        cacheName: 'audio-json',
        expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
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
      // Ensure quiz start/question/result pages are cached and available offline.
      // Place this before the generic navigate handler so explicit quiz routes
      // reuse the dedicated cache warmed from the Offline page.
      urlPattern: ({ url }) => [
        '/quiz/',
        '/emergency-quiz',
        '/engine-systems-quiz',
        '/avionics-fms-limitations-quiz',
      ].some((prefix) => url.pathname.startsWith(prefix)),
      handler: 'NetworkFirst',
      options: { cacheName: 'quiz-pages' },
    },
    {
      // AW169 lights routes rely on warmed pages plus query params like ?resume=1.
      urlPattern: ({ url }) => [
        '/training/lights',
        '/training/lights/cwp/aw169',
        '/aw169/procedures/single-engine',
        '/aw169/procedures/engine-shutdown-emergency',
        '/aw169/procedures/engine-re-light',
      ].includes(url.pathname),
      handler: 'NetworkFirst',
      options: {
        cacheName: 'lights-pages',
        matchOptions: { ignoreSearch: true },
      },
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
  serverExternalPackages: ['firebase-admin'],
  outputFileTracingRoot: __dirname,
  webpack(config, { isServer }) {
    if (isServer) {
      const currentExternals = config.externals ?? [];
      config.externals = Array.isArray(currentExternals)
        ? [...currentExternals, firebaseAdminExternals]
        : [currentExternals, firebaseAdminExternals];
    }
    return config;
  },
  async redirects() {
    return [
      { source: "/auth/signin", destination: "/login", permanent: true },
      { source: "/auth/signup", destination: "/signup", permanent: true },
    ];
  },
};

export default withPWA(nextConfig);

