"use client";
import { useRouter } from "next/navigation";
import * as React from "react";
import TopBarBackButton from "@/components/TopBarBackButton";
import Link from "next/link";
import { useActiveModelVariant } from "@/lib/models/hooks";
import { modelScopedKey } from "@/lib/models/storage";

export type QuizItem = {
  id: string;
  section: string;
  type: "single" | "multi";
  question: string;
  options: string[];
  answer: number[];
  explanation?: string;
  references?: string[];
};

export default function ClientQuiz({ section, initial }: { section: string; initial: QuizItem[] }) {
  const router = useRouter();
  const { variant: activeVariant } = useActiveModelVariant();
  const isH125 = activeVariant.productId === "H125";

  const [idx, setIdx] = React.useState(0);
  const [answers, setAnswers] = React.useState<(number | undefined)[]>(() => Array(initial.length).fill(undefined));
  const [done, setDone] = React.useState(false);

  const q = initial[idx];
  const total = initial.length;
  const progress = Math.round(((idx + 1) / total) * 100);

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
        const flags = wrongIdx.map(() => false);
        const wrongSession = { section, createdAt: new Date().toISOString(), items, answers: wAnswers, flags };
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
          <h1 className="text-2xl font-bold mb-2">Resultat</h1>
          <div className="mb-1">Riktige: <b>{correct}</b> / {initial.length}</div>
          <div className="mb-6">Prosent: <b>{percent}%</b></div>
          <button className="px-4 py-2 rounded bg-blue-600 dark:bg-blue-900 text-white font-semibold hover:bg-blue-700 dark:hover:bg-blue-800" onClick={handleRestart}>Start på nytt</button>
        </div>
      </div>
    );
  }

  // Base container classes shared; H125 gets Limitations-style chrome
  const outer = isH125 ? "max-w-2xl mx-auto p-4 space-y-4" : "min-h-screen grid place-items-center p-6";
  const card = isH125
    ? "bg-white dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100 rounded-xl border p-4"
    : "w-full max-w-xl bg-white dark:bg-zinc-900 dark:text-zinc-100 rounded-lg shadow p-6 border dark:border-zinc-700";

  return (
    <div className={isH125 ? outer : "min-h-screen dark:bg-zinc-900 dark:text-zinc-100"}>
      {isH125 && (
        <>
          <div className="h-2 bg-gray-200 rounded dark:bg-zinc-800">
            <div className="h-2 bg-blue-600 rounded dark:bg-blue-700" style={{ width: `${progress}%` }} />
          </div>
          <div className="w-full flex items-center justify-between py-2 px-4 border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
            <TopBarBackButton href={`/quiz/${encodeURIComponent(section)}`} />
            <div className="text-gray-500 dark:text-zinc-400">Question {idx + 1} / {total}</div>
          </div>
        </>
      )}

      <div className={card}>
        {isH125 ? (
          <>
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
          </>
        ) : (
          <>
            <div className="mb-2 flex items-center justify-between text-sm text-slate-600 dark:text-zinc-300">
              <div>Question {idx + 1} / {initial.length}</div>
              {activeVariant.id === "AW169" && (
                <Link href="/aw169/abbreviations" className="px-2 py-1 rounded border text-xs bg-white dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-700">ABBR</Link>
              )}
            </div>
            <div className="mb-4 text-sm text-slate-600 dark:text-zinc-300">Seksjon: {section.toUpperCase()}</div>
            <div className="-mt-2 mb-2 flex items-center justify-between text-sm text-slate-600 dark:text-zinc-300">
              <div>Question {idx + 1} / {initial.length}</div>
              {activeVariant.id === "AW169" && (
                <Link href="/aw169/abbreviations" className="px-2 py-1 rounded border text-xs bg-white dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-700">ABBR</Link>
              )}
            </div>
            <div className="mb-4 text-lg font-semibold">Spørsmål {idx + 1} av {initial.length}</div>
            <div className="mb-4 text-xl font-bold">{q.question}</div>
            <div className="grid grid-cols-1 gap-3 mb-6">
              {q.options.map((c, i) => {
                const chosen = answers[idx] === i;
                const isAnswered = answers[idx] !== undefined;
                const isCorrect = isAnswered && i === (q.answer[0] ?? -1);
                const isWrong = isAnswered && chosen && i !== (q.answer[0] ?? -1);
                const highlightCorrect = isAnswered && answers[idx] !== q.answer[0] && i === q.answer[0];
                return (
                  <button
                    key={i}
                    className={
                      `text-left px-4 py-3 rounded border transition ` +
                      (chosen ? 'border-blue-600 bg-blue-50 dark:bg-blue-900 dark:border-blue-400 dark:text-blue-50' : 'border-slate-200 dark:border-zinc-700 dark:bg-zinc-900') +
                      ((isCorrect || highlightCorrect) ? ' border-green-600 bg-green-50 text-green-900 dark:bg-green-900 dark:border-green-500 dark:text-green-100' : '') +
                      (isWrong ? ' border-red-600 bg-red-50 text-red-900 dark:bg-red-900 dark:border-red-500 dark:text-red-100' : '')
                    }
                    disabled={isAnswered}
                    onClick={() => handleAnswer(i)}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </>
        )}

        <div className="flex gap-4 justify-between items-center mt-4">
          <button
            className="px-4 py-2 rounded bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 disabled:opacity-50"
            onClick={handlePrev}
            disabled={idx === 0}
          >Forrige</button>

          {!isH125 && (
            <div className="text-sm text-slate-500 dark:text-zinc-400 space-y-1">
              {answers[idx] !== undefined && (
                q.explanation
                  ? <div>Hint: {q.explanation}</div>
                  : answers[idx] !== q.answer[0] && q.options[q.answer[0]]
                    ? <div>Riktig svar: {q.options[q.answer[0]]}</div>
                    : null
              )}
              {answers[idx] !== undefined && q.references?.length ? (
                <div className="text-xs text-slate-400 dark:text-zinc-500">
                  Kilde: {q.references.join(", ")}
                </div>
              ) : null}
            </div>
          )}

          <button
            className="px-4 py-2 rounded bg-blue-600 dark:bg-blue-900 text-white font-semibold hover:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50"
            onClick={handleNext}
            disabled={answers[idx] === undefined}
          >{idx < initial.length - 1 ? "Neste" : "Fullfør"}</button>
        </div>
      </div>

      {isH125 && (
        <div className="w-full flex items-center justify-between py-4 px-4 border-t border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 mt-2 rounded-b-xl">
          <button onClick={handlePrev} disabled={idx===0} className="px-4 py-2 rounded-lg border bg-white dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-700 disabled:opacity-50">Previous</button>
          <span className="text-gray-500 dark:text-zinc-400">→ for Next</span>
          <button onClick={handleNext} disabled={answers[idx] === undefined} className="px-4 py-2 rounded-lg bg-gray-900 text-white dark:bg-zinc-900 dark:text-zinc-100 disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
}
