"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { loadAllQuestions } from "@/lib/loadAllQuestions";
import { useActiveModelVariant } from "@/lib/models/hooks";
import { modelScopedKey } from "@/lib/models/storage";
import { isLoggedInAsync } from "@/lib/auth";

import TopBarBackButton from "@/components/TopBarBackButton";

const SECTION = "ENGINE, FUEL, LUBRICANTS, HYDRAULICS & SYSTEM LIMITATIONS";

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

function signature(items: any[]) { return items.map((it:any) => it.id).join(","); }

function shuffleOptionsForItem<T extends { options?: string[]; answer?: number[] }>(it: T): T {
  if (!Array.isArray((it as any).options) || !Array.isArray((it as any).answer)) return it;
  const idx = (it as any).options.map((_: any, i: number) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  const options = idx.map((i: number) => (it as any).options[i]);
  const answer = (it as any).answer.map((a: number) => idx.indexOf(a)).filter((n: number) => n >= 0).sort((a:number,b:number)=>a-b);
  return { ...(it as any), options, answer } as T;
}


export default function EngineSystemsStart() {
  const router = useRouter();
  const [amount, setAmount] = React.useState<AmountOption>(20);
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);
  const { variant: activeVariant } = useActiveModelVariant();

  async function getData() {
    const items = await loadAllQuestions(activeVariant.id);
    // Filtrer spørsmål for denne seksjonen: kun de med "eng syst" i section (case-insensitiv, robust)
    const filtered = items.filter((q: any) =>
      (q.section || "").toLowerCase().replace(/[^a-z]/g, "").includes("engsyst")
    );
    return { items: filtered };
  }

  async function startQuiz() {
    setLoading(true); setErr(null);
    try {
      const loggedIn = await isLoggedInAsync();
      if (!loggedIn) { router.push(`/paywall?from=${encodeURIComponent('/engine-systems-quiz')}`); return; }
      const data = await getData();
      if (!data.items.length) {
        setErr("No questions tagged 'eng syst' found.");
        setLoading(false);
        return;
      }
      const base = amount === "all"
        ? shuffle(data.items)
        : sample(data.items, Math.min(amount, data.items.length));

      const key = `quiz:lastOrders:${activeVariant.id}:${SECTION}:${amount === "all" ? "all" : amount}`;
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
        section: SECTION,
        createdAt: new Date().toISOString(),
        items: randomized,
        answers: Array(randomized.length).fill(null),
        flags: Array(randomized.length).fill(false)
      };
      sessionStorage.setItem("engineq_session", JSON.stringify(session));
      router.push("/engine-systems-quiz/1");
    } catch(e:any) {
      setErr(e?.message || "Could not start quiz");
    } finally {
      setLoading(false);
    }
  }

  async function startWrongOnly() {
    const loggedIn = await isLoggedInAsync();
    if (!loggedIn) { router.push(`/paywall?from=${encodeURIComponent('/engine-systems-quiz')}`); return; }
    const key = `${modelScopedKey("rr_progress_last_wrong", activeVariant.id)}:engine-systems`;
    const raw = localStorage.getItem(key) || (activeVariant.id === "AW169" ? localStorage.getItem("rr_progress_last_wrong:engine-systems") : null);
    if (!raw) { alert("No wrong-answer set available. Complete a quiz first."); return; }
    const data = JSON.parse(raw);
    sessionStorage.setItem("engineq_session", JSON.stringify(data));
    router.push("/engine-systems-quiz/1");
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <div className="w-full flex items-center py-1">
        <TopBarBackButton href="/quiz" />
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Engine, Fuel, Lubricants, Hydraulics & System Limitations</h1>
      <p className="text-lg text-slate-700 dark:text-zinc-100 mt-2">Choose number of questions and start.</p>

      <div className="rounded-xl border-l-4 border-blue-600 bg-blue-50/40 dark:border-blue-400 dark:bg-blue-900/40 p-4 flex flex-col sm:flex-row items-center gap-3">
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
          className="w-full sm:w-auto ml-auto px-4 py-2 rounded-lg bg-blue-600 text-white active:scale-95">
          {loading ? "Starting…" : "Start"}
        </button>
      </div>
      {err && <p className="text-red-600 text-sm">{err}</p>}
      <div className="rounded-xl border-l-4 border-emerald-600 bg-emerald-50/40 dark:border-emerald-400 dark:bg-emerald-900/40 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-slate-900 dark:text-white">Practice wrong answers only</div>
            <div className="text-sm text-gray-600 dark:text-white">Builds a set of questions you recently got wrong.</div>
          </div>
          <button onClick={startWrongOnly} className="px-4 py-2 rounded-lg bg-emerald-600 text-white">Start</button>
        </div>
      </div>
    </div>
  );
}
