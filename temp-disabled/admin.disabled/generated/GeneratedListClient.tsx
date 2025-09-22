"use client";
import React, { useTransition, useState } from "react";

export function GeneratedListClient({ items, group, onAction }: {
  items: any[];
  group: string;
  onAction: (id: string, action: "approve"|"reject") => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();
  const [localItems, setLocalItems] = useState(items);
  const [actioning, setActioning] = useState<string|null>(null);

  const filtered = group === "all" ? localItems : localItems.filter((i: any) => i.section === group);

  async function handleAction(id: string, action: "approve"|"reject") {
    setActioning(id+action);
    await onAction(id, action);
    setLocalItems((prev) => prev.filter((q) => q.id !== id));
    setActioning(null);
  }

  return (
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
  );
}
