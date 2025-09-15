"use client";
import * as React from "react";
import { useRouter } from "next/navigation";

export default function EngineQuizResult() {
  const router = useRouter();
  const [session, setSession] = React.useState<any>(null);

  React.useEffect(() => {
    const raw = sessionStorage.getItem("engineq_session");
    if (!raw) { router.replace("/engine-systems-quiz"); return; }
    setSession(JSON.parse(raw));
  }, [router]);

  if (!session) return <div className="max-w-xl mx-auto p-4">Laster…</div>;

  const total = session.items.length;
  const correct = session.answers.filter((a: number|null, i: number) => a != null && session.items[i].answer.includes(a)).length;
  const percent = Math.round((correct/total)*100);

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Resultat</h1>
      <div className="text-lg">Du fikk <b>{correct}</b> av <b>{total}</b> riktige ({percent}%).</div>
      <button className="mt-4 px-4 py-2 rounded-lg bg-gray-900 text-white" onClick={()=>router.replace("/engine-systems-quiz")}>Prøv igjen</button>
    </div>
  );
}
