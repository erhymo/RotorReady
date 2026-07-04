"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { loadQuestionsForSectionId } from "@/lib/loadAllQuestions";
import { loadSectionOffline } from "@/lib/offline";
import { useActiveModelVariant } from "@/lib/models/hooks";
import { modelScopedKey } from "@/lib/models/storage";
import { buildInitialQuizResumeSession, buildValidatedQuizResumeSession, clearQuizResumeSnapshot, findLatestQuizResumeInfo, getQuizResumeStorageKey, readQuizResumeSnapshot, writeQuizResumeSnapshot } from "@/lib/quiz/resumeSnapshot";
import { shuffleOptionsForItem } from "@/lib/quiz/shuffleOptions";

import TopBarBackButton from "@/components/TopBarBackButton";

type QuizItem = {
  id: string;
  section?: string;
  question: string;
  options: string[];
  answer: number[];
  explanation?: string;
  references?: string[];
  tags?: string[];
};

const SESSION_KEY = "emergq_session";
const SECTION_ID = "emergency_procedures";

const AMOUNT_OPTIONS = [10, 20, 30, 40, 50, "all"] as const;

type AmountOption = (typeof AMOUNT_OPTIONS)[number];

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

export default function EmergencyStart() {
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

  const [totalCount, setTotalCount] = React.useState<number | null>(null);
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
    return () => {
      cancelled = true;
    };
  }, [activeVariant.id]);

  React.useEffect(() => {
    setResumeInfo(findLatestQuizResumeInfo(activeVariant.id, SECTION_ID));
  }, [activeVariant.id]);

  async function getData(): Promise<{ items: QuizItem[] }> {
    const offline = loadSectionOffline<{ items?: QuizItem[] }>(SECTION_ID, activeVariant.id);
    if (offline && Array.isArray(offline.items) && offline.items.length) {
      return { items: offline.items };
    }

    // Primært: bruk samlet laster (modell + global bank)
    let filtered = await loadQuestionsForSectionId<QuizItem>(SECTION_ID, activeVariant.id);

    // Fallback: direkte les kapittelfil hvis samlet laster ikke finner noe (f.eks. pga JSON-formatfeil i kildefil)
    if (!filtered.length) {
      try {
        const url = `/model-data/${activeVariant.id}/sections/${SECTION_ID}.json`;
        const res = await fetch(url, { cache: "no-store" });
        const text = await res.text();
        // Forsøk vanlig JSON først
        try {
          const json = JSON.parse(text);
          if (json && Array.isArray(json.items) && json.items.length) {
            filtered = json.items as QuizItem[];
          }
        } catch {
          // Nødfallback: trekk ut items-array med regex selv om filen har hengende objekter/komma etter arrayen
          const match = text.match(/"items"\s*:\s*(\[[\s\S]*?\])/);
          if (match) {
            try {
              const arr = JSON.parse(match[1]);
              if (Array.isArray(arr) && arr.length) {
                filtered = arr as QuizItem[];
              }
            } catch {}
          }
        }
      } catch {}
    }

    return { items: filtered };
  }

  async function startQuiz() {
    setLoading(true);
    setErr(null);
    try {
      const data = await getData();
      if (!data.items.length) {
        setErr("Fant ingen spørsmål i Emergency Procedures for valgt modell.");
        setLoading(false);
        return;
      }
      const base = amount === "all"
        ? shuffle(data.items)
        : sample(data.items, Math.min(amount, data.items.length));

      // Unngå identisk rekkefølge som de siste to i denne nettleser-sesjonen
      const key = `quiz:lastOrders:${activeVariant.id}:${SECTION_ID}:${amount === "all" ? "all" : amount}`;
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
        section: SECTION_ID,
        ...buildInitialQuizResumeSession(randomized, amountToken),
      };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));

      writeQuizResumeSnapshot({
        section: SECTION_ID,
        variantId: activeVariant.id,
        amountToken,
        items: randomized,
        idx: 0,
        answers: Array(randomized.length).fill(undefined),
        flags: Array(randomized.length).fill(false),
      });

      router.push("/emergency-quiz/1");
    } catch (error: any) {
      setErr(error?.message || "Kunne ikke starte quiz");
    } finally {
      setLoading(false);
    }
  }

  async function startWrongOnly() {
    const key = `${modelScopedKey("rr_progress_last_wrong", activeVariant.id)}:${SECTION_ID}`;
    const fallbackKey = `${modelScopedKey("rr_progress_last_wrong", activeVariant.id)}:${SECTION_ID.toUpperCase()}`;
    const legacyKey = activeVariant.id === "AW169" ? `rr_progress_last_wrong:${SECTION_ID}` : null;

    const raw =
      localStorage.getItem(key) ||
      localStorage.getItem(fallbackKey) ||
      (legacyKey ? localStorage.getItem(legacyKey) : null);

    if (!raw) {
      alert("Ingen feilsett tilgjengelig. Fullfør en quiz først.");
      return;
    }

    try {
      const data = JSON.parse(raw) as { items?: QuizItem[] };
      const items = Array.isArray(data.items) ? data.items : [];
      const randomized = items.map(shuffleOptionsForItem);
      const session = {
        section: SECTION_ID,
        ...buildInitialQuizResumeSession(randomized),
      };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
      router.push("/emergency-quiz/1");
    } catch {
      alert("Kunne ikke laste lagret feilsett. Slett og prøv igjen.");
      localStorage.removeItem(key);
      localStorage.removeItem(fallbackKey);
      if (legacyKey) localStorage.removeItem(legacyKey);
    }
  }

  async function handleResumeContinue() {
    if (!resumeInfo) return;
    try {
      const amountToken = resumeInfo.amountToken;
      const snap = readQuizResumeSnapshot<QuizItem>(activeVariant.id, SECTION_ID, amountToken);
      if (!snap) {
        setResumeInfo(null);
        return;
      }
      const session = {
        section: SECTION_ID,
        ...buildValidatedQuizResumeSession(snap, (answer, item) => answer >= 0 && answer < item.options.length),
      };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
      router.push(`/emergency-quiz/${snap.idx + 1}`);
    } catch {
      setResumeInfo(null);
    }
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
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Emergency Procedures Quiz</h1>
      <p className="text-lg text-slate-700 dark:text-zinc-100 mt-2">Choose number of questions and start.</p>

      <div className="rounded-xl border-l-4 border-blue-600 bg-blue-50/40 dark:border-blue-400 dark:bg-blue-900/40 p-4 space-y-3 sm:flex sm:items-center sm:gap-3 sm:space-y-0">
        <label className="text-sm text-gray-700 dark:text-zinc-100">Count:</label>
        <select
          className="min-h-11 w-full rounded border px-3 py-2 dark:bg-blue-900 dark:text-zinc-100 dark:border-blue-400 sm:w-auto"
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
        <span className="block text-xs text-gray-600 dark:text-zinc-300 sm:ml-auto sm:mr-2">
          {totalLoading ? "…" : (totalCount != null ? `${totalCount} total` : "")}
        </span>
        <button
          onClick={startQuiz}
          disabled={loading}
          className="min-h-11 w-full rounded-lg bg-[#2E6EA1] px-4 py-2 font-semibold text-white active:scale-95 disabled:opacity-60 sm:w-auto"
        >
          {loading ? "Starting…" : "Start quiz"}
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
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-slate-900 dark:text-white">Practice wrong answers only</div>
            <div className="text-sm text-gray-600 dark:text-zinc-100">Reuse your last wrong set for focused practice.</div>
          </div>
          <button onClick={startWrongOnly} className="px-4 py-2 rounded-lg bg-emerald-600 text-white">
            Practice wrong answers
          </button>
        </div>
      </div>
    </div>
  );
}
