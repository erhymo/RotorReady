"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { loadAllQuestions } from "@/lib/loadAllQuestions";
import { loadSectionOffline } from "@/lib/offline";
import { useActiveModelVariant } from "@/lib/models/hooks";
import { modelScopedKey } from "@/lib/models/storage";
import { buildInitialQuizResumeSession, buildQuizResumeSession, clearQuizResumeSnapshot, findLatestQuizResumeInfo, getQuizResumeStorageKey, readQuizResumeSnapshot, writeQuizResumeSnapshot } from "@/lib/quiz/resumeSnapshot";

import TopBarBackButton from "@/components/TopBarBackButton";

const SECTION = "ENGINE, FUEL, LUBRICANTS, HYDRAULICS & SYSTEM LIMITATIONS";
const SECTION_ID = "engine-systems" as const;
const engineSystemsQuestionsPromiseCache = new Map<string, Promise<any[]>>();

function matchesEngineSystemsQuestion(item: { section?: unknown }) {
  return String(item.section || "").toLowerCase().replace(/[^a-z]/g, "").includes("engsyst");
}

async function loadEngineSystemsQuestions(variantId: string): Promise<any[]> {
  const existing = engineSystemsQuestionsPromiseCache.get(variantId);
  if (existing) return existing;

  const promise = loadAllQuestions(variantId)
    .then((items) => items.filter(matchesEngineSystemsQuestion))
    .catch((error) => {
      engineSystemsQuestionsPromiseCache.delete(variantId);
      throw error;
    });

  engineSystemsQuestionsPromiseCache.set(variantId, promise);
  return promise;
}

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
  const [totalCount, setTotalCount] = React.useState<number|null>(null);
  const [totalLoading, setTotalLoading] = React.useState(false);
  const [resumeInfo, setResumeInfo] = React.useState<{ amountToken: string; idx: number; total: number } | null>(null);
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
    setResumeInfo(findLatestQuizResumeInfo(activeVariant.id, SECTION_ID));
  }, [activeVariant.id]);


  async function getData() {
    const offline = loadSectionOffline<{ items?: any[] }>(SECTION_ID, activeVariant.id);
    if (offline && Array.isArray(offline.items) && offline.items.length) {
      return { items: offline.items };
    }

    const items = await loadEngineSystemsQuestions(activeVariant.id);
    return { items };
  }

  async function startQuiz() {
    setLoading(true); setErr(null);
    try {
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

      const amountToken = amount === "all" ? "all" : String(amount);
      const session = {
        section: SECTION,
        ...buildInitialQuizResumeSession(randomized, amountToken),
      } as any;
      sessionStorage.setItem("engineq_session", JSON.stringify(session));
      writeQuizResumeSnapshot({
        section: SECTION_ID,
        variantId: activeVariant.id,
        amountToken,
        items: randomized,
        idx: 0,
        answers: Array(randomized.length).fill(undefined),
        flags: Array(randomized.length).fill(false),
      });
      router.push("/engine-systems-quiz/1");
    } catch(e:any) {
      setErr(e?.message || "Could not start quiz");
    } finally {
      setLoading(false);
    }
  }

  async function startWrongOnly() {
    const key = `${modelScopedKey("rr_progress_last_wrong", activeVariant.id)}:${SECTION_ID}`;
    const raw = localStorage.getItem(key) || (activeVariant.id === "AW169" ? localStorage.getItem(`rr_progress_last_wrong:${SECTION_ID}`) : null);
    if (!raw) { alert("No wrong-answer set available. Complete a quiz first."); return; }
    try {
      const data = JSON.parse(raw) as { items?: unknown[] };
      const items = Array.isArray(data.items) ? data.items : [];
      const session = {
        section: SECTION,
        ...buildInitialQuizResumeSession(items),
      } as any;
      sessionStorage.setItem("engineq_session", JSON.stringify(session));
      router.push("/engine-systems-quiz/1");
    } catch {
      alert("Could not load saved wrong-answer set. Delete and try again.");
      localStorage.removeItem(key);
      if (activeVariant.id === "AW169") {
        localStorage.removeItem(`rr_progress_last_wrong:${SECTION_ID}`);
      }
    }
  }

  function handleResumeContinue() {
    if (!resumeInfo) return;
    try {
      const snap = readQuizResumeSnapshot<any>(activeVariant.id, SECTION_ID, resumeInfo.amountToken);
      if (!snap) return;
      const session = {
        section: SECTION,
        ...buildQuizResumeSession(snap),
      };
      sessionStorage.setItem("engineq_session", JSON.stringify(session));
      router.push(`/engine-systems-quiz/${snap.idx + 1}`);
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

      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Engine, Fuel, Lubricants, Hydraulics & System Limitations</h1>
      <p className="text-lg text-slate-700 dark:text-zinc-100 mt-2">Choose number of questions and start.</p>

      {resumeInfo && (
        <div className="rounded-xl border-l-4 border-emerald-600 bg-emerald-50/40 dark:border-emerald-400 dark:bg-emerald-900/40 p-4 flex items-center gap-3">
          <div className="flex-1">
            <div className="font-semibold text-slate-900 dark:text-white">Resume session</div>
            <div className="text-sm text-gray-600 dark:text-zinc-100">You are on question {resumeInfo.idx + 1} of {resumeInfo.total} ({String(resumeInfo.amountToken)}).</div>
          </div>
          <button onClick={handleResumeContinue} className="px-3 py-2 rounded-lg bg-emerald-600 text-white">Continue</button>
          <button onClick={handleResumeReset} className="px-3 py-2 rounded-lg bg-slate-200 dark:bg-zinc-700 dark:text-white">Start over</button>
        </div>
      )}

      <div className="rounded-xl border-l-4 border-blue-600 bg-blue-50/40 dark:border-blue-400 dark:bg-blue-900/40 p-4 space-y-3 sm:flex sm:items-center sm:gap-3 sm:space-y-0">
        <label className="text-sm text-gray-700 dark:text-zinc-100">Count:</label>
        <select className="min-h-11 w-full rounded border px-3 py-2 dark:bg-blue-900 dark:text-zinc-100 dark:border-blue-400 sm:w-auto"
                value={amount}
                onChange={e => {
                  const value = e.target.value === "all" ? "all" : parseInt(e.target.value, 10);
                  setAmount(value as AmountOption);
                }}>
          {AMOUNT_OPTIONS.map(option => (
            <option key={option} value={option}>{option === "all" ? "All" : option}</option>
          ))}
        </select>
        <span className="block text-xs text-gray-600 dark:text-zinc-300 sm:ml-auto sm:mr-2">
          {totalLoading ? "…" : (totalCount != null ? `${totalCount} total` : "")}
        </span>
        <button onClick={startQuiz} disabled={loading}
          className="min-h-11 w-full rounded-lg bg-[#2E6EA1] px-4 py-2 font-semibold text-white active:scale-95 sm:w-auto">
          {loading ? "Starting…" : "Start quiz"}
        </button>
      </div>
      {err && <p className="text-red-600 text-sm">{err}</p>}
      <div className="rounded-xl border-l-4 border-emerald-600 bg-emerald-50/40 dark:border-emerald-400 dark:bg-emerald-900/40 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-slate-900 dark:text-white">Practice wrong answers only</div>
            <div className="text-sm text-gray-600 dark:text-white">Builds a set of questions you recently got wrong.</div>
          </div>
          <button onClick={startWrongOnly} className="px-4 py-2 rounded-lg bg-emerald-600 text-white">Practice wrong answers</button>
        </div>
      </div>
    </div>
  );
}
