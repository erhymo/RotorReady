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
  //
  // Podcast mp3s are excluded for the same reason, but more severely: precaching all of them
  // on install meant every first-time visitor's service worker tried to download ~400MB of
  // audio before it could ever finish installing — on a real device this routinely never
  // completed, so the SW stayed stuck in "installing" forever and never activated, silently
  // disabling ALL offline support (not just audio) for most users. Audio downloads already
  // have their own explicit, one-file-at-a-time Cache API flow (lib/audioOffline.ts) triggered
  // by the in-app Download button — that's the only place episodes should be cached.
  //
  // Same reasoning again for reference imagery nested under public/ (QRH/CWP light page
  // scans, procedure figures, RFM crops — ~640 files, ~10MB total): individually small, but
  // that many separate requests still made a fresh install take about a minute end to end on
  // the real deployment, which is still too slow for "downloaded a podcast right before
  // boarding" to reliably finish before the phone goes into airplane mode. These aren't part
  // of the app shell — they're fetched on first real visit to that specific page and cached
  // from then on by the "Static assets and icons" StaleWhileRevalidate rule below, same as
  // before, just not blocking install. The `*/*.png`/`*/*.svg` pattern (requires a directory
  // level) deliberately leaves the handful of root-level app icons/logo precached, since
  // those genuinely are app-shell chrome and there are too few of them to matter.
  //
  // Turns out file COUNT, not bytes, was the real bottleneck: workbox precaches sequentially
  // enough that ~475 individually-fast, individually-tiny files (confirmed via a direct fetch
  // sweep: all 200s, ~0.3MB combined) still took well over 90s end to end on the live site.
  // The other 227 of those entries are every quiz-data/model-data/training-lights/audio-json
  // file across every model — already covered by the runtime-caching NetworkFirst rules below,
  // so precaching them again at install is pure duplication. Excluding them leaves install
  // down to essentially just the JS/CSS app shell.
  publicExcludes: ['!**/*.pdf', '!**/*.mp3', '!**/*/*.png', '!**/*/*.svg', '!**/*.json'],
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

// NATIVE_EXPORT=1 builds a separate static bundle of just the offline-critical route
// tree (home, quiz, AW169 training/lights, audio) to embed directly in the native app —
// see scripts/build-native-shell.mjs. It needs `output: 'export'` (which disallows
// redirects()/headers()/rewrites() and requires next/image without its default server
// loader) and a separate distDir so it never collides with the normal Vercel build.
// The service worker has no purpose inside a bundle that's already local, so it's
// skipped entirely for this mode.
const isNativeExport = process.env.NATIVE_EXPORT === '1';

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['firebase-admin'],
  outputFileTracingRoot: __dirname,
  // lib/build/staticParams.ts reads public/audio, public/model-data etc. with
  // dynamic fs.readdirSync/readFileSync paths (for generateStaticParams — see
  // scripts/build-native-shell.mjs) — Next's output tracer can't tell which
  // files those calls actually touch, so it conservatively bundled the whole
  // ~400MB public/audio directory into the dynamic-route serverless
  // functions that import it (any /audio/[id] or /quiz/[section]/... id not
  // covered by generateStaticParams still gets a server-rendered fallback),
  // blowing straight past Vercel's 250MB per-function limit and failing the
  // deploy outright. These large asset directories are never actually read
  // at request time by those functions (only at build time, and only the
  // small JSON/index files within them) — exclude them from tracing.
  outputFileTracingExcludes: {
    '*': ['./public/audio/**', './public/training/**', './public/**/*.pdf'],
  },
  webpack(config, { isServer }) {
    if (isServer) {
      const currentExternals = config.externals ?? [];
      config.externals = Array.isArray(currentExternals)
        ? [...currentExternals, firebaseAdminExternals]
        : [currentExternals, firebaseAdminExternals];
    }
    return config;
  },
  ...(isNativeExport
    ? {
        output: 'export',
        distDir: '.next-native',
        images: { unoptimized: true },
      }
    : {
        async redirects() {
          return [
            { source: "/auth/signin", destination: "/login", permanent: true },
            { source: "/auth/signup", destination: "/signup", permanent: true },
          ];
        },
      }),
};

export default isNativeExport ? nextConfig : withPWA(nextConfig);

