"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Section = { id: string; title: string };
const AMOUNTS = [10, 20, 30, 40, 50];

export default function SectionPage() {
  const router = useRouter();
  const params = useParams<{ section: string }>();
  const routeSection = decodeURIComponent(params.section);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/quiz-data/index.json")
      .then(r => r.json())
      .then(d => setSections(d.sections || []))
      .catch(() => setError("Kunne ikke laste seksjoner"))
      .finally(() => setLoading(false));
  }, []);

  const selected = useMemo(() => {
    if (!sections.length) return null as Section | null;
    return sections.find(s => s.id === routeSection) || sections[0];
  }, [sections, routeSection]);

  function handleSection(id: string) {
    router.replace(`/quiz/${encodeURIComponent(id)}`);
  }
  function handleAmount(amount: number) {
    if (!selected) return;
    router.push(`/quiz/${encodeURIComponent(selected.id)}/${amount}`);
  }

  if (loading) return <div className="min-h-screen grid place-items-center dark:bg-zinc-900 dark:text-zinc-100">Laster…</div>;
  if (error) return <div className="min-h-screen grid place-items-center text-red-600 dark:bg-zinc-900 dark:text-red-400">{error}</div>;
  if (!sections.length) return <div className="min-h-screen grid place-items-center dark:bg-zinc-900 dark:text-zinc-100">Ingen seksjoner funnet</div>;

  return (
  <div className="min-h-screen bg-slate-50 dark:bg-zinc-900 flex flex-col items-center justify-center p-6">
  <div className="bg-blue-600 dark:bg-blue-900 py-3 px-4 flex flex-wrap gap-2 mb-8 rounded-lg">
        {sections.map(s => (
          <button
            key={s.id}
            className={`text-white text-sm font-semibold px-3 py-2 rounded transition ${selected?.id===s.id ? "bg-blue-800 dark:bg-blue-950" : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-900 dark:hover:bg-blue-800"}`}
            onClick={()=>handleSection(s.id)}
            title={s.title}
          >
            {s.title}
          </button>
        ))}
      </div>
  <h1 className="text-2xl font-bold mb-6 dark:text-zinc-100">Velg antall spørsmål for &quot;{selected?.title}&quot;</h1>
  <div className="flex gap-3 flex-wrap justify-center">
        {AMOUNTS.map(amount => (
          <button
            key={amount}
            className="bg-blue-600 dark:bg-blue-900 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-800 transition"
            onClick={() => handleAmount(amount)}
          >
            {amount}
          </button>
        ))}
      </div>
    </div>
  );
}
