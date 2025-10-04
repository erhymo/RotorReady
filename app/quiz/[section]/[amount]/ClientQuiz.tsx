"use client";
import { useRouter } from "next/navigation";
import * as React from "react";

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
  const [idx, setIdx] = React.useState(0);
  const [answers, setAnswers] = React.useState<(number | undefined)[]>(() => Array(initial.length).fill(undefined));
  const [done, setDone] = React.useState(false);

  const q = initial[idx];

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

  return (
    <div className="min-h-screen grid place-items-center p-6 dark:bg-zinc-900 dark:text-zinc-100">
      <div className="w-full max-w-xl bg-white dark:bg-zinc-900 dark:text-zinc-100 rounded-lg shadow p-6 border dark:border-zinc-700">
        <div className="mb-4 text-sm text-slate-600 dark:text-zinc-300">Seksjon: {section.toUpperCase()}</div>
        <div className="mb-4 text-lg font-semibold">Spørsmål {idx + 1} av {initial.length}</div>
        <div className="mb-4 text-xl font-bold">{q.question}</div>
        <div className="grid grid-cols-1 gap-3 mb-6">
          {q.options.map((c, i) => {
            const chosen = answers[idx] === i;
            const isAnswered = answers[idx] !== undefined;
            const isCorrect = isAnswered && i === (q.answer[0] ?? -1);
            const isWrong = isAnswered && chosen && i !== (q.answer[0] ?? -1);
            // Marker riktig svar grønt hvis man har svart feil
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
        <div className="flex gap-4 justify-between items-center">
          <button
            className="px-4 py-2 rounded bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 disabled:opacity-50"
            onClick={handlePrev}
            disabled={idx === 0}
          >Forrige</button>
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
          <button
            className="px-4 py-2 rounded bg-blue-600 dark:bg-blue-900 text-white font-semibold hover:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50"
            onClick={handleNext}
            disabled={answers[idx] === undefined}
          >{idx < initial.length - 1 ? "Neste" : "Fullfør"}</button>
        </div>
      </div>
    </div>
  );
}
