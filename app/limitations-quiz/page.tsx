"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { incQuota, getQuota, isPaidAsync } from "@/lib/quota";
import { loadAllQuestions } from "@/lib/loadAllQuestions";
import { useActiveModelVariant } from "@/lib/models/hooks";
import { modelScopedKey } from "@/lib/models/storage";

import TopBarBackButton from "@/components/TopBarBackButton";

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

const AMOUNT_OPTIONS = [10, 20, 30, 40, 50, "all"] as const;

type AmountOption = (typeof AMOUNT_OPTIONS)[number];

function sample<T>(arr: T[], n: number) {
  const copy = [...arr];
  const out: T[] = [];
  while (copy.length && out.length < n) {
    const i = Math.floor(Math.random()*copy.length);
    out.push(copy.splice(i,1)[0]);
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

function signature(items: QuizItem[]) { return items.map(it => it.id).join(","); }

function shuffleOptionsForItem(it: QuizItem): QuizItem {
  if (!Array.isArray(it.options) || !Array.isArray(it.answer)) return it;
  const idx = it.options.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  const options = idx.map(i => it.options[i]);
  const answer = it.answer.map(a => idx.indexOf(a)).filter(n => n >= 0).sort((a,b)=>a-b);
  return { ...it, options, answer };
}


export default function LimitationsStart() {
  const router = useRouter();
  const [amount, setAmount] = React.useState<AmountOption>(20);
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);
  const { variant: activeVariant } = useActiveModelVariant();

  async function getData(): Promise<{items: QuizItem[]}> {
    // Load and merge all questions from all-questions/
    const items = await loadAllQuestions(activeVariant.id);
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
      const base = amount === "all"
        ? shuffle<QuizItem>(data.items)
        : sample<QuizItem>(data.items, amount as number);

      const key = `quiz:lastOrders:${activeVariant.id}:limitations:${amount === "all" ? "all" : amount}`;
      let lastOrders: string[] = [];
      try { lastOrders = JSON.parse(sessionStorage.getItem(key) || "[]"); } catch {}
      let items = base;
      if (lastOrders.includes(signature(items))) {
        items = shuffle(items);
      }
      const updated = [...lastOrders, signature(items)].slice(-2);
      try { sessionStorage.setItem(key, JSON.stringify(updated)); } catch {}

      const randomized = items.map(shuffleOptionsForItem);

      const session = {
        section: "limitations",
        createdAt: new Date().toISOString(),
        items: randomized,
        answers: Array(randomized.length).fill(null) as Array<number|null>,
        flags: Array(randomized.length).fill(false) as boolean[]
      };
      sessionStorage.setItem("limq_session", JSON.stringify(session));
      // if (!paid) incQuota("limitations");
      router.push("/limitations-quiz/1");
    } catch(e:any) {
      setErr(e?.message || "Could not start quiz");
    } finally {
      setLoading(false);
    }
  }

  function startWrongOnly() {
    const lowerKey = `${modelScopedKey("rr_progress_last_wrong", activeVariant.id)}:limitations`;
    const upperKey = `${modelScopedKey("rr_progress_last_wrong", activeVariant.id)}:LIMITATIONS`;
    const histKey = `${modelScopedKey("rr_wrong_history", activeVariant.id)}:limitations`;

    // Prefer aggregated last-10 history if present
    const rawHist = localStorage.getItem(histKey);
    let combinedItems: any[] | null = null;
    try {
      const arr = rawHist ? JSON.parse(rawHist) : null;
      if (Array.isArray(arr) && arr.length) {
        const out: Record<string, any> = {};
        for (const sess of arr.slice(-10)) {
          if (Array.isArray(sess?.items)) {
            for (const it of sess.items) {
              if (it?.id && !out[it.id]) out[it.id] = it;
            }
          }
        }
        combinedItems = Object.values(out);
      }
    } catch {}

    const lower = localStorage.getItem(lowerKey) || (activeVariant.id === "AW169" ? localStorage.getItem("rr_progress_last_wrong:limitations") : null);
    const upper = localStorage.getItem(upperKey) || (activeVariant.id === "AW169" ? localStorage.getItem("rr_progress_last_wrong:LIMITATIONS") : null);
    const raw = lower || upper;

    if (!combinedItems && !raw) { alert("No wrong-answer set available. Complete a quiz first."); return; }

    try {
      const data = combinedItems ? { section: "limitations", createdAt: new Date().toISOString(), items: combinedItems, answers: combinedItems.map(() => null), flags: combinedItems.map(() => false) } : JSON.parse(raw!);
      sessionStorage.setItem("limq_session", JSON.stringify(data));
      router.push("/limitations-quiz/1");
    } catch {
      alert("Kunne ikke laste lagret feilsett. Slett og prøv igjen.");
      if (lower) localStorage.removeItem(lowerKey);
      if (upper) localStorage.removeItem(upperKey);
      if (activeVariant.id === "AW169") {
        localStorage.removeItem("rr_progress_last_wrong:limitations");
        localStorage.removeItem("rr_progress_last_wrong:LIMITATIONS");
      }
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <div className="w-full flex items-center py-1">
        <TopBarBackButton href="/quiz" />
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Limitations Quiz</h1>
      <p className="text-lg text-slate-700 dark:text-zinc-100 mt-2">Choose number of questions and start.</p>

      <div className="rounded-xl border-l-4 border-blue-600 bg-blue-50/40 dark:border-blue-400 dark:bg-blue-900/40 p-4 flex items-center gap-3">
        <label className="text-sm text-gray-700 dark:text-zinc-100">Count:</label>
        <select className="border rounded px-3 py-2 dark:bg-blue-900 dark:text-zinc-100 dark:border-blue-400"
                value={amount}
                onChange={e => {
                  const value = e.target.value === "all" ? "all" : parseInt(e.target.value, 10);
                  setAmount(value as AmountOption);
                }}>
          {AMOUNT_OPTIONS.map(option => (
            <option key={option} value={option}>{option === "all" ? "All" : option}</option>
          ))}
        </select>
        <button onClick={startQuiz} disabled={loading}
          className="ml-auto px-4 py-2 rounded-lg bg-blue-600 text-white active:scale-95">
          {loading ? "Starting…" : "Start"}
        </button>
      </div>
      {err && <p className="text-red-600 text-sm">{err}</p>}
      <div className="rounded-xl border-l-4 border-emerald-600 bg-emerald-50/40 dark:border-emerald-400 dark:bg-emerald-900/40 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-slate-900 dark:text-white">Practice wrong answers only</div>
            <div className="text-sm text-gray-600 dark:text-zinc-100">Builds a set of questions you recently got wrong.</div>
          </div>
          <button onClick={startWrongOnly} className="px-4 py-2 rounded-lg bg-emerald-600 text-white">Start</button>
        </div>
      </div>

      <p className="text-xs text-gray-500">Tip: Download “Chapters” on <a href="/offline" className="underline">Offline</a> (requires purchase).</p>
    </div>
  );
}
