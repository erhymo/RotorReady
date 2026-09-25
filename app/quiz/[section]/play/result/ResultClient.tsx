"use client";
import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { modelScopedKey } from "@/lib/models/storage";
import { useActiveModelVariant } from "@/lib/models/hooks";
import { buildInitialQuizResumeSession, clearQuizResumeSnapshot } from "@/lib/quiz/resumeSnapshot";
import { saveResult } from "@/lib/sync/results";
import TopBarBackButton from "@/components/TopBarBackButton";

type Item = { id: string; answer: number[]; [key: string]: unknown };
type Session = { section: string; items: Item[]; answers: Array<number | null>; amountToken?: string };

// The result page for every quiz section and model. Records the result in the
// progress history shown under Settings, keeps the last wrong-answer set and a
// rolling history of the last ten (read by "Practice wrong answers" on the
// section page and in Settings), and syncs the result for signed-in users.
export default function ResultClient() {
  const router = useRouter();
  const params = useParams<{ section: string }>();
  const section = decodeURIComponent(params.section || "");
  const { variant: activeVariant, loading: variantLoading } = useActiveModelVariant();
  const key = `${modelScopedKey("quiz_session", activeVariant.id)}:${section}`;

  const [summary, setSummary] = React.useState<{ correct: number; total: number; wrong: number } | null>(null);
  const recorded = React.useRef(false);

  React.useEffect(() => {
    if (variantLoading) return;
    try {
      const raw = sessionStorage.getItem(key);
      if (!raw) { router.replace(`/quiz/${encodeURIComponent(section)}`); return; }
      const s = JSON.parse(raw) as Session;
      const total = s.items.length;
      const wrongIdx: number[] = [];
      const correct = s.answers.reduce<number>((acc, a, i) => {
        const ok = a != null && s.items[i].answer.includes(a);
        if (!ok) wrongIdx.push(i);
        return acc + (ok ? 1 : 0);
      }, 0);
      setSummary({ correct, total, wrong: wrongIdx.length });

      // Record once per visit, not on every re-render.
      if (recorded.current) return;
      recorded.current = true;

      try {
        clearQuizResumeSnapshot(activeVariant.id, section, String(s.amountToken ?? "all"));
      } catch {}

      const percent = total ? (correct / total) * 100 : 0;
      const at = new Date().toISOString();
      const historyKey = modelScopedKey("rr_progress", activeVariant.id);
      try {
        const arr = JSON.parse(localStorage.getItem(historyKey) || "[]");
        const list = Array.isArray(arr) ? arr : [];
        list.push({ section: s.section, total, correct, percent, at });
        localStorage.setItem(historyKey, JSON.stringify(list));
      } catch {}

      const normalized = (typeof s.section === "string" && s.section.length ? s.section : section).toLowerCase();
      const storageKey = `${modelScopedKey("rr_progress_last_wrong", activeVariant.id)}:${normalized}`;
      if (wrongIdx.length) {
        const items = wrongIdx.map((i) => s.items[i]);
        const wrongSession = {
          section: normalized,
          ...buildInitialQuizResumeSession(items),
          createdAt: at,
          answers: Array(items.length).fill(null),
        };
        localStorage.setItem(storageKey, JSON.stringify(wrongSession));
        const histKey = `${modelScopedKey("rr_wrong_history", activeVariant.id)}:${normalized}`;
        let hist: unknown[] = [];
        try {
          const parsed = JSON.parse(localStorage.getItem(histKey) || "[]");
          if (Array.isArray(parsed)) hist = parsed;
        } catch {}
        hist.push(wrongSession);
        localStorage.setItem(histKey, JSON.stringify(hist.slice(-10)));
      } else {
        localStorage.removeItem(storageKey);
      }

      void saveResult({ section: s.section, total, correct, percent, at });
    } catch {
      router.replace(`/quiz/${encodeURIComponent(section)}`);
    }
  }, [key, router, section, activeVariant.id, variantLoading]);

  function practiceWrong() {
    try {
      const raw = sessionStorage.getItem(key);
      if (!raw) return;
      const s = JSON.parse(raw) as Session;
      const items = s.items.filter((it, i) => {
        const picked = s.answers[i];
        return !(picked != null && it.answer.includes(picked));
      });
      if (!items.length) { alert("No wrong answers in this round."); return; }
      sessionStorage.setItem(key, JSON.stringify({ section: s.section, ...buildInitialQuizResumeSession(items) }));
      router.replace(`/quiz/${encodeURIComponent(section)}/play/q?n=1`);
    } catch {}
  }

  if (!summary) return <div className="min-h-screen grid place-items-center p-6">Loading…</div>;

  const percent = summary.total ? Math.round((summary.correct / summary.total) * 100) : 0;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <div className="w-full flex items-center py-1">
        <TopBarBackButton href={`/quiz/${encodeURIComponent(section)}`} />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">Result</h1>
      <div className="rounded-xl border-l-4 border-blue-600 bg-blue-50/40 p-4 dark:border-blue-400 dark:bg-zinc-900 dark:text-white">
        <div>Answered: <b>{summary.total}</b></div>
        <div>Correct: <b>{summary.correct}</b></div>
        <div>Percent: <b>{percent}%</b></div>
      </div>

      <div className="grid gap-2 sm:flex">
        <button
          onClick={() => router.replace(`/quiz/${encodeURIComponent(section)}`)}
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#2E6EA1] px-4 py-2 font-semibold text-white"
        >
          Try again
        </button>
        <button
          onClick={practiceWrong}
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white"
        >
          Practice wrong answers
        </button>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        >
          Home
        </Link>
      </div>

      <div className="rounded-xl border-l-4 border-emerald-600 bg-emerald-50/40 p-4 dark:border-emerald-400 dark:bg-zinc-900 dark:text-white">
        <div className="font-semibold mb-2">Next steps</div>
        <ul className="list-disc ml-5 text-sm text-slate-700 dark:text-emerald-100">
          {summary.wrong > 0
            ? <li>Use <b>Practice wrong answers</b> above to repeat only the ones you missed.</li>
            : <li>Full marks — try a larger set or another section.</li>}
          <li>See your progress under <b>Settings</b>.</li>
        </ul>
      </div>
    </div>
  );
}
