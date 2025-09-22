"use client";
import { useEffect, useState } from "react";

type QItem = { id: string; section: string; type: string; question: string; options: string[]; answer: number[]; explanation?: string; references?: string[]; };
type SectionFile = { items: QItem[] };

export default function QRHPublishPage() {
  const [current, setCurrent] = useState<SectionFile | null>(null);
  const [incoming, setIncoming] = useState<SectionFile | null>(null);
  const [ver, setVer] = useState<{ qrhVersion?: string }|null>(null);
  const [newVer, setNewVer] = useState("");
  const [diff, setDiff] = useState<{ add: number; remove: number; update: number } | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/quiz-data/sections/qrh.json").then(r=>r.json()).then(setCurrent).catch(()=>{});
    fetch("/quiz-data/versions/data-version.json").then(r=>r.json()).then(setVer).catch(()=>{});
  }, []);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(String(reader.result));
        setIncoming(json);
        computeDiff(json);
        setMsg("");
      } catch { setMsg("Ugyldig JSON"); }
    };
    reader.readAsText(f);
  }

  function computeDiff(next: SectionFile) {
    if (!current) return;
    const curMap = new Map(current.items.map(i => [i.id, i]));
    const nextMap = new Map(next.items.map(i => [i.id, i]));
    let add = 0, remove = 0, update = 0;
    next.items.forEach(n => {
      const c = curMap.get(n.id);
      if (!c) add++;
      else if (JSON.stringify(c) !== JSON.stringify(n)) update++;
    });
    current.items.forEach(c => { if (!nextMap.has(c.id)) remove++; });
    setDiff({ add, remove, update });
  }

  async function apply() {
    if (!incoming || !newVer) { setMsg("Velg fil og skriv inn ny versjon"); return; }
    const res = await fetch("/api/admin/qrh/publish", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ version: newVer, section: incoming })
    });
    const data = await res.json();
    if (res.ok) setMsg(`OK: ${data.summary}`);
    else setMsg(data.error || "Feil ved publisering");
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">QRH Publish</h1>
      <p className="text-sm text-gray-600">Nåværende versjon: <b>{ver?.qrhVersion || "ukjent"}</b></p>

      <div className="bg-white dark:bg-zinc-900 dark:border-zinc-700 border rounded-xl p-4 space-y-3">
        <input type="file" accept="application/json" onChange={onFile} />
        <div className="flex items-center gap-2">
          <label className="text-sm">Ny versjon:</label>
          <input className="border rounded px-2 py-1 dark:bg-zinc-900 dark:border-zinc-700" value={newVer} onChange={e=>setNewVer(e.target.value)} placeholder="f.eks. QRH v4.0" />
          <button onClick={apply} className="px-3 py-2 rounded bg-blue-600 text-white">Publiser</button>
        </div>
        {diff && (
          <div className="text-sm">
            Diff: <b>+{diff.add}</b> lagt til, <b>-{diff.remove}</b> fjernet, <b>~{diff.update}</b> oppdatert.
          </div>
        )}
        {msg && <p className="text-sm mt-1">{msg}</p>}
      </div>
    </div>
  );
}

