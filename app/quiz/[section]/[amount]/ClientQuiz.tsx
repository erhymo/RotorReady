"use client";
import { useRouter } from "next/navigation";
import * as React from "react";
import TopBarBackButton from "@/components/TopBarBackButton";
import QuizBottomBar from "@/components/QuizBottomBar";
import Link from "next/link";
import { useActiveModelVariant } from "@/lib/models/hooks";
import { modelScopedKey } from "@/lib/models/storage";
import { reportFlag, type FlagPayload } from "@/lib/flags";
import { isEditableKeyboardTarget } from "@/lib/isEditableKeyboardTarget";
import { buildInitialQuizResumeSession, clearQuizResumeSnapshot, writeQuizResumeSnapshot } from "@/lib/quiz/resumeSnapshot";
import FlagReasonDialog from "@/components/FlagReasonDialog";

export type QuizItem = {
  id: string;
  section: string;
  type: "single" | "multi";
  question: string;
  options: string[];
  answer: number[];
  explanation?: string;
  references?: string[];
  sectionId?: string;
  __file?: string;
};

export default function ClientQuiz({ section, initial, resumeKey, amountToken, initialIdx = 0, initialAnswers, initialFlags }: { section: string; initial: QuizItem[]; resumeKey: string; amountToken: string; initialIdx?: number; initialAnswers?: (number | undefined)[]; initialFlags?: boolean[] }) {
  const router = useRouter();
  const { variant: activeVariant } = useActiveModelVariant();

  const [idx, setIdx] = React.useState<number>(initialIdx);
  const [answers, setAnswers] = React.useState<(number | undefined)[]>(() =>
    initialAnswers && initialAnswers.length === initial.length
      ? initialAnswers.map((a) => (a == null ? undefined : a))
      : Array(initial.length).fill(undefined)
  );
  const [flags, setFlags] = React.useState<boolean[]>(() =>
    initialFlags && initialFlags.length === initial.length
      ? initialFlags
      : Array(initial.length).fill(false)
  );
  const [done, setDone] = React.useState(false);

  const [copied, setCopied] = React.useState(false);
  const [pendingFlag, setPendingFlag] = React.useState<FlagPayload | null>(null);



  const q = initial[idx];
  const total = initial.length;
  const progress = Math.round(((idx + 1) / total) * 100);

  // Persist resume snapshot
  function persistSnapshot(nextIdx: number = idx, nextAnswers: (number | undefined)[] = answers, nextFlags: boolean[] = flags) {
    writeQuizResumeSnapshot({
      section,
      variantId: activeVariant.id,
      amountToken,
      items: initial,
      idx: nextIdx,
      answers: nextAnswers,
      flags: nextFlags,
    });
  }

  // Create initial snapshot if missing
  React.useEffect(() => {
    try {
      const existing = localStorage.getItem(resumeKey);
      if (!existing) persistSnapshot(initialIdx, answers, flags);
    } catch {}
  }, [resumeKey]);

  function toggleFlag() {
    const next = [...flags];
    next[idx] = !next[idx];
    const nowFlagged = next[idx];
    setFlags(next);
    // persist progress
    persistSnapshot(idx, answers, next);
    if (nowFlagged && q) {
      const basePayload: FlagPayload = {
        section,
        sectionId: q.sectionId || section,
        questionId: q.id,
        dataSource: section === "all" ? "all-questions" : "sections",
        dataFile: (q as any).__file || null,
        snapshot: {
          question: q.question,
          options: q.options,
          explanation: q.explanation,
          references: q.references,
          answer: q.answer,
        },
      };
      setPendingFlag(basePayload);
    }
  }

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (isEditableKeyboardTarget(e.target)) return;
      if (e.key.toLowerCase() === "f") toggleFlag();
    }
    window.addEventListener("keydown", onKey);


    return () => window.removeEventListener("keydown", onKey);
  });

  function handleAnswer(i: number) {
    if (answers[idx] !== undefined) return;
    const next = [...answers];
    next[idx] = i;
    setAnswers(next);
    // persist progress
    persistSnapshot(idx, next, flags);
  }
  function handleNext() {
    if (idx < initial.length - 1) {
      const nextIdx = idx + 1;
      setIdx(nextIdx);
      persistSnapshot(nextIdx, answers, flags);

    } else {
      clearQuizResumeSnapshot(activeVariant.id, section, amountToken);
      setDone(true);
    }
  }
  function handlePrev() {
    if (idx > 0) {
      const prevIdx = idx - 1;
      setIdx(prevIdx);
      persistSnapshot(prevIdx, answers, flags);
    }
  }
  function handleRestart() {
    router.replace(`/quiz/${encodeURIComponent(section)}`);
  }
  // Persist "last wrong" set so SectionPage → "Practice only incorrect" works for all sections
  React.useEffect(() => {
    if (!done) return;
    try {
      const normalized = section.toLowerCase();
      const wrongIdx: number[] = [];
      initial.forEach((it, i) => {
        const picked = answers[i];
        const ok = picked != null && it.answer.includes(picked);
        if (!ok) wrongIdx.push(i);
      });
      const storageKey = `${modelScopedKey("rr_progress_last_wrong", activeVariant.id)}:${normalized}`;
      if (wrongIdx.length) {
        const items = wrongIdx.map((i) => initial[i]);
        const wrongSession = {
          section,
          ...buildInitialQuizResumeSession(items),
          createdAt: new Date().toISOString(),
          answers: Array(items.length).fill(null),
        };
        localStorage.setItem(storageKey, JSON.stringify(wrongSession));
      } else {
        localStorage.removeItem(storageKey);
      }
    } catch {}
  }, [done]);

  if (!q) return <div className="p-8 text-center dark:bg-zinc-900 dark:text-zinc-100">Loading questions ...</div>;
  if (done) {
    const correct = answers.filter((a, i) => a === (initial[i].answer[0] ?? -1)).length;
    const percent = Math.round((correct / initial.length) * 100);
    return (
      <div className="min-h-screen grid place-items-center p-6 dark:bg-zinc-900 dark:text-zinc-100">
        <div className="w-full max-w-xl bg-white dark:bg-zinc-800 dark:text-zinc-100 rounded-lg shadow p-6 text-center border dark:border-zinc-700">
          <h1 className="text-2xl font-bold mb-2">Result</h1>
          <div className="mb-1">Correct: <b>{correct}</b> / {initial.length}</div>
          <div className="mb-6">Percent: <b>{percent}%</b></div>
          <button className="px-4 py-2 rounded bg-blue-600 dark:bg-blue-900 text-white font-semibold hover:bg-blue-700 dark:hover:bg-blue-800" onClick={handleRestart}>Try again</button>
        </div>
      </div>
    );
  }

  // Standardiser layout: bruk samme chrome/stil som dedikerte quiz-sider
  const outer = "max-w-2xl mx-auto p-4 pb-28 space-y-4";
  const card = "bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 rounded-xl border p-4";

  return (
    <div className={outer}>
      <div className="h-2 bg-gray-200 rounded dark:bg-zinc-800">
        <div className="h-2 bg-blue-600 rounded dark:bg-blue-700" style={{ width: `${progress}%` }} />
      </div>
      <div className="w-full flex items-center justify-between py-2 px-4 border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
        <TopBarBackButton href={`/quiz/${encodeURIComponent(section)}`} />
        <div className="text-gray-500 dark:text-zinc-400">Question {idx + 1} / {total}</div>
      </div>

      <div className="flex items-center justify-end">
        <div className="flex items-center gap-2">
	          {activeVariant.productId === "AW169" && (
            <Link href="/aw169/abbreviations" className="px-2 py-1 rounded border text-xs bg-white dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700">ABBR</Link>
          )}
          <button onClick={toggleFlag} aria-label={flags[idx] ? "Remove flag" : "Flag this question"} className={`px-3 py-1 rounded border text-sm ${flags[idx] ? "bg-amber-100 border-amber-400 dark:bg-amber-900 dark:border-amber-600 dark:text-zinc-100" : "bg-white dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700"}`}>{flags[idx] ? "Flagged" : "Flag"}</button>
        </div>
      </div>

      <div className={card}>
        <div className="flex items-start justify-between gap-3">
          <p className="font-medium flex-1">{q.question}</p>
          <button onClick={() => { try { if (q?.id) { navigator.clipboard?.writeText(q.id); setCopied(true); window.setTimeout(() => setCopied(false), 1200); } } catch {} }} title="Click to copy ID" className="ml-2 text-[11px] font-mono text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200">
            ID: {q.id}{copied ? " \u2713" : ""}
          </button>
        </div>
        <ul className="mt-3 space-y-2">
          {q.options.map((opt, i) => {
            const chosen = answers[idx] === i;
            const isAnswered = answers[idx] !== undefined;
            const isCorrect = isAnswered && i === (q.answer[0] ?? -1);
            const isWrong = isAnswered && chosen && !isCorrect;
            const highlightCorrect = isAnswered && answers[idx] !== q.answer[0] && i === q.answer[0];
            return (
              <li key={i}>
                <button
                  onClick={() => handleAnswer(i)}
                  disabled={isAnswered}
                  className={`w-full text-left px-4 py-3 rounded-lg border active:scale-[0.99] transition
                    ${chosen ? "ring-1 dark:ring-zinc-400" : ""}
                    ${(isCorrect || highlightCorrect) ? "bg-green-50 border-green-400 dark:bg-green-900 dark:border-green-600 dark:text-zinc-100" : ""}
                    ${isWrong ? "bg-red-50 border-red-400 dark:bg-red-900 dark:border-red-600 dark:text-zinc-100" : "border-gray-200 bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"}`}
                >
                  <span className="mr-2 text-xs text-gray-500 dark:text-zinc-400">{i + 1}.</span>{opt}
                </button>
              </li>
            );
          })}
        </ul>
        {answers[idx] !== undefined && (
          <div className="mt-3 text-sm text-gray-600 dark:text-zinc-300">
            {answers[idx] === (q.answer[0] ?? -1) ? "Correct ✅" : "Incorrect ❌"}
            {q.explanation
              ? `– ${q.explanation}`
              : answers[idx] !== q.answer[0] && q.answer.length >= 1
                ? ` – Correct answer: ${q.answer.map(ai => q.options[ai]).join(', ')}`
                : ""}
            {q.references?.length ? (
              <div className="text-xs text-gray-500 mt-1 dark:text-zinc-400">
                Refs: {q.references.join(", ")}
              </div>
            ) : null}
          </div>
        )}
      </div>

      <QuizBottomBar
        onPrevious={handlePrev}
        previousDisabled={idx === 0}
        onNext={handleNext}
        nextDisabled={answers[idx] === undefined}
        nextLabel={idx < initial.length - 1 ? "Next" : "Finish"}
        progressText={`Question ${idx + 1} / ${total}`}
      />
      <FlagReasonDialog
        payload={pendingFlag}
        onComplete={(payload) => {
          if (!payload) return;
          reportFlag(payload);
          setPendingFlag(null);
        }}
      />
      <p className="mt-2 hidden text-xs text-gray-500 dark:text-zinc-400 md:block">Keyboard: 1–4 select, ←/→ navigation, Enter = next, F = flag.</p>

    </div>
  );
}
