"use client";

import { useState } from "react";

type PreviewResult = {
  total: number;
  keys: number;
  duplicateGroups: number;
  toDelete: number;
  deleted: number;
};

export default function DedupeControls() {
  const [result, setResult] = useState<PreviewResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function preview() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/flags/dedupe");
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      setResult(data);
    } catch (e: any) {
      setError(e?.message || "Preview failed");
    } finally {
      setBusy(false);
    }
  }

  async function run() {
    if (!result?.toDelete) return;
    if (!window.confirm(`Delete ${result.toDelete} duplicate flag(s)? This cannot be undone.`)) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/flags/dedupe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      setResult(data);
    } catch (e: any) {
      setError(e?.message || "Dedupe failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button onClick={preview} disabled={busy} className="px-3 py-2 rounded border text-sm disabled:opacity-50">
        {busy ? "Working…" : "Preview flag dedupe"}
      </button>
      {result && (
        <>
          <span className="text-xs text-gray-600 dark:text-zinc-300">
            {result.total} flags, {result.duplicateGroups} duplicate group(s), {result.toDelete} to delete
            {result.deleted ? `, ${result.deleted} deleted` : ""}
          </span>
          {result.toDelete > 0 && result.deleted === 0 && (
            <button
              onClick={run}
              disabled={busy}
              className="px-3 py-2 rounded border text-sm text-red-700 dark:text-red-400 disabled:opacity-50"
            >
              Run flag dedupe (delete {result.toDelete})
            </button>
          )}
        </>
      )}
      {error && <span className="text-xs text-red-700 dark:text-red-400">{error}</span>}
    </div>
  );
}
