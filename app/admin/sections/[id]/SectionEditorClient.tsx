"use client";

import { useState } from "react";

export default function SectionEditorClient({ id, initialText }: { id: string; initialText: string }) {
  const [text, setText] = useState(initialText);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      const parsed = JSON.parse(text);
      const res = await fetch(`/api/admin/sections/${encodeURIComponent(id)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ? `${data.error}: ${JSON.stringify(data.details || "")}` : `HTTP ${res.status}`);
      setMessage({ kind: "ok", text: "Saved." });
    } catch (e: any) {
      setMessage({ kind: "error", text: e?.message || "Invalid JSON or save failed" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-3">
      {message && (
        <div
          className={`px-3 py-2 rounded text-sm border ${
            message.kind === "ok"
              ? "bg-emerald-50 border-emerald-300 text-emerald-800"
              : "bg-red-50 border-red-300 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
        className="w-full h-[60vh] font-mono text-xs border rounded-lg p-3 dark:bg-zinc-800 dark:border-zinc-700"
      />
      <button
        onClick={save}
        disabled={saving}
        className="px-4 py-2 rounded bg-blue-600 text-white text-sm font-semibold disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save"}
      </button>
    </div>
  );
}
