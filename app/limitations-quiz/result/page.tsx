"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { buildInitialQuizResumeSession } from "@/lib/quiz/resumeSnapshot";
import { saveResult } from "@/lib/sync/results";
import { useActiveModelVariant } from "@/lib/models/hooks";
import { modelScopedKey } from "@/lib/models/storage";
import TopBarBackButton from "@/components/TopBarBackButton";

type Item = { id: string; question: string; options: string[]; answer: number[]; explanation?: string; references?: string[]; section?: string };
type Session = { section: string; createdAt: string; items: Item[]; answers: Array<number|null>; flags: boolean[] };

function loadSession(): Session | null {
  try { const raw = sessionStorage.getItem("limq_session"); return raw ? JSON.parse(raw) as Session : null; }
  catch { return null; }
}

export default function ResultPage() {
  const router = useRouter();
  const [s, setS] = useState<Session | null>(null);
  const { variant: activeVariant } = useActiveModelVariant();

  useEffect(() => { setS(loadSession()); }, []);

  const { total, correct, wrongIdx } = useMemo(() => {
    if (!s) return { total: 0, correct: 0, wrongIdx: [] as number[] };
    const total = s.items.length;
    let correct = 0;
    const wrongIdx: number[] = [];
    s.items.forEach((it, i) => {
      const picked = s.answers[i];
      const ok = picked != null && it.answer.includes(picked);
      if (ok) correct++; else wrongIdx.push(i);
    });
    return { total, correct, wrongIdx };
  }, [s]);

  useEffect(() => {
    if (!s) return;
    const percent = total ? (correct/total)*100 : 0;
    const rec = { section: s.section, total, correct, percent, at: new Date().toISOString() };
    const historyKey = modelScopedKey("rr_progress", activeVariant.id);
    const raw = localStorage.getItem(historyKey);
    const arr = raw ? JSON.parse(raw) : [];
    arr.push(rec);
    localStorage.setItem(historyKey, JSON.stringify(arr));
    if (activeVariant.id === "AW169") {
      localStorage.removeItem("rr_progress");
    }

    const sectionKey = (typeof s.section === "string" && s.section.length)
      ? s.section.toLowerCase()
      : "limitations";

    const prefix = modelScopedKey("rr_progress_last_wrong", activeVariant.id);
    const storageKey = `${prefix}:${sectionKey}`;
    const originalKey = `rr_progress_last_wrong:${sectionKey}`;

    if (wrongIdx.length) {
      const items = wrongIdx.map(i => s.items[i]);
      const wrongSession: Session = {
        section: s.section,
        ...buildInitialQuizResumeSession(items),
        createdAt: new Date().toISOString(),
        answers: Array(items.length).fill(null),
      };
      // Store single last-wrong
      localStorage.setItem(storageKey, JSON.stringify(wrongSession));
      if (activeVariant.id === "AW169") {
        localStorage.setItem(originalKey, JSON.stringify(wrongSession));
      }
      // Maintain rolling history of last 10 wrong sessions
      const histKey = `${modelScopedKey("rr_wrong_history", activeVariant.id)}:${sectionKey}`;
      const rawHist = localStorage.getItem(histKey);
      let hist: Session[] = Array.isArray(rawHist ? JSON.parse(rawHist) : null) ? JSON.parse(rawHist!) : [];
      hist.push(wrongSession);
      if (hist.length > 10) hist = hist.slice(hist.length - 10);
      localStorage.setItem(histKey, JSON.stringify(hist));
    } else {
      localStorage.removeItem(storageKey);
      if (activeVariant.id === "AW169") {
        localStorage.removeItem(originalKey);
      }
    }

    // cloud sync (best effort)
    try {
      saveResult({ section: s.section, total, correct, percent, at: new Date().toISOString() });
    } catch {}
  }, [s, total, correct, wrongIdx, activeVariant.id]);

  if (!s) return <div className="max-w-xl mx-auto p-4">No active session.</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <div className="w-full flex items-center py-1">
        <TopBarBackButton href="/limitations-quiz" />
      </div>
      <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-300 drop-shadow">Result</h1>
  <div className="rounded-xl border-l-4 border-blue-600 bg-blue-50/40 dark:border-blue-400 dark:bg-gradient-to-r dark:from-blue-900 dark:to-blue-800/80 p-4 shadow-lg dark:text-white">
        <div>Answered: <b>{total}</b></div>
        <div>Correct: <b>{correct}</b></div>
        <div>Percent: <b>{Math.round((correct/total)*100)}%</b></div>
      </div>

      <div className="flex gap-2">
        <Link href="/limitations-quiz" className="px-4 py-2 rounded-lg bg-blue-600 text-white">Try again</Link>
        <button onClick={() => {
          if (!s) return;
          const wrongIdx: number[] = [];
          s.items.forEach((it, i) => {
            const picked = s.answers[i];
            const ok = picked != null && it.answer.includes(picked);
            if (!ok) wrongIdx.push(i);
          });
          if (!wrongIdx.length) { alert("No wrong answers in this round."); return; }
          const items = wrongIdx.map(i => s.items[i]);
          const limSession = {
            section: s.section,
            ...buildInitialQuizResumeSession(items),
            createdAt: new Date().toISOString(),
            answers: Array(items.length).fill(null),
          };
          sessionStorage.setItem("limq_session", JSON.stringify(limSession));
          router.push("/limitations-quiz/1");
        }} className="px-4 py-2 rounded-lg bg-emerald-600 text-white">Practice wrong answers only</button>
        <Link href="/" className="px-4 py-2 rounded-lg bg-emerald-600/80 text-white">Home</Link>
      </div>

  <div className="rounded-xl border-l-4 border-emerald-600 bg-emerald-50/40 dark:border-emerald-400 dark:bg-gradient-to-r dark:from-emerald-900 dark:to-emerald-800/80 p-4 shadow-lg dark:text-white">
        <div className="font-semibold mb-2">Next steps</div>
        <ul className="list-disc ml-5 text-sm text-slate-700 dark:text-emerald-100">
          <li>Go to <b>Limitations</b> and press <b>“Practice wrong answers only”</b> for focused training.</li>
          <li>See your progress under <b>My Page</b> (30-day overview is coming in the sync version).</li>
        </ul>
      </div>
    </div>
  );
}
