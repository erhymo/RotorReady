"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { loadAllQuestions } from "@/lib/loadAllQuestions";

const SECTION = "ENGINE, FUEL, LUBRICANTS, HYDRAULICS & SYSTEM LIMITATIONS";

function sample<T>(arr: T[], n: number) {
  const copy = [...arr];
  const out: T[] = [];
  while (copy.length && out.length < n) {
    const i = Math.floor(Math.random()*copy.length);
    out.push(copy.splice(i,1)[0]);
  }
  return out;
}

export default function EngineSystemsStart() {
  const router = useRouter();
  const [amount, setAmount] = React.useState(20);
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  async function getData() {
    const items = await loadAllQuestions();
    // Filtrer spørsmål for denne seksjonen: kun de med "eng syst" i section (case-insensitiv, robust)
    const filtered = items.filter((q: any) =>
      (q.section || "").toLowerCase().replace(/[^a-z]/g, "").includes("engsyst")
    );
    return { items: filtered };
  }

  async function startQuiz() {
    setLoading(true); setErr(null);
    try {
      const data = await getData();
      if (!data.items.length) {
        setErr("Fant ingen spørsmål merket 'eng syst'.");
        setLoading(false);
        return;
      }
      const items = sample(data.items, Math.min(amount, data.items.length));
      const session = {
        section: SECTION,
        createdAt: new Date().toISOString(),
        items,
        answers: Array(items.length).fill(null),
        flags: Array(items.length).fill(false)
      };
      sessionStorage.setItem("engineq_session", JSON.stringify(session));
      router.push("/engine-systems-quiz/1");
    } catch(e:any) {
      setErr(e?.message || "Kunne ikke starte quiz");
    } finally {
      setLoading(false);
    }
  }

  function startWrongOnly() {
    const raw = localStorage.getItem("rr_progress_last_wrong:engine-systems");
    if (!raw) { alert("Ingen feilsett tilgjengelig. Fullfør en quiz først."); return; }
    const data = JSON.parse(raw);
    sessionStorage.setItem("engineq_session", JSON.stringify(data));
    router.push("/engine-systems-quiz/1");
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Engine, Fuel, Lubricants, Hydraulics & System Limitations</h1>
      <p className="text-lg text-slate-700 dark:text-zinc-100 mt-2">Velg antall spørsmål og start.</p>

      <div className="rounded-xl border-l-4 border-blue-600 bg-blue-50/40 dark:border-blue-400 dark:bg-blue-900/40 p-4 flex flex-col sm:flex-row items-center gap-3">
        <label className="text-sm text-gray-700 dark:text-zinc-100">Antall:</label>
        <select className="border rounded px-3 py-2 dark:bg-blue-900 dark:text-zinc-100 dark:border-blue-400"
                value={amount} onChange={e=>setAmount(parseInt(e.target.value))}>
          {[10,20,30,40,50].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <button onClick={startQuiz} disabled={loading}
          className="w-full sm:w-auto ml-auto px-4 py-2 rounded-lg bg-blue-600 text-white active:scale-95">
          {loading ? "Starter…" : "Start"}
        </button>
      </div>
      {err && <p className="text-red-600 text-sm">{err}</p>}
      <div className="rounded-xl border-l-4 border-emerald-600 bg-emerald-50/40 dark:border-emerald-400 dark:bg-emerald-900/40 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-slate-900 dark:text-white">Øv kun på feil</div>
            <div className="text-sm text-gray-600 dark:text-white">Bygger et sett av spørsmålene du nylig hadde feil.</div>
          </div>
          <button onClick={startWrongOnly} className="px-4 py-2 rounded-lg bg-emerald-600 text-white">Start</button>
        </div>
      </div>
    </div>
  );
}
