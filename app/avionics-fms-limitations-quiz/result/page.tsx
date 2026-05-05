"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { buildInitialQuizResumeSession } from "@/lib/quiz/resumeSnapshot";
import { saveResult } from "@/lib/sync/results";
import { useActiveModelVariant } from "@/lib/models/hooks";
import { modelScopedKey } from "@/lib/models/storage";
import TopBarBackButton from "@/components/TopBarBackButton";

const SESSION_KEY = "avionics_session";
const WRONG_ONLY_SECTION_KEY = "avionics-fms-limitations";

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
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export default function AvionicsResultPage() {
  const [session, setSession] = useState<Session | null>(null);
  const { variant: activeVariant } = useActiveModelVariant();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSession(loadSession());
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

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

    const historyKey = modelScopedKey("rr_progress", activeVariant.id);
    const historyRaw = localStorage.getItem(historyKey);
    const history = historyRaw ? JSON.parse(historyRaw) : [];
    history.push(record);
    localStorage.setItem(historyKey, JSON.stringify(history));
    if (activeVariant.id === "AW169") {
      localStorage.removeItem("rr_progress");
    }

    const prefix = modelScopedKey("rr_progress_last_wrong", activeVariant.id);
    const storageKey = `${prefix}:${WRONG_ONLY_SECTION_KEY}`;
    const legacyKey = activeVariant.id === "AW169"
      ? `rr_progress_last_wrong:${WRONG_ONLY_SECTION_KEY}`
      : null;

    if (wrongIdx.length) {
      const items = wrongIdx.map((index) => session.items[index]);
      const wrongSession: Session = {
        section: session.section,
        ...buildInitialQuizResumeSession(items),
        createdAt: new Date().toISOString(),
        answers: Array(items.length).fill(null),
      };
      localStorage.setItem(storageKey, JSON.stringify(wrongSession));
      if (legacyKey) {
        localStorage.setItem(legacyKey, JSON.stringify(wrongSession));
      }
    } else {
      localStorage.removeItem(storageKey);
      if (legacyKey) localStorage.removeItem(legacyKey);
    }

    try {
      saveResult({ section: session.section, total, correct, percent, at: new Date().toISOString() });
    } catch {}
  }, [session, total, correct, wrongIdx, activeVariant.id]);

  if (!session) return <div className="max-w-xl mx-auto p-4">No active session.</div>;

  const percent = total ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <div className="w-full flex items-center py-1">
        <TopBarBackButton href="/avionics-fms-limitations-quiz" />
      </div>
	      <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">Result</h1>
	      <div className="rounded-xl border-l-4 border-blue-600 bg-blue-50/40 p-4 dark:border-blue-400 dark:bg-zinc-900 dark:text-white">
        <div>Answered: <b>{total}</b></div>
        <div>Correct: <b>{correct}</b></div>
        <div>Percent: <b>{percent}%</b></div>
      </div>

	      <div className="grid gap-2 sm:flex">
	        <Link href="/avionics-fms-limitations-quiz" className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#2E6EA1] px-4 py-2 font-semibold text-white">Try again</Link>
	        <Link href="/" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">Home</Link>
      </div>

	      <div className="rounded-xl border-l-4 border-emerald-600 bg-emerald-50/40 p-4 dark:border-emerald-400 dark:bg-zinc-900 dark:text-white">
        <div className="font-semibold mb-2">Next steps</div>
        <ul className="list-disc ml-5 text-sm text-slate-700 dark:text-emerald-100">
          <li>Click <b>“Practice wrong answers only”</b> on the start page to repeat the difficult questions.</li>
	          <li>Follow your progress under <b>Settings</b>.</li>
        </ul>
      </div>
    </div>
  );
}
