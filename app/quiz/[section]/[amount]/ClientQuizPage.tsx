"use client";
import { useEffect, useState } from "react";
import ClientQuiz from "./ClientQuiz";
import { useActiveModelVariant } from "@/lib/models/hooks";
import { loadSectionOffline } from "@/lib/offline";
import { modelScopedKey } from "@/lib/models/storage";

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

export default function ClientQuizPage({ section, amount }: { section: string; amount: number | null }) {
  const [questions, setQuestions] = useState<QuizItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { variant: activeVariant, loading: variantLoading } = useActiveModelVariant();

  useEffect(() => {
    if (variantLoading) return;
    let cancelled = false;

    async function load() {
      // 0) Sjekk om det finnes en sesjons-override (f.eks. "Øv kun på feil")
      try {
        const overrideKey = `${modelScopedKey("quiz_session_override", activeVariant.id)}:${section}`;
        const raw = sessionStorage.getItem(overrideKey);
        if (!cancelled && raw) {
          const data = JSON.parse(raw) as { items?: QuizItem[] };
          if (Array.isArray(data.items) && data.items.length) {
            const shuffled = [...data.items].sort(() => Math.random() - 0.5);
            const limited = typeof amount === "number" ? shuffled.slice(0, amount) : shuffled;
            setQuestions(limited);
            setError(null);
            // Tøm override etter bruk for å unngå utilsiktet gjenbruk
            sessionStorage.removeItem(overrideKey);
            return;
          }
        }
      } catch {}

      // 1) Forsøk lokalt (offline) først
      try {
        const offline = loadSectionOffline<{ items?: QuizItem[] }>(section, activeVariant.id);
        if (!cancelled && offline && Array.isArray(offline.items)) {
          const shuffled = [...offline.items].sort(() => Math.random() - 0.5);
          const limited = typeof amount === "number" ? shuffled.slice(0, amount) : shuffled;
          setQuestions(limited);
          setError(null);
          return;
        }
      } catch {
        // Ignorer og prøv nettverk
      }

      // 2) Deretter forsøk nettverk som vanlig
      const urls = [
        `/model-data/${activeVariant.id}/sections/${section}.json`,
        `/quiz-data/sections/${section}.json`,
      ];
      for (const url of urls) {
        try {
          const res = await fetch(url, { cache: "no-store" });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          if (!data.items || !Array.isArray(data.items)) throw new Error("Ugyldig dataformat");
          if (cancelled) return;

          const shuffled = [...data.items].sort(() => Math.random() - 0.5);
          const limited = typeof amount === "number" ? shuffled.slice(0, amount) : shuffled;

          setQuestions(limited);
          setError(null);
          return;
        } catch (error) {
          console.warn("Kunne ikke laste", url, error);
          continue;
        }
      }
      if (!cancelled) {
        setError("Fant ikke spørsmål for valgt modell");
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [section, amount, activeVariant.id, variantLoading]);

  if (error) {
    return (
      <div className="min-h-screen grid place-items-center p-8 dark:bg-zinc-900 dark:text-zinc-100">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">{error}</div>
          <div className="text-slate-600 dark:text-zinc-300">Seksjon &ldquo;{section}&rdquo;</div>
        </div>
      </div>
    );
  }
  if (!questions) {
    return <div className="min-h-screen grid place-items-center p-8 text-center dark:bg-zinc-900 dark:text-zinc-100">Laster spørsmål ...</div>;
  }
  return <ClientQuiz section={section} initial={questions} />;
}
