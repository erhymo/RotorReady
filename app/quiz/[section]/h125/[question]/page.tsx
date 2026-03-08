"use client";
import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import TopBarBackButton from "@/components/TopBarBackButton";
import { reportFlag, type FlagPayload } from "@/lib/flags";
import { useActiveModelVariant } from "@/lib/models/hooks";
import { modelScopedKey } from "@/lib/models/storage";
import { isEditableKeyboardTarget } from "@/lib/isEditableKeyboardTarget";
import FlagReasonDialog from "@/components/FlagReasonDialog";

type Item = {
  id: string;
  section: string;
  type: "single" | "multi";
  question: string;
  options: string[];
  answer: number[];
  explanation?: string;
  references?: string[];
  __file?: string;
};

type Session = {
  section: string;
  createdAt: string;
  items: Item[];
  answers: Array<number | null>;
  flags: boolean[];
};

export default function H125QuestionPage() {
  const router = useRouter();
  const params = useParams<{ section: string; question: string }>();
  const section = decodeURIComponent(params.section || "");
  const index = Math.max(0, (parseInt(params.question as string, 10) || 1) - 1);
  const { variant: activeVariant } = useActiveModelVariant();

  const key = `${modelScopedKey("h125q_session", activeVariant.id)}:${section}`;

  const [session, setSession] = React.useState<Session | null>(null);
  const [selected, setSelected] = React.useState<number | null>(null);

  const total = session?.items.length ?? 0;
  const [pendingFlag, setPendingFlag] = React.useState<FlagPayload | null>(null);

  const [copied, setCopied] = React.useState(false);


  React.useEffect(() => {
    try {
      const raw = sessionStorage.getItem(key);
      if (!raw) { router.replace(`/quiz/${encodeURIComponent(section)}`); return; }
      const s = JSON.parse(raw) as Session;
      if (!s.items?.length) { router.replace(`/quiz/${encodeURIComponent(section)}`); return; }
      if (index >= s.items.length) { router.replace(`/quiz/${encodeURIComponent(section)}/h125/result`); return; }
      setSession(s);
      setSelected(s.answers[index] ?? null);
    } catch {
      router.replace(`/quiz/${encodeURIComponent(section)}`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, key]);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!session) return;
      if (isEditableKeyboardTarget(e.target)) return;
      if (["1","2","3","4"].includes(e.key)) {
        const pick = parseInt(e.key) - 1;
        choose(pick);
      } else if (e.key === "ArrowRight" || e.key === "Enter") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key.toLowerCase() === "f") toggleFlag();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!session) return <div className="max-w-xl mx-auto p-4">Loading…</div>;

  const item = session.items[index];
  const isCorrect = selected != null ? item.answer.includes(selected) : null;

  function persist(mutator: (s: Session) => void) {
    const raw = sessionStorage.getItem(key); if (!raw) return;
    const s = JSON.parse(raw) as Session;
    mutator(s);
    sessionStorage.setItem(key, JSON.stringify(s));
    setSession({ ...s });
  }

  function updateResume(idxOverride?: number) {
    try {
      const amountToken = String(((session as any)?.amountToken ?? "all"));
      const resumeKey = `${modelScopedKey("quiz:resume", activeVariant.id)}:${section}:${amountToken}`;
      const raw = sessionStorage.getItem(key); if (!raw) return;
      const s = JSON.parse(raw) as Session;
      const snapshot = {
        section,
        variantId: activeVariant.id,
        amount: amountToken,
        items: s.items,
        idx: idxOverride != null ? idxOverride : index,
        answers: s.answers.map((a) => (a == null ? undefined : Number(a))),
        flags: s.flags,
        startedAt: Date.now(),
        updatedAt: Date.now(),
      };
      localStorage.setItem(resumeKey, JSON.stringify(snapshot));
    } catch {}
  }


  function choose(i: number) {
    if (selected != null) return; // lock after first answer
    persist((s) => { s.answers[index] = i; });
    setSelected(i);
    updateResume();
  }
  function toggleFlag() {
    persist((s) => { s.flags[index] = !s.flags[index]; });
    updateResume();
    const nowFlagged = !session?.flags[index];
    if (nowFlagged) {
      const basePayload: FlagPayload = {
        section: session!.section,
        sectionId: section,
        questionId: item.id,
        dataSource: "sections",
        dataFile: item.__file || null,
        snapshot: {
          question: item.question,
          options: item.options,
          explanation: item.explanation,
          references: item.references,
          answer: item.answer,
        },
      };
      setPendingFlag(basePayload);
    }
  }
  function next() {
    if (index + 1 >= total) {
      try {
        const amt = String(((session as any)?.amountToken ?? "all"));
        const resumeKey = `${modelScopedKey("quiz:resume", activeVariant.id)}:${section}:${amt}`;
        localStorage.removeItem(resumeKey);
      } catch {}
      router.push(`/quiz/${encodeURIComponent(section)}/h125/result`);
    } else {
      updateResume(index + 1);
      router.push(`/quiz/${encodeURIComponent(section)}/h125/${index + 2}`);
    }
  }
  function prev() {
    if (index > 0) {
      updateResume(index - 1);
      router.push(`/quiz/${encodeURIComponent(section)}/h125/${index}`);
    }
  }

  const progress = Math.round(((index + 1) / total) * 100);

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <div className="h-2 bg-gray-200 rounded dark:bg-zinc-800">
        <div className="h-2 bg-blue-600 rounded dark:bg-blue-700" style={{ width: `${progress}%` }} />
      </div>
      <div className="w-full flex items-center justify-between py-2 px-4 border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        <TopBarBackButton href={`/quiz/${encodeURIComponent(section)}`} />
        <div className="text-gray-500 dark:text-zinc-400">Question {index + 1} / {total}</div>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-zinc-300">Question {index + 1} / {total}</div>
        <div className="flex items-center gap-2">
          {activeVariant.id === "AW169" && (
            <a href="/aw169/abbreviations" className="px-2 py-1 rounded border text-xs bg-white dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-700">ABBR</a>
          )}
          <button onClick={toggleFlag} className={`px-3 py-1 rounded border text-sm ${session!.flags[index] ? "bg-amber-100 border-amber-400 dark:bg-amber-900 dark:border-amber-600 dark:text-zinc-100" : "bg-white dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-700"}`}>{session!.flags[index] ? "Flagged" : "Flag"}</button>
        </div>
      </div>


      <div className="bg-white dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100 rounded-xl border p-4">
        <div className="flex items-start justify-between gap-3">
          <p className="font-medium flex-1">{item.question}</p>
          <button onClick={() => { try { if (item?.id) { navigator.clipboard?.writeText(item.id); setCopied(true); window.setTimeout(() => setCopied(false), 1200); } } catch {} }} title="Click to copy ID" className="ml-2 text-[11px] font-mono text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200">
            ID: {item.id}{copied ? " \u2713" : ""}
          </button>
        </div>
        <ul className="mt-3 space-y-2">
          {item.options.map((opt, i) => {
            const chosen = selected === i;
            const answered = selected != null;
            const ok = answered && item.answer.includes(i);
            const wrong = answered && chosen && !ok;
            const highlightCorrect = answered && selected != null && !item.answer.includes(selected) && item.answer.includes(i);
            return (
              <li key={i}>
                <button
                  onClick={() => choose(i)}
                  disabled={selected != null}
                  className={`w-full text-left px-4 py-3 rounded-lg border active:scale-[0.99] transition
                    ${chosen ? "ring-1 dark:ring-zinc-400" : ""}
                    ${ok || highlightCorrect ? "bg-green-50 border-green-400 dark:bg-green-900 dark:border-green-600 dark:text-zinc-100" : ""}
                    ${wrong ? "bg-red-50 border-red-400 dark:bg-red-900 dark:border-red-600 dark:text-zinc-100" : "border-gray-200 bg-white dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100"}`}
                >
                  <span className="mr-2 text-xs text-gray-500 dark:text-zinc-400">{i + 1}.</span>{opt}
                </button>
              </li>
            );
          })}
        </ul>
        {selected != null && (
          <div className="mt-3 text-sm text-gray-600 dark:text-zinc-300">
            {isCorrect ? "Correct ✅" : "Incorrect ❌"}
            {item.explanation
              ? ` – ${item.explanation}`
              : !isCorrect && item.answer.length >= 1 && item.answer.map(i => item.options[i]).join(', ')
                ? ` – Correct answer: ${item.answer.map(i => item.options[i]).join(', ')}`
                : ""}
            {item.references?.length ? (
              <div className="text-xs text-gray-500 mt-1 dark:text-zinc-400">
                Refs: {item.references.join(", ")}
              </div>
            ) : null}
          </div>
        )}
      </div>

      <div className="w-full flex items-center justify-between py-4 px-4 border-t border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        <button onClick={prev} disabled={index===0} className="px-4 py-2 rounded-lg border bg-white dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-700 disabled:opacity-50">Previous</button>
        <span className="text-gray-500 dark:text-zinc-400">→ for Next</span>
        <div className="flex items-center gap-2">
      <FlagReasonDialog
        payload={pendingFlag}
        onComplete={(payload) => {
          if (!payload) return;
          reportFlag(payload);
          setPendingFlag(null);
        }}
      />

          <button onClick={next} disabled={selected==null} className="px-4 py-2 rounded-lg bg-gray-900 text-white dark:bg-zinc-900 dark:text-zinc-100 disabled:opacity-50">Next</button>
        </div>
      </div>

      <p className="text-xs text-gray-500 dark:text-zinc-400">Keyboard: 1–4 select, ←/→ navigation, Enter = next, F = flag.</p>
    </div>
  );
}

