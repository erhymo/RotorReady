"use client";
import { useRouter } from "next/navigation";
import * as React from "react";
import TopBarBackButton from "@/components/TopBarBackButton";
import Link from "next/link";
import { useActiveModelVariant } from "@/lib/models/hooks";
import { modelScopedKey } from "@/lib/models/storage";
import { reportFlag } from "@/lib/flags";

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

export default function ClientQuiz({ section, initial }: { section: string; initial: QuizItem[] }) {
  const router = useRouter();
  const { variant: activeVariant } = useActiveModelVariant();

  const [idx, setIdx] = React.useState(0);
  const [answers, setAnswers] = React.useState<(number | undefined)[]>(() => Array(initial.length).fill(undefined));
  const [flags, setFlags] = React.useState<boolean[]>(() => Array(initial.length).fill(false));
  const [done, setDone] = React.useState(false);

  const q = initial[idx];
  const total = initial.length;
  const progress = Math.round(((idx + 1) / total) * 100);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
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
  }
  function handleNext() {
    if (idx < initial.length - 1) setIdx(idx + 1);
    else setDone(true);
  }
  function handlePrev() {
    if (idx > 0) setIdx(idx - 1);
  }
  function handleRestart() {
    router.replace(`/quiz/${encodeURIComponent(section)}`);
  }
  function toggleFlag() {
    const next = [...flags];
    next[idx] = !next[idx];
    const nowFlagged = next[idx];
    setFlags(next);
    if (nowFlagged && q) {
      reportFlag({
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
      });
    }
  }

  // Persist "last wrong" set so SectionPage → "Øv kun på feil" works for alle seksjoner
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
        const wAnswers = wrongIdx.map(() => null as number | null);
        const wFlags = wrongIdx.map(() => false);
        const wrongSession = { section, createdAt: new Date().toISOString(), items, answers: wAnswers, flags: wFlags };
        localStorage.setItem(storageKey, JSON.stringify(wrongSession));
      } else {
        localStorage.removeItem(storageKey);
      }
    } catch {}
  }, [done]);

  if (!q) return <div className="p-8 text-center dark:bg-zinc-900 dark:text-zinc-100">Laster spørsmål ...</div>;
  if (done) {
    const correct = answers.filter((a, i) => a === (initial[i].answer[0] ?? -1)).length;
    const percent = Math.round((correct / initial.length) * 100);
    return (
      <div className="min-h-screen grid place-items-center p-6 dark:bg-zinc-900 dark:text-zinc-100">
        <div className="w-full max-w-xl bg-white dark:bg-zinc-900 dark:text-zinc-100 rounded-lg shadow p-6 text-center border dark:border-zinc-700">
          <h1 className="text-2xl font-bold mb-2">Result</h1>
          <div className="mb-1">Correct: <b>{correct}</b> / {initial.length}</div>
          <div className="mb-6">Percent: <b>{percent}%</b></div>
          <button className="px-4 py-2 rounded bg-blue-600 dark:bg-blue-900 text-white font-semibold hover:bg-blue-700 dark:hover:bg-blue-800" onClick={handleRestart}>Try again</button>
        </div>
      </div>
    );
  }

  // Standardiser layout: bruk samme chrome/stil som dedikerte quiz-sider
  const outer = "max-w-2xl mx-auto p-4 space-y-4";
  const card = "bg-white dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100 rounded-xl border p-4";

  return (
    <div className={outer}>
      <div className="h-2 bg-gray-200 rounded dark:bg-zinc-800">
        <div className="h-2 bg-blue-600 rounded dark:bg-blue-700" style={{ width: `${progress}%` }} />
      </div>
      <div className="w-full flex items-center justify-between py-2 px-4 border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        <TopBarBackButton href={`/quiz/${encodeURIComponent(section)}`} />
        <div className="text-gray-500 dark:text-zinc-400">Question {idx + 1} / {total}</div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-zinc-300">Question {idx + 1} / {total}</div>
        <div className="flex items-center gap-2">
          {activeVariant.id === "AW169" && (
            <Link href="/aw169/abbreviations" className="px-2 py-1 rounded border text-xs bg-white dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-700">ABBR</Link>
          )}
          <button onClick={toggleFlag} aria-label={flags[idx] ? "Remove flag" : "Flag this question"} className={`px-3 py-1 rounded border text-sm ${flags[idx] ? "bg-amber-100 border-amber-400 dark:bg-amber-900 dark:border-amber-600 dark:text-zinc-100" : "bg-white dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-700"}`}>{flags[idx] ? "Flagged" : "Flag"}</button>
        </div>
      </div>

      <div className={card}>
        <p className="font-medium">{q.question}</p>
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
                    ${isWrong ? "bg-red-50 border-red-400 dark:bg-red-900 dark:border-red-600 dark:text-zinc-100" : "border-gray-200 bg-white dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100"}`}
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

      <div className="w-full flex items-center justify-between py-4 px-4 border-t border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        <button onClick={handlePrev} disabled={idx===0} className="px-4 py-2 rounded-lg border bg-white dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-700 disabled:opacity-50">Previous</button>
        <span className="text-gray-500 dark:text-zinc-400">→ for Next</span>
        <button onClick={handleNext} disabled={answers[idx] === undefined} className="px-4 py-2 rounded-lg bg-gray-900 text-white dark:bg-zinc-900 dark:text-zinc-100 disabled:opacity-50">{idx < initial.length - 1 ? "Next" : "Finish"}</button>
      </div>
      <p className="mt-2 text-xs text-gray-500 dark:text-zinc-400">Keyboard: 1–4 select, ←/→ navigation, Enter = next, F = flag.</p>

    </div>
  );
}
