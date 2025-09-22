"use client";
import * as React from "react";

type Section = { id: string; title: string };
type Initial = {
  sections: Section[];
  flags: any;
  messages: any;
};

async function getSectionJson(id: string) {
  const res = await fetch(`/api/admin/sections/${encodeURIComponent(id)}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export default function AdminPanel({ initial }: { initial: Initial }) {
  const [sectionId, setSectionId] = React.useState<string>(initial.sections?.[0]?.id ?? "");
  const [sectionText, setSectionText] = React.useState<string>("");
  const [flagsText, setFlagsText] = React.useState<string>(JSON.stringify(initial.flags ?? { flags: [] }, null, 2));
  const [messagesText, setMessagesText] = React.useState<string>(JSON.stringify(initial.messages ?? { messages: [] }, null, 2));
  const [loading, setLoading] = React.useState(false);
  const [msg, setMsg] = React.useState<string>("");

  async function loadSection() {
    if (!sectionId) return;
    setMsg("");
    setLoading(true);
    try {
      const json = await getSectionJson(sectionId);
      setSectionText(JSON.stringify(json, null, 2));
    } catch (e: any) {
      setMsg(`Kunne ikke laste seksjon: ${e?.message || e}`);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    // auto-load first section
    if (sectionId) loadSection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionId]);

  async function saveSection() {
    setMsg("");
    try {
      const payload = JSON.parse(sectionText);
      const res = await fetch(`/api/admin/sections/${encodeURIComponent(sectionId)}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || `HTTP ${res.status}`);
      }
      setMsg("✅ Seksjon lagret.");
    } catch (e: any) {
      setMsg(`❌ Feil ved lagring av seksjon: ${e?.message || e}`);
    }
  }

  async function saveFlags() {
    setMsg("");
    try {
      const payload = JSON.parse(flagsText);
      const res = await fetch(`/api/admin/flags`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setMsg("✅ Flags lagret.");
    } catch (e: any) {
      setMsg(`❌ Feil ved lagring av flags: ${e?.message || e}`);
    }
  }

  async function saveMessages() {
    setMsg("");
    try {
      const payload = JSON.parse(messagesText);
      const res = await fetch(`/api/admin/messages`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setMsg("✅ Meldinger lagret.");
    } catch (e: any) {
      setMsg(`❌ Feil ved lagring av meldinger: ${e?.message || e}`);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl p-4 shadow">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Seksjoner</h2>
          <div className="text-sm text-slate-500">{loading ? "Laster…" : ""}</div>
        </div>
        <div className="flex gap-2 mb-3">
          <select
            className="border rounded px-2 py-1"
            value={sectionId}
            onChange={e => setSectionId(e.target.value)}
          >
            {initial.sections?.map(s => (
              <option key={s.id} value={s.id}>{s.title} ({s.id})</option>
            ))}
          </select>
          <button className="px-3 py-1 rounded bg-slate-200 hover:bg-slate-300" onClick={loadSection}>Reload</button>
          <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={saveSection}>Save</button>
        </div>
        <textarea
          className="w-full h-80 border rounded p-2 font-mono text-sm"
          value={sectionText}
          onChange={e => setSectionText(e.target.value)}
          placeholder='{"items": [...]}'
        />
        <p className="text-xs text-slate-500 mt-2">Schema valideres server-side. Feil vises her.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl p-4 shadow">
          <h2 className="font-semibold mb-2">Flaggede spørsmål</h2>
          <div className="flex gap-2 mb-2">
            <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={saveFlags}>Save</button>
          </div>
          <textarea
            className="w-full h-36 border rounded p-2 font-mono text-sm"
            value={flagsText}
            onChange={e => setFlagsText(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-xl p-4 shadow">
          <h2 className="font-semibold mb-2">Kontaktmeldinger</h2>
          <div className="flex gap-2 mb-2">
            <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={saveMessages}>Save</button>
          </div>
          <textarea
            className="w-full h-36 border rounded p-2 font-mono text-sm"
            value={messagesText}
            onChange={e => setMessagesText(e.target.value)}
          />
        </div>

        {msg && <div className="text-sm mt-2">{msg}</div>}
        <form action="/api/auth/logout" method="post">
          <button className="rounded bg-gray-800 text-white px-4 py-2">Logg ut</button>
        </form>
      </div>
    </div>
  );
}

