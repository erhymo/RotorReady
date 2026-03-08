"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { buildInitialQuizResumeSession } from "@/lib/quiz/resumeSnapshot";
import { saveResult } from "@/lib/sync/results";
import { useActiveModelVariant } from "@/lib/models/hooks";
import { modelScopedKey } from "@/lib/models/storage";
import TopBarBackButton from "@/components/TopBarBackButton";

type Item = {
  id: string;
  question: string;
  options: string[];
  answer: number[];
  explanation?: string;
  references?: string[];
  section?: string;
};

type Session = {
  section: string;
  createdAt: string;
  items: Item[];
  answers: Array<number | null>;
  flags: boolean[];
};

function loadSession(): Session | null {
  try {
    const raw = sessionStorage.getItem("avionics_session");
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export default function AvionicsResultPage() {
  const [session] = useState<Session | null>(() => loadSession());
  const { variant: activeVariant } = useActiveModelVariant();

  const { total, correct, wrongIdx } = useMemo(() => {
    if (!session) return { total: 0, correct: 0, wrongIdx: [] as number[] };
    const total = session.items.length;
    let correct = 0;
    const wrongIdx: number[] = [];
    session.items.forEach((item, index) => {
      const picked = session.answers[index];
      const ok = picked != null && item.answer.includes(picked);
      if (ok) correct += 1;
      else wrongIdx.push(index);
    });
    return { total, correct, wrongIdx };
  }, [session]);

  useEffect(() => {
    if (!session) return;
    const percent = total ? (correct / total) * 100 : 0;
    const record = { section: session.section, total, correct, percent, at: new Date().toISOString() };

    try {
      const historyKey = modelScopedKey("rr_progress", activeVariant.id);
      const raw = localStorage.getItem(historyKey);
      const arr = raw ? JSON.parse(raw) : [];
      arr.push(record);
      localStorage.setItem(historyKey, JSON.stringify(arr));
      if (activeVariant.id === "AW169") {
        localStorage.removeItem("rr_progress");
      }
    } catch {}

    const sectionKey = "avionics-fms-limitations";
    const scopedKey = `${modelScopedKey("rr_progress_last_wrong", activeVariant.id)}:${sectionKey}`;

    if (wrongIdx.length) {
      const items = wrongIdx.map((index) => session.items[index]);
      const wrongSession: Session = {
        section: session.section,
        ...buildInitialQuizResumeSession(items),
        createdAt: new Date().toISOString(),
        answers: Array(items.length).fill(null),
      };
      localStorage.setItem(scopedKey, JSON.stringify(wrongSession));
      if (activeVariant.id === "AW169") {
        localStorage.setItem(`rr_progress_last_wrong:${sectionKey}`, JSON.stringify(wrongSession));
      }
    } else {
      localStorage.removeItem(scopedKey);
      if (activeVariant.id === "AW169") {
        localStorage.removeItem(`rr_progress_last_wrong:${sectionKey}`);
      }
    }

    try {
      saveResult({ section: session.section, total, correct, percent, at: new Date().toISOString() });
    } catch {}
  }, [session, total, correct, wrongIdx, activeVariant.id]);

  if (!session) return <div className="max-w-xl mx-auto p-4">No active session.</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <div className="w-full flex items-center py-1">
        <TopBarBackButton href="/avionics-fms-limitations-quiz" />
      </div>
      <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-300 drop-shadow">Result</h1>
      <div className="rounded-xl border-l-4 border-blue-600 bg-blue-50/40 dark:border-blue-400 dark:bg-gradient-to-r dark:from-blue-900 dark:to-blue-800/80 p-4 shadow-lg dark:text-white">
        <div>Answered: <b>{total}</b></div>
        <div>Correct: <b>{correct}</b></div>
        <div>Percent: <b>{Math.round((correct / total) * 100)}%</b></div>
      </div>

      <div className="flex gap-2">
        <Link href="/avionics-fms-limitations-quiz" className="px-4 py-2 rounded-lg bg-blue-600 text-white">Try again</Link>
        <Link href="/" className="px-4 py-2 rounded-lg bg-emerald-600 text-white">Home</Link>
      </div>

      <div className="rounded-xl border-l-4 border-emerald-600 bg-emerald-50/40 dark:border-emerald-400 dark:bg-gradient-to-r dark:from-emerald-900 dark:to-emerald-800/80 p-4 shadow-lg dark:text-white">
        <div className="font-semibold mb-2">Next steps</div>
        <ul className="list-disc ml-5 text-sm text-slate-700 dark:text-emerald-100">
          <li>Click <b>“Practice wrong answers only”</b> on the start page to repeat the difficult questions.</li>
          <li>Follow your progress under <b>My Page</b>.</li>
        </ul>
      </div>
    </div>
  );
}
