"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { useActiveModelVariant } from "@/lib/models/hooks";
import { modelScopedKey } from "@/lib/models/storage";

import TopBarBackButton from "@/components/TopBarBackButton";

const SECTION = "Avionics & FMS Limitations" as const;
const DATA_URL = "/quiz-data/sections/avionics_fms_limitations.json" as const;
const AMOUNT_OPTIONS = [10, 20, 30, 40, 50, "all"] as const;

type AmountOption = (typeof AMOUNT_OPTIONS)[number];

type QuizItem = {
  id: string;
  section?: string;
  type: "single" | "multi";
  question: string;
  options: string[];
  answer: number[];
  explanation?: string;
  references?: string[];
  modelIds?: string[];
  models?: string[];
  productIds?: string[];
  productId?: string;
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

function shuffle<T>(arr: T[]) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function matchesVariant(item: QuizItem, variantId: string, productId: string): boolean {
  if (Array.isArray(item.modelIds)) {
    return item.modelIds.includes(variantId);
  }
  if (Array.isArray(item.models)) {
    return item.models.includes(variantId);
  }
  if (Array.isArray(item.productIds)) {
    return item.productIds.includes(productId);
  }
  if (typeof item.productId === "string") {
    return item.productId === productId;
  }
  return productId === "AW169";
}

export default function AvionicsFmsQuizStart() {
  const router = useRouter();
  const [amount, setAmount] = React.useState<AmountOption>(20);
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);
  const { variant: activeVariant } = useActiveModelVariant();

  async function getData(): Promise<{ items: QuizItem[] }> {
    const urls = [
      `/model-data/${activeVariant.id}/sections/avionics_fms_limitations.json`,
      DATA_URL,
    ];
    for (const url of urls) {
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) continue;
        const payload = await res.json();
        if (!payload.items || !Array.isArray(payload.items)) continue;
        const filtered = (payload.items as QuizItem[]).filter((item) =>
          matchesVariant(item, activeVariant.id, activeVariant.productId),
        );
        if (!filtered.length) continue;
        return { items: filtered };
      } catch (error) {
        console.warn("Kunne ikke laste", url, error);
      }
    }
    throw new Error("Fant ikke spørsmål for Avionics & FMS");
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
      const items = amount === "all"
        ? shuffle(data.items)
        : sample(data.items, Math.min(amount, data.items.length));
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
    const key = `${modelScopedKey("rr_progress_last_wrong", activeVariant.id)}:avionics-fms-limitations`;
    const raw =
      localStorage.getItem(key) ||
      (activeVariant.id === "AW169" ? localStorage.getItem("rr_progress_last_wrong:avionics-fms-limitations") : null);
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
      localStorage.removeItem(key);
      if (activeVariant.id === "AW169") {
        localStorage.removeItem("rr_progress_last_wrong:avionics-fms-limitations");
      }
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <div className="w-full flex items-center py-1">
        <TopBarBackButton href="/quiz" />
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{SECTION}</h1>
      <p className="text-lg text-slate-700 dark:text-zinc-100 mt-2">Velg antall spørsmål og start.</p>

      <div className="rounded-xl border-l-4 border-blue-600 bg-blue-50/40 dark:border-blue-400 dark:bg-blue-900/40 p-4 flex flex-col sm:flex-row items-center gap-3">
        <label className="text-sm text-gray-700 dark:text-zinc-100">Antall:</label>
        <select
          className="border rounded px-3 py-2 dark:bg-blue-900 dark:text-zinc-100 dark:border-blue-400"
          value={amount}
          onChange={(event) => {
            const value = event.target.value === "all" ? "all" : parseInt(event.target.value, 10);
            setAmount(value as AmountOption);
          }}
        >
          {AMOUNT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option === "all" ? "Alle" : option}
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
