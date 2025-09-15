"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { incQuota, getQuota, isPaidAsync } from "@/lib/quota";
import { loadAllQuestions } from "@/lib/loadAllQuestions";

type QuizItem = {
  id: string;
  section: string;
  type: "single" | "multi";
  question: string;
  options: string[];
  answer: number[];
  explanation?: string;
  references?: string[];
  tags?: string[];
};

function sample<T>(arr: T[], n: number) {
  const copy = [...arr];
  const out: T[] = [];
  while (copy.length && out.length < n) {
    const i = Math.floor(Math.random()*copy.length);
    out.push(copy.splice(i,1)[0]);
  }
  return out;
}

export default function LimitationsStart() {
  const router = useRouter();
  const [amount, setAmount] = React.useState(20);
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  async function getData(): Promise<{items: QuizItem[]}> {
    // Load and merge all questions from all-questions/
    const items = await loadAllQuestions();
    return { items };
  }

  async function startQuiz() {
    setLoading(true); setErr(null);
    try {
      // Paywall bypass for utvikling/testing
      // const paid = await isPaidAsync();
      // if (!paid) {
      //   const used = getQuota("limitations");
      //   if (used >= 3) { router.push("/paywall?from=/limitations-quiz"); return; }
      // }
      const data = await getData();
      const items = sample<QuizItem>(data.items, amount);
      const session = {
        section: "LIMITATIONS",
        createdAt: new Date().toISOString(),
        items,
        answers: Array(items.length).fill(null) as Array<number|null>,
        flags: Array(items.length).fill(false) as boolean[]
      };
      sessionStorage.setItem("limq_session", JSON.stringify(session));
      // if (!paid) incQuota("limitations");
      router.push("/limitations-quiz/1");
    } catch(e:any) {
      setErr(e?.message || "Kunne ikke starte quiz");
    } finally {
      setLoading(false);
    }
  }

  function startWrongOnly() {
    const raw = localStorage.getItem("rr_progress_last_wrong:limitations");
    if (!raw) { alert("Ingen feilsett tilgjengelig. Fullfør en quiz først."); return; }
    const data = JSON.parse(raw);
    sessionStorage.setItem("limq_session", JSON.stringify(data));
    router.push("/limitations-quiz/1");
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Limitations Quiz</h1>
      <p className="text-gray-600">Velg antall spørsmål og start.</p>

      <div className="bg-white border rounded-xl p-4 flex items-center gap-3">
        <label className="text-sm text-gray-700">Antall:</label>
        <select className="border rounded px-3 py-2"
                value={amount} onChange={e=>setAmount(parseInt(e.target.value))}>
          {[10,20,30,40,50].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <button onClick={startQuiz} disabled={loading}
          className="ml-auto px-4 py-2 rounded-lg bg-gray-900 text-white active:scale-95">
          {loading ? "Starter…" : "Start"}
        </button>
      </div>
      {err && <p className="text-red-600 text-sm">{err}</p>}
      <div className="bg-white dark:bg-zinc-900 dark:border-zinc-700 border rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">Øv kun på feil</div>
            <div className="text-sm text-gray-600 dark:text-zinc-300">Bygger et sett av spørsmålene du nylig hadde feil.</div>
          </div>
          <button onClick={startWrongOnly} className="px-4 py-2 rounded-lg border bg-white dark:bg-zinc-900">Start</button>
        </div>
      </div>

      <p className="text-xs text-gray-500">Tips: Last ned “Limitations” på <a href="/offline" className="underline">Offline</a> (krever kjøp).</p>
    </div>
  );
}
