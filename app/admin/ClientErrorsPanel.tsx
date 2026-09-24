"use client";

import { useCallback, useEffect, useState } from "react";

// Crash reports from pilots' devices (lib/clientErrors.ts → /api/client-error),
// one line per distinct error with how often it happened.

type ClientError = {
  id: string;
  kind: string;
  message: string;
  count: number;
  firstSeenAt: string;
  lastSeenAt: string;
  platforms?: string[];
  last?: {
    stack?: string;
    path?: string;
    platform?: string;
    appVersion?: string;
    digest?: string;
    userAgent?: string;
  };
};

function when(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
}

export default function ClientErrorsPanel() {
  const [errors, setErrors] = useState<ClientError[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setNotice(null);
    try {
      const res = await fetch("/api/admin/client-errors", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      setErrors(Array.isArray(data?.errors) ? data.errors : []);
      setNotice(data?.error || data?.devWarning || (res.ok ? null : `HTTP ${res.status}`));
    } catch (error: any) {
      setNotice(error?.message || "Could not load errors");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function clear(id: string) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/client-errors?id=${id}`, { method: "DELETE" });
      if (res.ok) setErrors((prev) => prev.filter((e) => e.id !== id));
      else setNotice(`Could not clear (HTTP ${res.status})`);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-100 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Errors</h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Crashes on users&apos; devices, web and native. Clear an entry once its fix has shipped; it reappears if the error comes back.
          </p>
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Refresh
        </button>
      </div>

      {notice && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-900/30 dark:text-red-200">
          {notice}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-slate-600 dark:text-zinc-300">Loading errors…</p>
      ) : errors.length === 0 ? (
        <p className="text-sm text-slate-600 dark:text-zinc-300">No errors reported.</p>
      ) : (
        <ul className="space-y-3">
          {errors.map((e) => (
            <li key={e.id} className="rounded-xl border border-slate-200 p-3 text-sm dark:border-zinc-700">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-slate-900 dark:text-white break-words">{e.message}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                    {e.count}× · {(e.platforms || []).join(", ")} · {e.kind} · last {when(e.lastSeenAt)} · first {when(e.firstSeenAt)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400 break-all">
                    Last on {e.last?.path || "?"} ({e.last?.platform || "?"}
                    {e.last?.appVersion ? ` ${e.last.appVersion}` : ""})
                  </p>
                </div>
                <button
                  onClick={() => clear(e.id)}
                  disabled={busyId === e.id}
                  className="shrink-0 rounded-lg border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-100 disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
                >
                  Clear
                </button>
              </div>
              {(e.last?.stack || e.last?.userAgent) && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs text-slate-600 dark:text-zinc-300">Details</summary>
                  {e.last?.stack && (
                    <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap break-all rounded bg-slate-100 p-2 text-[11px] dark:bg-zinc-800">
                      {e.last.stack}
                    </pre>
                  )}
                  {e.last?.userAgent && (
                    <p className="mt-2 text-[11px] text-slate-500 dark:text-zinc-400 break-all">{e.last.userAgent}</p>
                  )}
                  {e.last?.digest && (
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-zinc-400">Server digest: {e.last.digest}</p>
                  )}
                </details>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
