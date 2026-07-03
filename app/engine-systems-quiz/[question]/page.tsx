"use client";
import * as React from "react";
import { useParams, useRouter } from "next/navigation";

import { reportFlag, type FlagPayload } from "@/lib/flags";
import TopBarBackButton from "@/components/TopBarBackButton";
import QuizBottomBar from "@/components/QuizBottomBar";
import Link from "next/link";
import { useActiveModelVariant } from "@/lib/models/hooks";
import FlagReasonDialog from "@/components/FlagReasonDialog";
import { isEditableKeyboardTarget } from "@/lib/isEditableKeyboardTarget";
import { clearQuizResumeSnapshotForSession, syncQuizResumeSnapshot } from "@/lib/quiz/resumeSnapshot";

// Samme type som limitations, men bruker engineq_session

const SECTION_ID = "engine-systems" as const;

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
type Session = { section: string; createdAt: string; items: Item[]; answers: Array<number|null>; flags: boolean[]; amountToken?: string; error?: string };

function loadSession(): Session | null {
  try { const raw = sessionStorage.getItem("engineq_session"); return raw ? JSON.parse(raw) as Session : null; } catch { return null; }
}
function saveSession(s: Session) { sessionStorage.setItem("engineq_session", JSON.stringify(s)); }

export default function EngineQuestionPage() {
  const router = useRouter();
  const params = useParams<{question: string}>();
  const idx = Math.max(0, (parseInt(((params as any)?.question || "1")) || 1) - 1);

  const [session, setSession] = React.useState<Session | null>(null);
  const [selected, setSelected] = React.useState<number | null>(null);
  const total = session?.items.length ?? 0;
  const [pendingFlag, setPendingFlag] = React.useState<FlagPayload | null>(null);

  const [copied, setCopied] = React.useState(false);

  function updateResume(idxOverride?: number) {
    const s = loadSession();
    if (!s) return;
	  syncQuizResumeSnapshot(activeVariant.id, SECTION_ID, idxOverride != null ? idxOverride : idx, {
	    ...s,
	    amountToken: String(s.amountToken ?? "all"),
	  });
  }

  const { variant: activeVariant } = useActiveModelVariant();

  React.useEffect(() => {
    const s = loadSession();
    if (!s) { router.replace("/engine-systems-quiz"); return; }
    if (!s.items?.length) {
      setSession({ ...s, error: "No questions found in this quiz." });
      return;
    }
    if (idx >= s.items.length) { router.replace("/engine-systems-quiz/result"); return; }
    setSession(s);
    setSelected(s.answers[idx] ?? null);
  }, [idx]);

  function choose(i: number) {
    if (selected != null) return; // lock after first answer
    const s = loadSession();
    if (!s) return;
    s.answers[idx] = i;
    saveSession(s);
    setSession(s);
    setSelected(i);
    updateResume();
  }

  function toggleFlag() {
    const s = loadSession();
    if (!s) return;
    const currentItem = s.items[idx];
    if (!currentItem) return;
    s.flags[idx] = !s.flags[idx];
    const nowFlagged = s.flags[idx];
    saveSession(s);
    setSession({ ...s });
    updateResume();
    if (nowFlagged) {
      const basePayload: FlagPayload = {
        section: s.section,
        sectionId: "engine-systems",
        questionId: currentItem.id,
        dataSource: "all-questions",
        dataFile: currentItem.__file || null,
        snapshot: {
          question: currentItem.question,
          options: currentItem.options,
          explanation: currentItem.explanation,
          references: currentItem.references,
          answer: currentItem.answer,
        },
      };
      setPendingFlag(basePayload);
    }
  }

  function next() {
    if (idx + 1 >= total) {
	    clearQuizResumeSnapshotForSession(activeVariant.id, SECTION_ID, {
	      amountToken: String(loadSession()?.amountToken ?? "all"),
	    });
      router.push("/engine-systems-quiz/result");
    } else {
      updateResume(idx + 1);
      router.push(`/engine-systems-quiz/${idx + 2}`);
    }
  }

  function prev() {
    if (idx > 0) {
      updateResume(idx - 1);
      router.push(`/engine-systems-quiz/${idx}`);
    }
  }

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!session) return;
      if (isEditableKeyboardTarget(e.target)) return;
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
  if ((session as any).error) {
    console.error('Quiz error:', (session as any).error, session);
    return (
      <div className="max-w-xl mx-auto p-4 text-red-600">
	        <b>Error:</b> {(session as any).error}<br />
        <pre className="text-xs text-gray-500 mt-2">{JSON.stringify(session, null, 2)}</pre>
      </div>
    );
  }

  const item = session.items[idx];
  const isCorrect = selected != null ? item.answer.includes(selected) : null;

  const progress = Math.round(((idx+1) / total) * 100);

  return (
    <div className="max-w-2xl mx-auto p-4 pb-28 space-y-4">
      <div className="h-2 bg-gray-200 rounded dark:bg-zinc-800">
        <div className="h-2 bg-blue-600 rounded dark:bg-blue-700" style={{ width: `${progress}%` }} />
      </div>
      <div className="w-full flex items-center justify-between py-2 px-4 border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
        <TopBarBackButton href="/engine-systems-quiz" />
        <div className="text-gray-500 dark:text-zinc-400">Question {idx+1} / {total}</div>
      </div>
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-2">
          {activeVariant.id === "AW169" && (
            <Link href="/aw169/abbreviations" className="px-2 py-1 rounded border text-xs bg-white dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700">ABBR</Link>
          )}
          <button onClick={toggleFlag} className={`px-3 py-1 rounded border text-sm ${session.flags[idx] ? "bg-amber-100 border-amber-400 dark:bg-amber-900 dark:border-amber-600 dark:text-zinc-100" : "bg-white dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700"}`}>{session.flags[idx] ? "Flagged" : "Flag"}</button>
        </div>
      </div>

  <div className="bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 rounded-xl border p-4">
        <div className="flex items-start justify-between gap-3">
          <p className="font-medium flex-1">{item.question}</p>
          <button onClick={() => { try { if (item?.id) { navigator.clipboard?.writeText(item.id); setCopied(true); window.setTimeout(() => setCopied(false), 1200); } } catch {} }} title="Click to copy ID" className="ml-2 text-[11px] font-mono text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200">
            ID: {item.id}{copied ? " \u2713" : ""}
          </button>
        </div>
  <ul className="mt-3 space-y-2">
          {item.options.map((opt, i) => {
            const chosen = selected === i;
            const correct = selected != null && item.answer.includes(i);
            const wrongChoice = chosen && !correct;
            return (
              <li key={i}>
                <button onClick={() => choose(i)} disabled={selected != null}
                  className={`w-full text-left px-4 py-3 rounded-lg border active:scale-[0.99] transition
                    ${chosen ? "ring-1 dark:ring-zinc-400" : ""}
                    ${(correct || (selected != null && !item.answer.includes(selected!) && item.answer.includes(i))) ? "bg-green-50 border-green-400 dark:bg-green-900 dark:border-green-600 dark:text-zinc-100" : ""}
                    ${wrongChoice ? "bg-red-50 border-red-400 dark:bg-red-900 dark:border-red-600 dark:text-zinc-100" : "border-gray-200 bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"}`}>
                  <span className="mr-2 text-xs text-gray-500 dark:text-zinc-400">{i+1}.</span>{opt}
                </button>
              </li>
            );
          })}
        </ul>
        {selected != null && (
          <div className="mt-3 text-sm text-gray-600 dark:text-zinc-300">
            {isCorrect ? "Correct ✅" : "Incorrect ❌"}
            {item.explanation
              ? `– ${item.explanation}`
              : !isCorrect && item.answer.length === 1 && item.options[item.answer[0]]
                ? ` – Correct answer: ${item.options[item.answer[0]]}`
                : ""}
            {(item.references || item.printedPage) ? (
              <div className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                Refs: {Array.isArray(item.references) ? item.references.join(", ") : String(item.references || "")}
                {item.printedPage ? ` (p. ${item.printedPage})` : ""}
              </div>
            ) : null}
          </div>
        )}
      </div>

      <QuizBottomBar
        onPrevious={prev}
        previousDisabled={idx === 0}
        onNext={next}
        nextLabel={idx + 1 >= total ? "Finish" : "Next"}
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
	  <p className="hidden text-xs text-gray-500 dark:text-zinc-400 md:block">Keyboard: 1–4 select, ←/→ navigation, Enter = next, F = flag.</p>
    </div>
  );
}
