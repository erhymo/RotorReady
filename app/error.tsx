"use client";

import { Logo } from "@/components/Logo";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Sentry's client config already installs a global window error handler
  // (sentry.client.config.ts), so uncaught render errors reaching this
  // boundary are already reported without an explicit captureException call
  // here. Importing @sentry/nextjs directly in a page-level file pulls in
  // its server instrumentation bundle too, which breaks the production
  // build (unresolved @opentelemetry/semantic-conventions) — keep this file
  // free of that import.
  void error;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900 flex items-center justify-center p-6">
      <div className="max-w-sm w-full rounded-2xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-8 text-center shadow-sm">
        <Logo className="h-12 w-12 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">Something went wrong</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-zinc-300">
          An unexpected error occurred. You can try again, or head back to the home screen.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="rounded-lg bg-[#2E6EA1] px-4 py-2 text-sm font-semibold text-white active:scale-95"
          >
            Try again
          </button>
          {/* Hard reload (not next/link) is intentional: the render tree that
              threw is potentially in a broken state, so a full navigation is
              more likely to fully recover than a client-side transition. */}
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
