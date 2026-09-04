"use client";
import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import TopBarBackButton from "@/components/TopBarBackButton";
import QuizBottomBar from "@/components/QuizBottomBar";
import Link from "next/link";
import { useActiveModelVariant } from "@/lib/models/hooks";
import { isEditableKeyboardTarget } from "@/lib/isEditableKeyboardTarget";
import { clearQuizResumeSnapshotForSession, syncQuizResumeSnapshot } from "@/lib/quiz/resumeSnapshot";

import { reportFlag, type FlagPayload } from "@/lib/flags";
import FlagReasonDialog from "@/components/FlagReasonDialog";

const SECTION_ID = "limitations" as const;

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
  amountToken?: string;
};

function loadSession(): Session | null {
  try { const raw = sessionStorage.getItem("limq_session"); return raw ? JSON.parse(raw) as Session : null; } catch { return null; }
}
function saveSession(s: Session) { sessionStorage.setItem("limq_session", JSON.stringify(s)); }



export default function LimitationsQuestionClient() {
  const router = useRouter();
  const params = useParams<{question: string}>();
  const idx = Math.max(0, (parseInt(((params as any)?.question || "1")) || 1) - 1);

  const [session, setSession] = React.useState<Session | null>(null);
  const [selected, setSelected] = React.useState<number | null>(null);
  const total = session?.items.length ?? 0;
  const [pendingFlag, setPendingFlag] = React.useState<FlagPayload | null>(null);

  const [copied, setCopied] = React.useState(false);

  const { variant: activeVariant } = useActiveModelVariant();

  React.useEffect(() => {
    const s = loadSession();
    if (!s || !s.items?.length) { router.replace("/limitations-quiz"); return; }
    if (idx >= s.items.length) { router.replace("/limitations-quiz/result"); return; }
    setSession(s);
    setSelected(s.answers[idx] ?? null);
    syncQuizResumeSnapshot(activeVariant.id, SECTION_ID, idx, s);
  }, [idx]);

  function choose(i: number) {
    if (selected != null) return; // lock after first answer
    const s = loadSession(); if (!s) return;
    s.answers[idx] = i;
    saveSession(s); setSession(s); setSelected(i);
    syncQuizResumeSnapshot(activeVariant.id, SECTION_ID, idx, s);
  }

  function toggleFlag() {
    const s = loadSession(); if (!s) return;
    const currentItem = s.items[idx];
    if (!currentItem) return;
    s.flags[idx] = !s.flags[idx];
    const nowFlagged = s.flags[idx];
    saveSession(s); setSession({ ...s });
    syncQuizResumeSnapshot(activeVariant.id, SECTION_ID, idx, s);
    if (nowFlagged) {
      const basePayload: FlagPayload = {
        section: s.section,
        sectionId: "limitations",
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
    const s = loadSession() || session;
    if (!s) {
      router.push("/limitations-quiz");
      return;
    }
    if (idx + 1 >= total) {
      clearQuizResumeSnapshotForSession(activeVariant.id, SECTION_ID, s);
      router.push("/limitations-quiz/result");
    } else {
      syncQuizResumeSnapshot(activeVariant.id, SECTION_ID, idx + 1, s);
      router.push(`/limitations-quiz/${idx + 2}`);
    }
  }

  function prev() {
    const s = loadSession() || session;
    if (!s) {
      router.push("/limitations-quiz");
      return;
    }
    if (idx > 0) {
      const targetIdx = idx - 1;
      syncQuizResumeSnapshot(activeVariant.id, SECTION_ID, targetIdx, s);
      router.push(`/limitations-quiz/${targetIdx + 1}`);
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

  const item = session.items[idx];
  const isCorrect = selected != null ? item.answer.includes(selected) : null;

  const progress = Math.round(((idx+1) / total) * 100);

  return (
  <div className="max-w-2xl mx-auto p-4 pb-28 space-y-4">
      <div className="h-2 bg-gray-200 rounded dark:bg-zinc-800">
        <div className="h-2 bg-blue-600 rounded dark:bg-blue-700" style={{ width: `${progress}%` }} />
      </div>
      {/* Top bar med tilbakeknapp */}
      <div className="w-full flex items-center justify-between py-2 px-4 border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
        <TopBarBackButton href="/limitations-quiz" />
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
            const isAnswered = selected != null;
            const isCorrect = isAnswered && item.answer.includes(i);
            const isWrong = isAnswered && chosen && !isCorrect;
            // Highlight the correct answer in green if the user answered incorrectly
            const highlightCorrect = isAnswered && !item.answer.includes(selected!) && item.answer.includes(i);
            return (
              <li key={i}>
                <button onClick={() => choose(i)} disabled={selected != null}
                  className={`w-full text-left px-4 py-3 rounded-lg border active:scale-[0.99] transition
                    ${chosen ? "ring-1 dark:ring-zinc-400" : ""}
                    ${(isCorrect || highlightCorrect) ? "bg-green-50 border-green-400 dark:bg-green-900 dark:border-green-600 dark:text-zinc-100" : ""}
                    ${isWrong ? "bg-red-50 border-red-400 dark:bg-red-900 dark:border-red-600 dark:text-zinc-100" : "border-gray-200 bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"}`}>
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
              : !isCorrect && item.answer.length >= 1 && item.answer.map(idx => item.options[idx]).join(', ')
                ? ` – Correct answer: ${item.answer.map(idx => item.options[idx]).join(', ')}`
                : ""}
            {(item.references || item.printedPage) ? (
              <div className="text-xs text-gray-500 mt-1 dark:text-zinc-400">
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
