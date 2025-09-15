"use client";
import * as React from "react";
import { useParams, useRouter } from "next/navigation";

type Item = {
  id: string;
  section: string;
  type: "single" | "multi";
  question: string;
  options: string[];
  answer: number[];
  explanation?: string;
  references?: string[];
  printedPage?: number;
};
type Session = { section: string; createdAt: string; items: Item[]; answers: Array<number|null>; flags: boolean[] };

function loadSession(): Session | null {
  try { const raw = sessionStorage.getItem("limq_session"); return raw ? JSON.parse(raw) as Session : null; } catch { return null; }
}
function saveSession(s: Session) { sessionStorage.setItem("limq_session", JSON.stringify(s)); }

export default function QuestionPage() {
  const router = useRouter();
  const params = useParams<{question: string}>();
  const idx = Math.max(0, (parseInt(params.question) || 1) - 1);

  const [session, setSession] = React.useState<Session | null>(null);
  const [selected, setSelected] = React.useState<number | null>(null);
  const total = session?.items.length ?? 0;

  React.useEffect(() => {
    const s = loadSession();
    if (!s || !s.items?.length) { router.replace("/limitations-quiz"); return; }
    if (idx >= s.items.length) { router.replace("/limitations-quiz/result"); return; }
    setSession(s);
    setSelected(s.answers[idx] ?? null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!session) return;
      if (["1","2","3","4"].includes(e.key)) {
        const pick = parseInt(e.key) - 1;
        choose(pick);
      } else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "Enter") next();
      else if (e.key.toLowerCase() === "f") toggleFlag();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!session) return <div className="max-w-xl mx-auto p-4">Loading…</div>;

  const item = session.items[idx];
  const isCorrect = selected != null ? item.answer.includes(selected) : null;

  function choose(i: number) {
    const s = loadSession(); if (!s) return;
    s.answers[idx] = i;
    saveSession(s); setSession(s); setSelected(i);
  }
  function toggleFlag() {
    const s = loadSession(); if (!s) return;
    s.flags[idx] = !s.flags[idx];
    saveSession(s); setSession({ ...s });
  }
  function next() {
    if (idx + 1 >= total) router.push("/limitations-quiz/result");
    else router.push(`/limitations-quiz/${idx + 2}`);
  }
  function prev() {
    if (idx > 0) router.push(`/limitations-quiz/${idx}`);
  }

  const progress = Math.round(((idx+1) / total) * 100);

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <div className="h-2 bg-gray-200 rounded">
        <div className="h-2 bg-blue-600 rounded" style={{ width: `${progress}%` }} />
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">Question {idx+1} / {total}</div>
        <button onClick={toggleFlag} className={`px-3 py-1 rounded border text-sm ${session.flags[idx] ? "bg-amber-100 border-amber-400" : "bg-white"}`}>{session.flags[idx] ? "Flagged" : "Flag"}</button>
      </div>

      <div className="bg-white rounded-xl border p-4">
        <p className="font-medium">{item.question}</p>
        <ul className="mt-3 space-y-2">
          {item.options.map((opt, i) => {
            const chosen = selected === i;
            const correct = selected != null && item.answer.includes(i);
            const wrongChoice = chosen && !correct;
            return (
              <li key={i}>
                <button onClick={() => choose(i)}
                  className={`w-full text-left px-4 py-3 rounded-lg border active:scale-[0.99] transition
                    ${chosen ? "ring-1" : ""}
                    ${correct ? "bg-green-50 border-green-400" : ""}
                    ${wrongChoice ? "bg-red-50 border-red-400" : "border-gray-200 bg-white"}`}>
                  <span className="mr-2 text-xs text-gray-500">{i+1}.</span>{opt}
                </button>
              </li>
            );
          })}
        </ul>
        {selected != null && (
          <div className="mt-3 text-sm text-gray-600">
            {isCorrect ? "Correct ✅" : "Incorrect ❌"} {item.explanation ? `– ${item.explanation}` : ""}
            {(item.references || item.printedPage) ? (
              <div className="text-xs text-gray-500 mt-1">
                Refs: {Array.isArray(item.references) ? item.references.join(", ") : String(item.references || "")}
                {item.printedPage ? ` (p. ${item.printedPage})` : ""}
              </div>
            ) : null}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button onClick={prev} disabled={idx===0} className="px-4 py-2 rounded-lg border bg-white disabled:opacity-50">Back</button>
        <button onClick={next} className="px-4 py-2 rounded-lg bg-gray-900 text-white">{idx+1>=total ? "Finish" : "Next"}</button>
      </div>

      <p className="text-xs text-gray-500">Keyboard: 1–4 select, ←/→ navigation, Enter = next, F = flag.</p>
    </div>
  );
}
