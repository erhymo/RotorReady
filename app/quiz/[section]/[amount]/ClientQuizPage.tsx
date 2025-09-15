"use client";
import { useEffect, useState } from "react";
import ClientQuiz from "./ClientQuiz";

type QuizItem = {
  id: string;
  section: string;
  type: "single" | "multi";
  question: string;
  options: string[];
  answer: number[];
  explanation?: string;
  references?: string[];
};

export default function ClientQuizPage({ section, amount }: { section: string; amount: number }) {
  const [questions, setQuestions] = useState<QuizItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = `/quiz-data/sections/${section}.json`;
    console.log("Fetching quiz data from", url);
    fetch(url)
      .then((r) => {
        console.log("Fetch response status:", r.status);
        if (!r.ok) throw new Error("Fant ikke seksjonen");
        return r.json();
      })
      .then((data) => {
        console.log("Fetched data:", data);
        if (!data.items || !Array.isArray(data.items)) throw new Error("Ugyldig dataformat");
        const shuffled = [...data.items].sort(() => Math.random() - 0.5).slice(0, amount);
        setQuestions(shuffled);
      })
      .catch((e) => {
        console.error("Quiz fetch error:", e);
        setError(e.message || "Feil ved lasting av spørsmål");
      });
  }, [section, amount]);

  if (error) {
    return (
      <div className="min-h-screen grid place-items-center p-8">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">{error}</div>
          <div className="text-slate-600">Seksjon "{section}"</div>
        </div>
      </div>
    );
  }
  if (!questions) {
    return <div className="min-h-screen grid place-items-center p-8 text-center">Laster spørsmål ...</div>;
  }
  return <ClientQuiz section={section} initial={questions} />;
}
