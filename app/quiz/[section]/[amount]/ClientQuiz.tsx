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

  if (!q) return <div className="p-8 text-center">Laster spørsmål ...</div>;
  if (done) {
    const correct = answers.filter((a, i) => a === (initial[i].answer[0] ?? -1)).length;
    const percent = Math.round((correct / initial.length) * 100);
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <div className="w-full max-w-xl bg-white rounded-lg shadow p-6 text-center">
          <h1 className="text-2xl font-bold mb-2">Resultat</h1>
          <div className="mb-1">Riktige: <b>{correct}</b> / {initial.length}</div>
          <div className="mb-6">Prosent: <b>{percent}%</b></div>
          <button className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700" onClick={handleRestart}>Start på nytt</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-xl bg-white rounded-lg shadow p-6">
        <div className="mb-4 text-sm text-slate-600">Seksjon: {section.toUpperCase()}</div>
        <div className="mb-4 text-lg font-semibold">Spørsmål {idx + 1} av {initial.length}</div>
        <div className="mb-4 text-xl font-bold">{q.question}</div>
        <div className="grid grid-cols-1 gap-3 mb-6">
          {q.options.map((c, i) => {
            const chosen = answers[idx] === i;
            const isAnswered = answers[idx] !== undefined;
            const isCorrect = isAnswered && i === (q.answer[0] ?? -1);
            const isWrong = isAnswered && chosen && i !== (q.answer[0] ?? -1);
            return (
              <button
                key={i}
                className={
                  `text-left px-4 py-3 rounded border transition ` +
                  (chosen ? 'border-blue-600 bg-blue-50' : 'border-slate-200') +
                  (isCorrect ? ' border-green-600 bg-green-50' : '') +
                  (isWrong ? ' border-red-600 bg-red-50' : '')
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
            className="px-4 py-2 rounded bg-slate-200 hover:bg-slate-300 disabled:opacity-50"
            onClick={handlePrev}
            disabled={idx === 0}
          >Forrige</button>
          <div className="text-sm text-slate-500">
            {answers[idx] !== undefined && q.explanation && (
              <span>Hint: {q.explanation}</span>
            )}
          </div>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
            onClick={handleNext}
            disabled={answers[idx] === undefined}
          >{idx < initial.length - 1 ? "Neste" : "Fullfør"}</button>
        </div>
      </div>
    </div>
  );
}

