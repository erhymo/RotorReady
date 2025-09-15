"use client";
import * as React from "react";
import { FlagIcon } from "@/components/FlagIcon";

export default function LimitationsQuizAdmin() {
  const [questions, setQuestions] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [hidden, setHidden] = React.useState<number[]>(() => {
    if (typeof window !== "undefined") {
      try {
        return JSON.parse(localStorage.getItem("hiddenQuestions") || "[]");
      } catch {
        return [];
      }
    }
    return [];
  });

  React.useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch("/data/aw169-limitations-quiz.json");
        if (!res.ok) throw new Error("Kunne ikke hente quiz-data");
        const data = await res.json();
        setQuestions(data.questions);
      } catch (e: any) {
        setError(e.message || "Ukjent feil");
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, []);

  function toggleHidden(id: number) {
    setHidden((prev) => {
      let arr = [...prev];
      if (arr.includes(id)) {
        arr = arr.filter((q) => q !== id);
      } else {
        arr.push(id);
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("hiddenQuestions", JSON.stringify(arr));
      }
      return arr;
    });
  }

  if (loading) return <div>Laster ...</div>;
  if (error) return <div className="text-red-600">Feil: {error}</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Admin: Skjul spørsmål</h1>
      <ul className="space-y-2">
        {questions.map((q, idx) => (
          <li key={q.id} className="flex items-center gap-2 p-2 border rounded bg-white">
            <button
              className={`w-6 h-6 flex items-center justify-center rounded-full border border-gray-300 transition ${hidden.includes(q.id) ? "bg-red-500" : "bg-gray-100"}`}
              title={hidden.includes(q.id) ? "Vis spørsmålet igjen" : "Skjul dette spørsmålet"}
              onClick={() => toggleHidden(q.id)}
              type="button"
            >
              <FlagIcon filled className={`w-4 h-4 ${hidden.includes(q.id) ? "text-white" : "text-red-500"}`} />
            </button>
            <span className={hidden.includes(q.id) ? "line-through text-gray-400" : ""}>{q.q}</span>
          </li>
        ))}
      </ul>
    </div>
  );
  // Denne siden er fjernet. Bruk /quiz i stedet.
  return null;
}
