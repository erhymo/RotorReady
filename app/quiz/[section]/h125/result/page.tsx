"use client";
import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { modelScopedKey } from "@/lib/models/storage";
import { useActiveModelVariant } from "@/lib/models/hooks";
import TopBarBackButton from "@/components/TopBarBackButton";

export default function H125ResultPage() {
  const router = useRouter();
  const params = useParams<{ section: string }>();
  const section = decodeURIComponent(params.section || "");
  const { variant: activeVariant } = useActiveModelVariant();
  const key = `${modelScopedKey("h125q_session", activeVariant.id)}:${section}`;

  const [summary, setSummary] = React.useState<{correct: number; total: number} | null>(null);

  React.useEffect(() => {
    try {
      const raw = sessionStorage.getItem(key);
      if (!raw) { router.replace(`/quiz/${encodeURIComponent(section)}`); return; }
      const s = JSON.parse(raw) as { section: string; items: { answer: number[] }[]; answers: Array<number|null> };
      const total = s.items.length;
      const wrongIdx: number[] = [];
      const correct = s.answers.reduce((acc, a, i) => {
        const ok = a != null && s.items[i].answer.includes(a);
        if (!ok) wrongIdx.push(i);
        return acc + (ok ? 1 : 0);
      }, 0);
      setSummary({ correct, total });

      // Persist last-wrong set for this section (model-scoped)
      const normalized = (typeof s.section === "string" && s.section.length) ? s.section.toLowerCase() : section.toLowerCase();
      const prefix = modelScopedKey("rr_progress_last_wrong", activeVariant.id);
      const storageKey = `${prefix}:${normalized}`;
      if (wrongIdx.length) {
        const items = wrongIdx.map((i) => s.items[i]);
        const answers = wrongIdx.map(() => null as number | null);
        const flags = wrongIdx.map(() => false);
        const wrongSession = { section: normalized, createdAt: new Date().toISOString(), items, answers, flags };
        localStorage.setItem(storageKey, JSON.stringify(wrongSession));
        // Maintain rolling history of last 10 wrong sessions
        const histKey = `${modelScopedKey("rr_wrong_history", activeVariant.id)}:${normalized}`;
        const rawHist = localStorage.getItem(histKey);
        let hist: typeof wrongSession[] = Array.isArray(rawHist ? JSON.parse(rawHist) : null) ? JSON.parse(rawHist!) : [];
        hist.push(wrongSession);
        if (hist.length > 10) hist = hist.slice(hist.length - 10);
        localStorage.setItem(histKey, JSON.stringify(hist));
      } else {
        localStorage.removeItem(storageKey);
      }
    } catch {
      router.replace(`/quiz/${encodeURIComponent(section)}`);
    }
  }, [key, router, section, activeVariant.id]);

  if (!summary) return <div className="min-h-screen grid place-items-center p-6">Loading…</div>;

  const percent = Math.round((summary.correct / summary.total) * 100);

  function restart() {
    router.replace(`/quiz/${encodeURIComponent(section)}`);
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <div className="w-full flex items-center py-1">
        <TopBarBackButton href={`/quiz/${encodeURIComponent(section)}`} />
      </div>
      <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-300 drop-shadow">Result</h1>
      <div className="rounded-xl border-l-4 border-blue-600 bg-blue-50/40 dark:border-blue-400 dark:bg-gradient-to-r dark:from-blue-900 dark:to-blue-800/80 p-4 shadow-lg dark:text-white">
        <div>Answered: <b>{summary.total}</b></div>
        <div>Correct: <b>{summary.correct}</b></div>
        <div>Percent: <b>{percent}%</b></div>
      </div>
      <div className="flex gap-2">
        <button className="px-4 py-2 rounded-lg bg-blue-600 text-white" onClick={restart}>Try again</button>
        <button onClick={() => {
          try {
            const raw = sessionStorage.getItem(key);
            if (!raw) return;
            const s = JSON.parse(raw) as { section: string; items: { answer: number[] }[]; answers: Array<number|null> };
            const wrongIdx: number[] = [];
            s.items.forEach((it, i) => {
              const picked = s.answers[i];
              const ok = picked != null && it.answer.includes(picked);
              if (!ok) wrongIdx.push(i);
            });
            if (!wrongIdx.length) { alert("No wrong answers in this round."); return; }
            const items = wrongIdx.map(i => s.items[i]);
            const answers = wrongIdx.map(() => null as number | null);
            const flags = wrongIdx.map(() => false);
            const wrongSession = { section: s.section, createdAt: new Date().toISOString(), items, answers, flags };
            sessionStorage.setItem(key, JSON.stringify(wrongSession));
            router.replace(`/quiz/${encodeURIComponent(section)}/h125/1`);
          } catch {}
        }} className="px-4 py-2 rounded-lg bg-emerald-600 text-white">Practice wrong answers only</button>
        <a href="/" className="px-4 py-2 rounded-lg bg-emerald-600/80 text-white">Home</a>
      </div>
      <div className="rounded-xl border-l-4 border-emerald-600 bg-emerald-50/40 dark:border-emerald-400 dark:bg-gradient-to-r dark:from-emerald-900 dark:to-emerald-800/80 p-4 shadow-lg dark:text-white">
        <div className="font-semibold mb-2">Next steps</div>
        <ul className="list-disc ml-5 text-sm text-slate-700 dark:text-emerald-100">
          <li>Press <b>“Practice wrong answers only”</b> to repeat the questions you missed.</li>
          <li>See your progress under <b>My Page</b>.</li>
        </ul>
      </div>
    </div>
  );
}

