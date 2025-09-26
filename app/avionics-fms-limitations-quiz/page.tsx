"use client";
import * as React from "react";
import { useRouter } from "next/navigation";

const SECTION = "Avionics & FMS Limitations" as const;
const DATA_URL = "/quiz-data/sections/avionics_fms_limitations.json" as const;

type QuizItem = {
  id: string;
  section: string;
  type: "single" | "multi";
  question: string;
  options: string[];
  answer: number[];
  explanation?: string;
  references?: string[];
};

function sample<T>(arr: T[], n: number) {
  const copy = [...arr];
  const out: T[] = [];
  while (copy.length && out.length < n) {
    const i = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(i, 1)[0]);
  }
  return out;
}

export default function AvionicsFmsQuizStart() {
  const router = useRouter();
  const [amount, setAmount] = React.useState(20);
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  async function getData(): Promise<{ items: QuizItem[] }> {
    const res = await fetch(DATA_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("Fant ikke spørsmål for Avionics & FMS");
    const payload = await res.json();
    if (!payload.items || !Array.isArray(payload.items)) {
      throw new Error("Ugyldig datastruktur for Avionics & FMS");
    }
    return { items: payload.items as QuizItem[] };
  }

  async function startQuiz() {
    setLoading(true);
    setErr(null);
    try {
      const data = await getData();
      if (!data.items.length) {
        setErr("Fant ingen spørsmål i denne seksjonen.");
        setLoading(false);
        return;
      }
      const items = sample(data.items, Math.min(amount, data.items.length));
      const session = {
        section: SECTION,
        createdAt: new Date().toISOString(),
        items,
        answers: Array(items.length).fill(null) as Array<number | null>,
        flags: Array(items.length).fill(false) as boolean[],
      };
      sessionStorage.setItem("avionics_session", JSON.stringify(session));
      router.push("/avionics-fms-limitations-quiz/1");
    } catch (error: any) {
      setErr(error?.message || "Kunne ikke starte quiz");
    } finally {
      setLoading(false);
    }
  }

  function startWrongOnly() {
    const raw = localStorage.getItem("rr_progress_last_wrong:avionics-fms-limitations");
    if (!raw) {
      alert("Ingen feilsett tilgjengelig. Fullfør en quiz først.");
      return;
    }
    try {
      const data = JSON.parse(raw);
      sessionStorage.setItem("avionics_session", JSON.stringify(data));
      router.push("/avionics-fms-limitations-quiz/1");
    } catch {
      alert("Kunne ikke laste lagret feilsett. Slett og prøv igjen.");
      localStorage.removeItem("rr_progress_last_wrong:avionics-fms-limitations");
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{SECTION}</h1>
      <p className="text-lg text-slate-700 dark:text-zinc-100 mt-2">Velg antall spørsmål og start.</p>

      <div className="rounded-xl border-l-4 border-blue-600 bg-blue-50/40 dark:border-blue-400 dark:bg-blue-900/40 p-4 flex flex-col sm:flex-row items-center gap-3">
        <label className="text-sm text-gray-700 dark:text-zinc-100">Antall:</label>
        <select
          className="border rounded px-3 py-2 dark:bg-blue-900 dark:text-zinc-100 dark:border-blue-400"
          value={amount}
          onChange={(event) => setAmount(parseInt(event.target.value, 10))}
        >
          {[10, 20, 30, 40, 50].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <button
          onClick={startQuiz}
          disabled={loading}
          className="w-full sm:w-auto ml-auto px-4 py-2 rounded-lg bg-blue-600 text-white active:scale-95 disabled:opacity-60"
        >
          {loading ? "Starter…" : "Start"}
        </button>
      </div>
      {err && <p className="text-red-600 text-sm dark:text-red-400">{err}</p>}
      <div className="rounded-xl border-l-4 border-emerald-600 bg-emerald-50/40 dark:border-emerald-400 dark:bg-emerald-900/40 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="font-semibold text-slate-900 dark:text-white">Øv kun på feil</div>
            <div className="text-sm text-gray-600 dark:text-zinc-100">Bygger et sett av spørsmålene du nylig hadde feil.</div>
          </div>
          <button onClick={startWrongOnly} className="px-4 py-2 rounded-lg bg-emerald-600 text-white dark:bg-emerald-500">Start</button>
        </div>
      </div>
    </div>
  );
}
