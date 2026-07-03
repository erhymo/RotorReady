"use client";

import { useState } from "react";

type Flag = {
  id: string;
  questionId: string;
  section: string;
  userId: string;
  email?: string;
  name?: string;
  createdAt: string;
  status: string;
  reason?: string;
};

export default function FlagsList({ initialFlags }: { initialFlags: Flag[] }) {
  const [flags, setFlags] = useState(initialFlags);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function resolve(id: string, status: "reviewed-OK" | "rejected") {
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch("/api/admin/flags/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      setFlags((prev) => prev.filter((f) => f.id !== id));
    } catch (e: any) {
      setError(e?.message || "Action failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-3">
      <h2 className="font-semibold">Flagged questions — open ({flags.length})</h2>
      {error && <div className="bg-red-50 border border-red-300 text-red-800 px-3 py-2 rounded text-sm">{error}</div>}
      {!flags.length ? (
        <p className="text-gray-600 dark:text-zinc-300">No open flags.</p>
      ) : (
      <ul className="space-y-3">
        {flags.map((f) => (
          <li key={f.id} className="border dark:border-zinc-700 rounded-lg p-3">
            <div className="text-sm">
              <b>ID:</b> {f.questionId} <span className="text-gray-500">[{f.section}]</span>
            </div>
            <div className="text-xs text-gray-600">
              By: {f.name || f.email || f.userId || "unknown"} —{" "}
              {new Date(f.createdAt).toLocaleString("en-GB", {
                timeZone: "Europe/Oslo",
                weekday: "long",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              — status: {f.status}
            </div>
            {f.reason && <div className="text-sm mt-1">{f.reason}</div>}
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => resolve(f.id, "reviewed-OK")}
                disabled={busyId === f.id}
                className="px-3 py-1.5 rounded bg-emerald-600 text-white text-xs disabled:opacity-50"
              >
                Mark reviewed
              </button>
              <button
                onClick={() => resolve(f.id, "rejected")}
                disabled={busyId === f.id}
                className="px-3 py-1.5 rounded border text-xs text-red-700 dark:text-red-400 disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
      )}
    </div>
  );
}
