"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { saveResult } from "@/lib/sync/results";

type Item = { id: string; question: string; options: string[]; answer: number[]; explanation?: string; references?: string[]; section?: string };
type Session = { section: string; createdAt: string; items: Item[]; answers: Array<number|null>; flags: boolean[] };

function loadSession(): Session | null {
  try { const raw = sessionStorage.getItem("limq_session"); return raw ? JSON.parse(raw) as Session : null; }
  catch { return null; }
}

export default function ResultPage() {
  const [s, setS] = useState<Session | null>(null);

  useEffect(() => { setS(loadSession()); }, []);

  const { total, correct, wrongIdx } = useMemo(() => {
    if (!s) return { total: 0, correct: 0, wrongIdx: [] as number[] };
    const total = s.items.length;
    let correct = 0;
    const wrongIdx: number[] = [];
    s.items.forEach((it, i) => {
      const picked = s.answers[i];
      const ok = picked != null && it.answer.includes(picked);
      if (ok) correct++; else wrongIdx.push(i);
    });
    return { total, correct, wrongIdx };
  }, [s]);

  useEffect(() => {
    if (!s) return;
    const percent = total ? (correct/total)*100 : 0;
    const rec = { section: s.section, total, correct, percent, at: new Date().toISOString() };
    const raw = localStorage.getItem("rr_progress");
    const arr = raw ? JSON.parse(raw) : [];
    arr.push(rec);
    localStorage.setItem("rr_progress", JSON.stringify(arr));

    if (wrongIdx.length) {
      const items = wrongIdx.map(i => s.items[i]);
      const answers = wrongIdx.map(() => null as number | null);
      const flags = wrongIdx.map(() => false);
      const wrongSession: Session = {
        section: s.section,
        createdAt: new Date().toISOString(),
        items, answers, flags
      };
      localStorage.setItem(`rr_progress_last_wrong:${s.section}`, JSON.stringify(wrongSession));
    } else {
      localStorage.removeItem(`rr_progress_last_wrong:${s.section}`);
    }

    // cloud sync (best effort)
    try {
      saveResult({ section: s.section, total, correct, percent, at: new Date().toISOString() });
    } catch {}
  }, [s, total, correct, wrongIdx]);

  if (!s) return <div className="max-w-xl mx-auto p-4">Ingen aktiv sesjon.</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Resultat</h1>
      <div className="bg-white dark:bg-zinc-900 dark:border-zinc-700 border rounded-xl p-4">
        <div>Besvarte: <b>{total}</b></div>
        <div>Riktige: <b>{correct}</b></div>
        <div>Prosent: <b>{Math.round((correct/total)*100)}%</b></div>
      </div>

      <div className="flex gap-2">
        <Link href="/limitations-quiz" className="px-4 py-2 rounded-lg bg-gray-900 text-white">Ta på nytt</Link>
        <Link href="/" className="px-4 py-2 rounded-lg border bg-white dark:bg-zinc-900">Forside</Link>
      </div>

      <div className="bg-white dark:bg-zinc-900 dark:border-zinc-700 border rounded-xl p-4">
        <div className="font-semibold mb-2">Neste steg</div>
        <ul className="list-disc ml-5 text-sm">
          <li>Gå til <b>Limitations</b> og trykk <b>“Øv kun på feil”</b> for målrettet trening.</li>
          <li>Se progresjon under <b>Min side</b> (30-dagers oversikt kommer i sync-versjonen).</li>
        </ul>
      </div>
    </div>
  );
}
