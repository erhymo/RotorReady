"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import TopBarBackButton from "@/components/TopBarBackButton";
import { useActiveModelVariant } from "@/lib/models/hooks";
import { modelScopedKey } from "@/lib/models/storage";
import { buildInitialQuizResumeSession, clearQuizResumeSnapshot } from "@/lib/quiz/resumeSnapshot";

export default function EngineQuizResult() {
  const router = useRouter();
  const { variant: activeVariant } = useActiveModelVariant();
  const [session, setSession] = React.useState<any>(null);

  React.useEffect(() => {
    const raw = sessionStorage.getItem("engineq_session");
    if (!raw) { router.replace("/engine-systems-quiz"); return; }
    const s = JSON.parse(raw);
    setSession(s);
    try {
      clearQuizResumeSnapshot(activeVariant.id, "engine-systems", String(s?.amountToken ?? "all"));
    } catch {}
  }, [router, activeVariant.id]);

  React.useEffect(() => {
    if (!session) return;

    const wrongIdx = session.answers
      .map((answer: number | null, index: number) => (answer != null && session.items[index].answer.includes(answer) ? -1 : index))
      .filter((index: number) => index >= 0);

    const sectionKey = "engine-systems";
    const scopedKey = `${modelScopedKey("rr_progress_last_wrong", activeVariant.id)}:${sectionKey}`;

    if (wrongIdx.length) {
      const items = wrongIdx.map((index: number) => session.items[index]);
      const wrongSession = {
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
  }, [session, activeVariant.id]);

	if (!session) return <div className="max-w-xl mx-auto p-4 dark:text-zinc-100">Loading…</div>;

  const total = session.items.length;
  const correct = session.answers.filter((a: number|null, i: number) => a != null && session.items[i].answer.includes(a)).length;
  const percent = Math.round((correct/total)*100);

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <div className="w-full flex items-center py-1">
        <TopBarBackButton href="/engine-systems-quiz" />
      </div>
      <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-300 drop-shadow">Result</h1>
      <div className="rounded-xl border-l-4 border-blue-600 bg-blue-50/40 dark:border-blue-400 dark:bg-gradient-to-r dark:from-blue-900 dark:to-blue-800/80 p-4 shadow-lg dark:text-white">
        <div>Answered: <b>{total}</b></div>
        <div>Correct: <b>{correct}</b></div>
        <div>Percent: <b>{percent}%</b></div>
      </div>
      <div className="flex gap-2">
        <button className="px-4 py-2 rounded-lg bg-blue-600 text-white" onClick={() => router.replace("/engine-systems-quiz")}>Try again</button>
      </div>
    </div>
  );
}
