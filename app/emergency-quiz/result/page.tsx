"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { saveResult } from "@/lib/sync/results";
import { useActiveModelVariant } from "@/lib/models/hooks";
import { modelScopedKey } from "@/lib/models/storage";
import TopBarBackButton from "@/components/TopBarBackButton";

const SESSION_KEY = "emergq_session";
const SECTION_ID = "emergency_procedures";

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

export default function EmergencyResultPage() {
  const [session, setSession] = useState<Session | null>(null);
  const { variant: activeVariant } = useActiveModelVariant();

  useEffect(() => {
    setSession(loadSession());
  }, []);

  const { total, correct, wrongIdx } = useMemo(() => {
    if (!session) return { total: 0, correct: 0, wrongIdx: [] as number[] };
    const total = session.items.length;
    let correct = 0;
    const wrongIdx: number[] = [];
    session.items.forEach((item, idx) => {
      const picked = session.answers[idx];
      const ok = picked != null && item.answer.includes(picked);
      if (ok) correct++;
      else wrongIdx.push(idx);
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

    const normalizedSection = (typeof session.section === "string" && session.section.length)
      ? session.section.toLowerCase()
      : SECTION_ID;

    const prefix = modelScopedKey("rr_progress_last_wrong", activeVariant.id);
    const storageKey = `${prefix}:${normalizedSection}`;
    const legacyKey = activeVariant.id === "AW169" ? `rr_progress_last_wrong:${normalizedSection}` : null;

    if (wrongIdx.length) {
      const items = wrongIdx.map((idx) => session.items[idx]);
      const answers = wrongIdx.map(() => null as number | null);
      const flags = wrongIdx.map(() => false);
      const wrongSession: Session = {
        section: session.section,
        createdAt: new Date().toISOString(),
        items,
        answers,
        flags,
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
    } catch {
      // best effort
    }
  }, [session, total, correct, wrongIdx, activeVariant.id]);

  if (!session) return <div className="max-w-xl mx-auto p-4">No active session.</div>;

  const percent = total ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <div className="w-full flex items-center py-1">
        <TopBarBackButton href="/emergency-quiz" />
      </div>
      <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-300 drop-shadow">Result</h1>
      <div className="rounded-xl border-l-4 border-blue-600 bg-blue-50/40 dark:border-blue-400 dark:bg-gradient-to-r dark:from-blue-900 dark:to-blue-800/80 p-4 shadow-lg dark:text-white">
        <div>Answered: <b>{total}</b></div>
        <div>Correct: <b>{correct}</b></div>
        <div>Percent: <b>{percent}%</b></div>
      </div>

      <div className="flex gap-2">
        <Link href="/emergency-quiz" className="px-4 py-2 rounded-lg bg-blue-600 text-white">Try again</Link>
        <Link href="/" className="px-4 py-2 rounded-lg bg-emerald-600 text-white">Home</Link>
      </div>

      <div className="rounded-xl border-l-4 border-emerald-600 bg-emerald-50/40 dark:border-emerald-400 dark:bg-gradient-to-r dark:from-emerald-900 dark:to-emerald-800/80 p-4 shadow-lg dark:text-white">
        <div className="font-semibold mb-2">Next steps</div>
        <ul className="list-disc ml-5 text-sm text-slate-700 dark:text-emerald-100">
          <li>Press <b>“Practice wrong answers only”</b> to repeat the questions you missed.</li>
          <li>See your progress under <b>My Page</b> for an overview of your training.</li>
        </ul>
      </div>
    </div>
  );
}
