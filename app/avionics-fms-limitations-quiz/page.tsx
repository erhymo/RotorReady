"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { useActiveModelVariant } from "@/lib/models/hooks";
import { modelScopedKey } from "@/lib/models/storage";
import { isLoggedInAsync } from "@/lib/auth";
import { buildInitialQuizResumeSession, buildQuizResumeSession, clearQuizResumeSnapshot, findLatestQuizResumeInfo, getQuizResumeStorageKey, readQuizResumeSnapshot, writeQuizResumeSnapshot } from "@/lib/quiz/resumeSnapshot";

import TopBarBackButton from "@/components/TopBarBackButton";

const SECTION = "Avionics & FMS Limitations" as const;
const SECTION_ID = "avionics-fms-limitations" as const;
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
  const [resumeInfo, setResumeInfo] = React.useState<{
    amountToken: string;
    idx: number;
    total: number;
  } | null>(null);
  const [totalCount, setTotalCount] = React.useState<number|null>(null);
  const [totalLoading, setTotalLoading] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    setTotalLoading(true);
    (async () => {
      try {
        const data = await getData();
        if (!cancelled) setTotalCount((data?.items || []).length);
      } catch {
        if (!cancelled) setTotalCount(0);
      } finally {
        if (!cancelled) setTotalLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [activeVariant.id]);

  React.useEffect(() => {
    let cancelled = false;
    const latestResume = findLatestQuizResumeInfo(activeVariant.id, SECTION_ID);
    if (!cancelled) setResumeInfo(latestResume);
    return () => { cancelled = true; };
  }, [activeVariant.id]);


  async function getData(): Promise<{ items: QuizItem[] }> {
    // Fetch blocked (soft-deleted) questions and filter them out
    let blocked = new Set<string>();
    try {
      const r = await fetch('/api/blocked-questions', { cache: 'no-store' });
      if (r.ok) { const j = await r.json(); blocked = new Set<string>(Array.isArray(j?.ids) ? j.ids : []); }
    } catch {}

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
        const filtered = (payload.items as QuizItem[])
          .filter((item) => matchesVariant(item, activeVariant.id, activeVariant.productId))
          .filter((item) => item && !blocked.has(item.id));
        if (!filtered.length) continue;
        return { items: filtered };
      } catch (error) {
        console.warn("Could not load", url, error);
      }
    }
    throw new Error("Found no questions for Avionics & FMS");
  }

  async function startQuiz() {
    setLoading(true);
    setErr(null);
    try {
      const loggedIn = await isLoggedInAsync();
      if (!loggedIn) { router.push(`/paywall?from=${encodeURIComponent('/avionics-fms-limitations-quiz')}`); return; }
      const data = await getData();
      if (!data.items.length) {
        setErr("Found no questions in this section.");
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

      const amountToken = amount === "all" ? "all" : String(amount);

      const session = {
        section: SECTION,
        ...buildInitialQuizResumeSession(randomized, amountToken),
      };
      sessionStorage.setItem("avionics_session", JSON.stringify(session));

      writeQuizResumeSnapshot({
        section: SECTION_ID,
        variantId: activeVariant.id,
        amountToken,
        items: randomized,
        idx: 0,
        answers: Array(randomized.length).fill(undefined),
        flags: Array(randomized.length).fill(false),
      });

      router.push("/avionics-fms-limitations-quiz/1");
    } catch (error: any) {
      setErr(error?.message || "Could not start quiz");
    } finally {
      setLoading(false);
    }
  }

  async function startWrongOnly() {
    const loggedIn = await isLoggedInAsync();
    if (!loggedIn) { router.push(`/paywall?from=${encodeURIComponent('/avionics-fms-limitations-quiz')}`); return; }
    const key = `${modelScopedKey("rr_progress_last_wrong", activeVariant.id)}:avionics-fms-limitations`;
    const raw =
      localStorage.getItem(key) ||
      (activeVariant.id === "AW169" ? localStorage.getItem("rr_progress_last_wrong:avionics-fms-limitations") : null);
    if (!raw) {
      alert("No wrong-answer set available. Complete a quiz first.");
      return;
    }
    try {
      const data = JSON.parse(raw);
      sessionStorage.setItem("avionics_session", JSON.stringify(data));
      router.push("/avionics-fms-limitations-quiz/1");
    } catch {
      alert("Could not load saved wrong-answer set. Delete and try again.");
      localStorage.removeItem(key);
      if (activeVariant.id === "AW169") {
        localStorage.removeItem("rr_progress_last_wrong:avionics-fms-limitations");
      }
    }
  }

  async function handleResumeContinue() {
    if (!resumeInfo) return;
    try {
      const loggedIn = await isLoggedInAsync();
      if (!loggedIn) {
        router.push(`/paywall?from=${encodeURIComponent('/avionics-fms-limitations-quiz')}`);
        return;
      }
      const snap = readQuizResumeSnapshot<QuizItem>(activeVariant.id, SECTION_ID, resumeInfo.amountToken);
      if (!snap) return;
      const session = {
        section: SECTION,
        ...buildQuizResumeSession(snap),
      };
      sessionStorage.setItem("avionics_session", JSON.stringify(session));
      router.push(`/avionics-fms-limitations-quiz/${snap.idx + 1}`);
    } catch {}
  }

  function handleResumeReset() {
    if (!resumeInfo) return;
    try {
      clearQuizResumeSnapshot(activeVariant.id, SECTION_ID, resumeInfo.amountToken);
    } catch {}
    setResumeInfo(null);
  }


  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <div className="w-full flex items-center py-1">
        <TopBarBackButton href="/quiz" />
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{SECTION}</h1>
      <p className="text-lg text-slate-700 dark:text-zinc-100 mt-2">Choose number of questions and start.</p>

      <div className="rounded-xl border-l-4 border-blue-600 bg-blue-50/40 dark:border-blue-400 dark:bg-blue-900/40 p-4 flex items-center gap-3">
        <label className="text-sm text-gray-700 dark:text-zinc-100">Count:</label>
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
              {option === "all" ? "All" : option}
            </option>
          ))}
        </select>
        <span className="ml-auto mr-2 text-xs text-gray-600 dark:text-zinc-300">
          {totalLoading ? "…" : (totalCount != null ? `${totalCount} total` : "")}
        </span>
        <button
          onClick={startQuiz}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white active:scale-95 disabled:opacity-60"
        >
          {loading ? "Starting…" : "Start"}
        </button>
      </div>

	      {resumeInfo && (
	        <div className="rounded-xl border-l-4 border-emerald-600 bg-emerald-50/40 dark:border-emerald-400 dark:bg-emerald-900/40 p-4 flex items-center gap-3">
	          <div className="flex-1">
	            <div className="font-semibold text-slate-900 dark:text-white">Resume session</div>
	            <div className="text-sm text-gray-600 dark:text-zinc-100">
	              You are on question {resumeInfo.idx + 1} of {resumeInfo.total} ({String(resumeInfo.amountToken)}).
	            </div>
	          </div>
	          <button
	            onClick={handleResumeContinue}
	            className="px-3 py-2 rounded-lg bg-emerald-600 text-white"
	          >
	            Continue
	          </button>
	          <button
	            onClick={handleResumeReset}
	            className="px-3 py-2 rounded-lg bg-slate-200 dark:bg-zinc-700 dark:text-white"
	          >
	            Start over
	          </button>
	        </div>
	      )}

      {err && <p className="text-red-600 text-sm dark:text-red-400">{err}</p>}
      <div className="rounded-xl border-l-4 border-emerald-600 bg-emerald-50/40 dark:border-emerald-400 dark:bg-emerald-900/40 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="font-semibold text-slate-900 dark:text-white">Practice wrong answers only</div>
            <div className="text-sm text-gray-600 dark:text-zinc-100">Builds a set of questions you recently got wrong.</div>
          </div>
          <button onClick={startWrongOnly} className="px-4 py-2 rounded-lg bg-emerald-600 text-white dark:bg-emerald-500">Start</button>
        </div>
      </div>
    </div>
  );
}
