"use client";

import { Logo } from "@/components/Logo";

// The web service worker's fallback page (fallbacks.document in next.config.mjs):
// shown when a page is opened without a connection and was never cached on this
// device. It has to exist — next-pwa precaches it, and a precache entry that
// 404s makes the whole service worker install fail.
//
// Until 2026-09-24 this route was an "Offline packages" page for downloading quiz
// chapters by hand. It was removed because the native app already bundles all
// content and the web service worker caches what is opened, and because its
// hand-downloaded copies were what kept the S92 limitations quiz stuck at 20
// questions after 48 were published.
export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900 flex items-center justify-center p-6">
      <div className="max-w-sm w-full rounded-2xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-8 text-center shadow-sm">
        <Logo className="h-12 w-12 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">You&apos;re offline</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-zinc-300">
          This page hasn&apos;t been opened on this device before, so it isn&apos;t available without a connection.
          Pages you have already opened still work.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-[#2E6EA1] px-4 py-2 text-sm font-semibold text-white active:scale-95"
          >
            Try again
          </button>
          {/* Hard navigation: the home page is served from the service worker's
              cache, which a client-side transition would not necessarily use. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/"
            className="rounded-lg border px-4 py-2 text-sm font-semibold text-slate-700 dark:text-zinc-100 dark:border-zinc-700 active:scale-95"
          >
            Home
          </a>
        </div>
      </div>
    </div>
  );
}
