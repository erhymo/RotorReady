"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useActiveModelVariant } from "@/lib/models/hooks";
import { modelScopedKey } from "@/lib/models/storage";
import TopBarBackButton from "@/components/TopBarBackButton";

type Section = { id: string; title: string };
const AMOUNT_OPTIONS = [
  { value: 10, label: "10" },
  { value: 20, label: "20" },
  { value: 30, label: "30" },
  { value: 40, label: "40" },
  { value: "all", label: "All" },
] as const;

type AmountOptionValue = (typeof AMOUNT_OPTIONS)[number]["value"];

export default function SectionPage() {
  const router = useRouter();
  const params = useParams<{ section: string }>();
  const routeSection = decodeURIComponent((params?.section as string) || "");
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState<AmountOptionValue>(20);
  const [hasQuestions, setHasQuestions] = useState<boolean | null>(null);
  const { variant: activeVariant, loading: variantLoading } = useActiveModelVariant();

  const selected = useMemo(() => {
    if (!sections.length) return null as Section | null;
    return sections.find((s) => s.id === routeSection) || sections[0];
  }, [sections, routeSection]);

  useEffect(() => {
    if (variantLoading) return;
    let cancelled = false;
    setLoading(true);

    const addAll = (arr: Section[]): Section[] => {
      const exists = arr.some((s) => s.id === "all");
      return exists ? arr : [...arr, { id: "all", title: "All" }];
    };

    const urls = [
      `/model-data/${activeVariant.id}/index.json`,
      "/quiz-data/index.json",
    ];
    (async () => {
      for (const url of urls) {
        try {
          const res = await fetch(url, { cache: "no-store" });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          if (!cancelled) {
            const fromApi = Array.isArray(data.sections) ? (data.sections as Section[]) : [];
            setSections(addAll(fromApi));
            setError(null);
            return;
          }
        } catch (err) {
          console.warn("Could not fetch sections", url, err);
          continue;
        }
      }
      // Nettverk feilet: dersom vi har lokalt innhold for etterspurt seksjon, vis i det minste denne seksjonen
      try {
        const { loadSectionOffline } = await import("@/lib/offline");
        const offline = loadSectionOffline(routeSection, activeVariant.id);
        if (!cancelled && offline) {
          const TITLE_FALLBACK: Record<string, string> = {
            limitations: "Limitations",
            emergency_procedures: "Emergency Procedures",
            normal_procedures: "Normal Procedures",
          };
          const title = TITLE_FALLBACK[routeSection] || routeSection.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
          setSections(addAll([{ id: routeSection, title }]));
          setError(null);
          return;
        }
      } catch {}
      if (!cancelled) {
        setError("No sections found for the selected model");
        setSections(addAll([]));
      }
    })().finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => { cancelled = true; };
  }, [activeVariant.id, variantLoading, routeSection]);
  // Oppdag om valgt seksjon faktisk har spørsmål (lokalt eller på nett)
  useEffect(() => {
    if (variantLoading) return;
    if (!selected?.id) return;
    let cancelled = false;
    (async () => {
      // Spesialtilfelle for "All": aggregator finnes alltid
      if (selected.id === "all") {
        setHasQuestions(true);
        return;
      }
      // 1) Lokal/offline først
      try {
        const { loadSectionOffline } = await import("@/lib/offline");
        const offline = loadSectionOffline<{ items?: unknown[] }>(selected.id, activeVariant.id);
        if (!cancelled && offline && Array.isArray((offline as any).items) && (offline as any).items.length > 0) {
          setHasQuestions(true);
          return;
        }
      } catch {}
      // 2) Nettverk
      const urls = [
        `/model-data/${activeVariant.id}/sections/${selected.id}.json`,
        `/quiz-data/sections/${selected.id}.json`,
      ];
      for (const url of urls) {
        try {
          const res = await fetch(url, { cache: "no-store" });
          if (!res.ok) continue;
          const data = await res.json();
          if (data && Array.isArray(data.items) && data.items.length > 0) {
            if (!cancelled) setHasQuestions(true);
            return;
          }
        } catch {}
      }
      if (!cancelled) setHasQuestions(false);
    })();
    return () => { cancelled = true; };
  }, [selected?.id, activeVariant.id, variantLoading]);


  function handleAmount(amount: AmountOptionValue) {
    if (!selected) return;
    router.push(`/quiz/${encodeURIComponent(selected.id)}/${String(amount)}`);
  }
  function startWrongOnly() {
    const id = selected?.id || routeSection;
    const lowerKey = `${modelScopedKey("rr_progress_last_wrong", activeVariant.id)}:${id}`;
    const upperKey = `${modelScopedKey("rr_progress_last_wrong", activeVariant.id)}:${id.toUpperCase()}`;
    const legacyLower = activeVariant.id === "AW169" ? `rr_progress_last_wrong:${id}` : null;
    const legacyUpper = activeVariant.id === "AW169" ? `rr_progress_last_wrong:${id.toUpperCase()}` : null;

    // Prefer aggregated history across last 10 sessions if available
    const histKey = `${modelScopedKey("rr_wrong_history", activeVariant.id)}:${id}`;
    const rawHist = localStorage.getItem(histKey);
    let combinedItems: any[] | null = null;
    try {
      const arr = rawHist ? JSON.parse(rawHist) : null;
      if (Array.isArray(arr) && arr.length) {
        const out: Record<string, any> = {};
        for (const sess of arr.slice(-10)) {
          if (Array.isArray(sess?.items)) {
            for (const it of sess.items) {
              if (it?.id && !out[it.id]) out[it.id] = it;
            }
          }
        }
        combinedItems = Object.values(out);
      }
    } catch {}

    const raw =
      localStorage.getItem(lowerKey) ||
      localStorage.getItem(upperKey) ||
      (legacyLower ? localStorage.getItem(legacyLower) : null) ||
      (legacyUpper ? localStorage.getItem(legacyUpper) : null);

    if (!combinedItems && !raw) {
      alert("No wrong-answer set available. Complete a quiz first.");
      return;
    }
    try {
      const items = combinedItems ?? (JSON.parse(raw!).items || []);
      const overrideKey = `${modelScopedKey("quiz_session_override", activeVariant.id)}:${id}`;
      sessionStorage.setItem(overrideKey, JSON.stringify({ items }));
      router.push(`/quiz/${encodeURIComponent(id)}/all`);
    } catch {
      alert("Could not load saved wrong-answer set. Delete and try again.");
      localStorage.removeItem(lowerKey);
      localStorage.removeItem(upperKey);
      if (legacyLower) localStorage.removeItem(legacyLower);
      if (legacyUpper) localStorage.removeItem(legacyUpper);
    }
  }

  if (loading) return <div className="min-h-screen grid place-items-center dark:bg-zinc-900 dark:text-zinc-100">Loading…</div>;
  if (error) return <div className="min-h-screen grid place-items-center text-red-600 dark:bg-zinc-900 dark:text-red-400">{error}</div>;
  if (!sections.length) return <div className="min-h-screen grid place-items-center dark:bg-zinc-900 dark:text-zinc-100">No sections found</div>;

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <div className="w-full flex items-center py-1">
        <TopBarBackButton href="/quiz" />
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
        {selected?.title}
      </h1>
      <p className="text-lg text-slate-700 dark:text-zinc-100 mt-2">Choose number of questions and start.</p>


      {hasQuestions === false && (
        <div className="rounded-xl border-l-4 border-amber-600 bg-amber-50/60 dark:border-amber-400 dark:bg-amber-900/40 p-4">
          <div className="font-semibold text-slate-900 dark:text-white">Coming soon</div>
          <div className="text-sm text-gray-600 dark:text-zinc-100">Det kommer spørsmål for denne seksjonen snart.</div>
        </div>
      )}

      <div className="rounded-xl border-l-4 border-blue-600 bg-blue-50/40 dark:border-blue-400 dark:bg-blue-900/40 p-4 flex items-center gap-3">
        <label className="text-sm text-gray-700 dark:text-zinc-100">Count:</label>
        <select
          className="border rounded px-3 py-2 dark:bg-blue-900 dark:text-zinc-100 dark:border-blue-400"
          value={amount}
          onChange={(e) => {
            const value = e.target.value === "all" ? ("all" as AmountOptionValue) : (parseInt(e.target.value, 10) as AmountOptionValue);
            setAmount(value);
          }}
        >
          {AMOUNT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          onClick={() => handleAmount(amount)}
          disabled={hasQuestions === false}
          className="ml-auto px-4 py-2 rounded-lg bg-blue-600 text-white active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start
        </button>
      </div>

      {hasQuestions !== false && (
        <div className="rounded-xl border-l-4 border-emerald-600 bg-emerald-50/40 dark:border-emerald-400 dark:bg-emerald-900/40 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">Practice wrong answers only</div>
              <div className="text-sm text-gray-600 dark:text-zinc-100">Reuse the last wrong-answer set for focused practice.</div>
            </div>
            <button onClick={startWrongOnly} className="px-4 py-2 rounded-lg bg-emerald-600 text-white">
              Start
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
