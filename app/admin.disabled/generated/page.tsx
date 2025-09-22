"use client";
import React, { useEffect, useState, useTransition } from "react";

const GROUPS = ["all","LIMITATIONS","WARNINGS","PERFORMANCE","QRH"];

export default function GeneratedReview() {
  const [items, setItems] = useState<any[]>([]);
  const [group, setGroup] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [pending, startTransition] = useTransition();
  const [actioning, setActioning] = useState<string|null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const base = "";
      const res = await fetch(base + "/api/admin/generated", { cache: "no-store" });
      const data = await res.json();
      setItems(data?.items || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  async function handleAction(id: string, action: "approve"|"reject") {
    setActioning(id+action);
    await fetch("/api/admin/generated", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action, id })
    });
    setItems((prev) => prev.filter((q) => q.id !== id));
    setActioning(null);
  }

  const filtered = group === "all" ? items : items.filter((i: any) => i.section === group);

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Generated Questions</h1>
      <div className="flex gap-2">
        {GROUPS.map(g => (
          <button
            key={g}
            type="button"
            onClick={() => setGroup(g)}
            className={
              "px-3 py-1 rounded border transition font-medium focus:outline-none " +
              (group===g
                ? "bg-zinc-900 text-white border-zinc-700 shadow dark:bg-white dark:text-zinc-900 dark:border-white"
                : "bg-white text-zinc-900 border-zinc-300 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-700")
            }
          >
            {g}
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-600 dark:text-zinc-300">Approve flytter spørsmålet til <code>/public/quiz-data/sections/qrh.json</code>. Reject sletter fra batchen.</p>
      {loading ? (
        <div className="text-gray-500">Laster…</div>
      ) : (
        <ul className="space-y-4">
          {filtered.map((q: any) => (
            <li key={q.id} className="border rounded-xl p-4 bg-white dark:bg-zinc-900 dark:border-zinc-700">
              <div className="text-xs text-gray-500">ID: {q.id} — Section: <b>{q.section}</b></div>
              <div className="mt-2 font-medium">{q.question}</div>
              <ol className="list-decimal ml-6 mt-2 space-y-1">
                {q.options.map((o: string, i: number) => (
                  <li key={i} className={i===q.answer[0] ? "font-semibold" : ""}>{o}</li>
                ))}
              </ol>
              {q.explanation && <div className="mt-2 text-sm text-gray-700 dark:text-zinc-300">{q.explanation}</div>}
              {q.references?.length ? <div className="text-xs text-gray-500">Refs: {q.references.join(", ")}</div> : null}
              <div className="flex gap-2 mt-3">
                <button
                  className="px-3 py-1 rounded bg-green-600 text-white text-sm disabled:opacity-60"
                  disabled={!!actioning}
                  onClick={() => startTransition(() => handleAction(q.id, "approve"))}
                >
                  {actioning === q.id+"approve" ? "..." : "Approve"}
                </button>
                <button
                  className="px-3 py-1 rounded bg-red-600 text-white text-sm disabled:opacity-60"
                  disabled={!!actioning}
                  onClick={() => startTransition(() => handleAction(q.id, "reject"))}
                >
                  {actioning === q.id+"reject" ? "..." : "Reject"}
                </button>
              </div>
            </li>
          ))}
          {filtered.length === 0 && <p className="text-gray-600">Ingen genererte spørsmål i denne kategorien.</p>}
        </ul>
      )}
    </div>
  );
}
