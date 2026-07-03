"use client";

import { useState } from "react";

type GeneratedItem = {
  id: string;
  question?: string;
  [key: string]: unknown;
};

export default function GeneratedReviewClient({ initialItems }: { initialItems: GeneratedItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function act(id: string, action: "approve" | "reject") {
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch("/api/admin/generated", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, id }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch (e: any) {
      setError(e?.message || "Action failed");
    } finally {
      setBusyId(null);
    }
  }

  if (!items.length) {
    return <p className="text-gray-600 dark:text-zinc-300">No generated questions waiting for review.</p>;
  }

  return (
    <div className="space-y-3">
      {error && <div className="bg-red-50 border border-red-300 text-red-800 px-3 py-2 rounded text-sm">{error}</div>}
      <ul className="space-y-3">
        {items.map((it) => (
          <li key={it.id} className="border dark:border-zinc-700 rounded-lg p-3 space-y-2">
            <div className="text-sm font-medium">{it.question || it.id}</div>
            <pre className="text-xs bg-gray-50 dark:bg-zinc-800 p-2 rounded border overflow-auto max-h-48">{JSON.stringify(it, null, 2)}</pre>
            <div className="flex gap-2">
              <button
                onClick={() => act(it.id, "approve")}
                disabled={busyId === it.id}
                className="px-3 py-1.5 rounded bg-emerald-600 text-white text-sm disabled:opacity-50"
              >
                {busyId === it.id ? "Working…" : "Approve → publish to QRH"}
              </button>
              <button
                onClick={() => act(it.id, "reject")}
                disabled={busyId === it.id}
                className="px-3 py-1.5 rounded border text-sm text-red-700 dark:text-red-400 disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
