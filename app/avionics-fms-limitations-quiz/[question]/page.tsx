"use client";
import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import TopBarBackButton from "@/components/TopBarBackButton";
import Link from "next/link";
import { useActiveModelVariant } from "@/lib/models/hooks";

import { reportFlag } from "@/lib/flags";

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
  __file?: string;
};

type Session = {
  section: string;
  createdAt: string;
  items: Item[];
  answers: Array<number | null>;
  flags: boolean[];
  error?: string;
};

function loadSession(): Session | null {
  try {
    const raw = sessionStorage.getItem("avionics_session");
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

function saveSession(session: Session) {
  sessionStorage.setItem("avionics_session", JSON.stringify(session));
}

export default function AvionicsQuestionPage() {
  const router = useRouter();
  const params = useParams<{ question: string }>();
  const idx = Math.max(0, (parseInt(params.question ?? "", 10) || 1) - 1);

  const [session, setSession] = React.useState<Session | null>(null);
  const [selected, setSelected] = React.useState<number | null>(null);
  const total = session?.items.length ?? 0;
  const { variant: activeVariant } = useActiveModelVariant();

  React.useEffect(() => {
    const current = loadSession();
    if (!current) {
      router.replace("/avionics-fms-limitations-quiz");
      return;
    }
    if (!current.items?.length) {
      setSession({ ...current, error: "Ingen spørsmål funnet i denne quizen." });
      return;
    }
    if (idx >= current.items.length) {
      router.replace("/avionics-fms-limitations-quiz/result");
      return;
    }
    setSession(current);
    setSelected(current.answers[idx] ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  React.useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (!session) return;
      if (["1", "2", "3", "4"].includes(event.key)) {
        const pick = parseInt(event.key, 10) - 1;
        choose(pick);
      } else if (event.key === "ArrowRight") next();
      else if (event.key === "ArrowLeft") prev();
      else if (event.key === "Enter") next();
      else if (event.key.toLowerCase() === "f") toggleFlag();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!session) return <div className="max-w-xl mx-auto p-4">Loading…</div>;
  if ((session as any).error) {
    console.error("Quiz error:", (session as any).error, session);
    return (
      <div className="max-w-xl mx-auto p-4 text-red-600">
        <b>Error:</b> {(session as any).error}
        <br />
        <pre className="text-xs text-gray-500 mt-2">{JSON.stringify(session, null, 2)}</pre>
      </div>
    );
  }

  const item = session.items[idx];
  const isCorrect = selected != null ? item.answer.includes(selected) : null;

  function choose(position: number) {
    const current = loadSession();
    if (!current) return;
    current.answers[idx] = position;
    saveSession(current);
    setSession(current);
    setSelected(position);
  }

  function toggleFlag() {
    const current = loadSession();
    if (!current) return;
    current.flags[idx] = !current.flags[idx];
    const nowFlagged = current.flags[idx];
    saveSession(current);
    setSession({ ...current });
    if (nowFlagged) {
      reportFlag({
        section: current.section,
        sectionId: "avionics_fms_limitations",
        questionId: item.id,
        dataSource: "sections",
        dataFile: "avionics_fms_limitations.json",
        snapshot: {
          question: item.question,
          options: item.options,
          explanation: item.explanation,
          references: item.references,
          answer: item.answer,
        },
      });
    }
  }

  function next() {
    if (idx + 1 >= total) router.push("/avionics-fms-limitations-quiz/result");
    else router.push(`/avionics-fms-limitations-quiz/${idx + 2}`);
  }

  function prev() {
    if (idx > 0) router.push(`/avionics-fms-limitations-quiz/${idx}`);
  }

  const progress = total ? Math.round(((idx + 1) / total) * 100) : 0;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <div className="h-2 bg-gray-200 rounded dark:bg-zinc-800">
        <div className="h-2 bg-blue-600 rounded dark:bg-blue-700" style={{ width: `${progress}%` }} />
      </div>
      <div className="w-full flex items-center justify-between py-2 px-1">
        <TopBarBackButton href="/avionics-fms-limitations-quiz" />
        <div className="text-gray-500 dark:text-zinc-400">Question {idx + 1} / {total}</div>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-zinc-300">Question {idx + 1} / {total}</div>
        <div className="flex items-center gap-2">
          {activeVariant.id === "AW169" && (
            <Link href="/aw169/abbreviations" className="px-2 py-1 rounded border text-xs bg-white dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-700">ABBR</Link>
          )}
          <button
            onClick={toggleFlag}
            className={`px-3 py-1 rounded border text-sm ${session.flags[idx] ? "bg-amber-100 border-amber-400 dark:bg-amber-900 dark:border-amber-600 dark:text-zinc-100" : "bg-white dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-700"}`}
          >
            {session.flags[idx] ? "Flagged" : "Flag"}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100 rounded-xl border p-4">
        <p className="font-medium">{item.question}</p>
        <ul className="mt-3 space-y-2">
          {item.options.map((option, i) => {
            const chosen = selected === i;
            const correct = selected != null && item.answer.includes(i);
            const wrongChoice = chosen && !correct;
            return (
              <li key={i}>
                <button
                  onClick={() => choose(i)}
                  className={`w-full text-left px-4 py-3 rounded-lg border active:scale-[0.99] transition
                    ${chosen ? "ring-1 dark:ring-zinc-400" : ""}
                    ${correct ? "bg-green-50 border-green-400 dark:bg-green-900 dark:border-green-600 dark:text-zinc-100" : ""}
                    ${wrongChoice ? "bg-red-50 border-red-400 dark:bg-red-900 dark:border-red-600 dark:text-zinc-100" : "border-gray-200 bg-white dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100"}`}
                >
                  <span className="mr-2 text-xs text-gray-500 dark:text-zinc-400">{i + 1}.</span>
                  {option}
                </button>
              </li>
            );
          })}
        </ul>
        {selected != null && (
          <div className="mt-3 text-sm text-gray-600 dark:text-zinc-300">
            {isCorrect ? "Correct ✅" : "Wrong ❌"} {item.explanation ? `– ${item.explanation}` : ""}
            {(item.references) ? (
              <div className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                Refs: {Array.isArray(item.references) ? item.references.join(", ") : String(item.references || "")}
              </div>
            ) : null}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={prev}
          disabled={idx === 0}
          className="px-4 py-2 rounded-lg border bg-white dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-700 disabled:opacity-50"
        >
          Back
        </button>
        <span className="text-gray-500 dark:text-zinc-400">→ for Next for Next</span>
        <button
          onClick={next}
          className="px-4 py-2 rounded-lg bg-gray-900 text-white dark:bg-zinc-900 dark:text-zinc-100"
        >
          {idx + 1 >= total ? "Finish" : "Next"}
        </button>
      </div>

      <p className="text-xs text-gray-500 dark:text-zinc-400">Keyboard: 1–4 select, ←/→ navigation, Enter = next, F = flag.</p>
    </div>
  );
}
