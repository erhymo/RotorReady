"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useActiveModelVariant } from "@/lib/models/hooks";
import { modelScopedKey } from "@/lib/models/storage";
import { writeQuizOverrideSession } from "@/lib/quiz/overrideSession";
import { clearQuizResumeSnapshot, findLatestQuizResumeInfo } from "@/lib/quiz/resumeSnapshot";
import TopBarBackButton from "@/components/TopBarBackButton";

type Section = { id: string; title: string };
type ActiveVariantInfo = { id: string; productId: string };

const networkSectionItemsPromiseCache = new Map<string, Promise<any[] | null>>();
let blockedQuestionsPromise: Promise<Set<string>> | null = null;

function filterItemsForVariant(items: any[], activeVariant: ActiveVariantInfo) {
  return items.filter((q: any) => {
    if (Array.isArray(q.modelIds)) return q.modelIds.includes(activeVariant.id);
    if (Array.isArray(q.models)) return q.models.includes(activeVariant.id);
    if (activeVariant.productId && Array.isArray(q.productIds)) return q.productIds.includes(activeVariant.productId);
    if (activeVariant.productId && typeof q.productId === "string") return q.productId === activeVariant.productId;
    return activeVariant.productId === "AW169";
  });
}

async function loadNetworkSectionItems(sectionId: string, activeVariant: ActiveVariantInfo): Promise<any[] | null> {
  const key = `${activeVariant.id}:${activeVariant.productId}:${sectionId}`;
  const existing = networkSectionItemsPromiseCache.get(key);
  if (existing) return existing;

  const promise = (async () => {
    const urls = [
      `/model-data/${activeVariant.id}/sections/${sectionId}.json`,
      `/quiz-data/sections/${sectionId}.json`,
    ];
    for (const url of urls) {
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) continue;
        const data = await res.json();
        if (!data || !Array.isArray(data.items)) continue;
        const items = url.startsWith("/quiz-data")
          ? filterItemsForVariant(data.items as any[], activeVariant)
          : (data.items as any[]);
        if (items.length) return items;
      } catch {}
    }
    return null;
  })().catch((error) => {
    networkSectionItemsPromiseCache.delete(key);
    throw error;
  });

  networkSectionItemsPromiseCache.set(key, promise);
  return promise;
}

async function loadBlockedQuestionSet(): Promise<Set<string>> {
  if (blockedQuestionsPromise) return blockedQuestionsPromise;
  blockedQuestionsPromise = (async () => {
    try {
      const res = await fetch("/api/blocked-questions", { cache: "no-store" });
      if (!res.ok) return new Set<string>();
      const data = await res.json();
      const ids: string[] = Array.isArray(data?.ids) ? data.ids : [];
      return new Set(ids);
    } catch {
      return new Set<string>();
    }
  })();

  try {
    return await blockedQuestionsPromise;
  } catch {
    blockedQuestionsPromise = null;
    return new Set<string>();
  }
}

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

  const [resumeInfo, setResumeInfo] = useState<{ amountToken: string; idx: number; total: number } | null>(null);

  const selected = useMemo(() => {
    if (!sections.length) return null as Section | null;
    return sections.find((s) => s.id === routeSection) || sections[0];
  }, [sections, routeSection]);

  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [totalLoading, setTotalLoading] = useState<boolean>(false);

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
            // Ensure the route section is available even if not listed in index.json
            let arr = fromApi;
            if (routeSection && !arr.some((s) => s.id === routeSection)) {
              const TITLE_FALLBACK: Record<string, string> = {
                limitations: "Limitations",
                emergency_procedures: "Emergency Procedures",
                normal_procedures: "Normal Procedures",
                air_law: "Air Law (EASA)",
              };
              const title = TITLE_FALLBACK[routeSection] || routeSection.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
              arr = [...arr, { id: routeSection, title }];
            }
            setSections(addAll(arr));
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
            air_law: "Air Law (EASA)",
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
  // Detect whether the selected section actually has questions (locally or online)
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
  // 1) Local/offline first
      try {
        const { loadSectionOffline } = await import("@/lib/offline");
        const offline = loadSectionOffline<{ items?: unknown[] }>(selected.id, activeVariant.id);
        if (!cancelled && offline && Array.isArray((offline as any).items) && (offline as any).items.length > 0) {
          setHasQuestions(true);
          return;
        }
      } catch {}
      const items = await loadNetworkSectionItems(selected.id, activeVariant);
      if (!cancelled && items?.length) {
        setHasQuestions(true);
        return;
      }
      if (!cancelled) setHasQuestions(false);
    })();
    return () => { cancelled = true; };
  }, [selected?.id, activeVariant.id, variantLoading]);

  useEffect(() => {
    if (variantLoading) return;
    if (!selected?.id) { setTotalCount(null); return; }
    let cancelled = false;
    setTotalLoading(true);
    (async () => {
      try {
        // 'All' = total across all chapters for this model
        if (selected.id === "all") {
          try {
            const mod = await import("@/lib/loadAllQuestions");
            const all = await mod.loadAllQuestions(activeVariant.id);
            if (!cancelled) setTotalCount(all.length);
            return;
          } catch {}
        }
        // Try offline first
        let items: any[] | null = null;
        try {
          const mod = await import("@/lib/offline");
          const offline = mod.loadSectionOffline<{ items?: any[] }>(selected.id, activeVariant.id);
          if (offline && Array.isArray(offline.items)) items = offline.items;
        } catch {}
        if (!items) {
          items = await loadNetworkSectionItems(selected.id, activeVariant);
        }
        if (!items) { if (!cancelled) setTotalCount(0); return; }
        const blocked = await loadBlockedQuestionSet();
        const allowed = items.filter((it: any) => it && !blocked.has(it.id));
        if (!cancelled) setTotalCount(allowed.length);
      } finally {
        if (!cancelled) setTotalLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [selected?.id, activeVariant.id, variantLoading]);

  // Detect existing resume snapshot for this section/model
  useEffect(() => {
    if (variantLoading) return;
    let cancelled = false;
    const latestResume = findLatestQuizResumeInfo(activeVariant.id, routeSection);
    if (!cancelled) setResumeInfo(latestResume);
    return () => { cancelled = true; };
  }, [activeVariant.id, routeSection, variantLoading]);

  function handleResumeContinue() {
    if (!resumeInfo) return;
    router.push(`/quiz/${encodeURIComponent(routeSection)}/${encodeURIComponent(String(resumeInfo.amountToken))}`);
  }
  function handleResumeReset() {
    if (!resumeInfo) return;
    try {
      clearQuizResumeSnapshot(activeVariant.id, routeSection, resumeInfo.amountToken);
    } catch {}
    setResumeInfo(null);
  }


  async function handleAmount(amount: AmountOptionValue) {
    if (!selected) return;
    router.push(`/quiz/${encodeURIComponent(selected.id)}/${String(amount)}`);
  }
  async function startWrongOnly() {
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
      writeQuizOverrideSession(activeVariant.id, id, items);
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
      {selected?.id === "all" && (
        <p className="text-sm text-slate-600 dark:text-zinc-100 mt-1">&ldquo;All&rdquo; includes all available questions from every chapter for this model, randomized.</p>
      )}


      {resumeInfo && hasQuestions !== false && (
        <div className="rounded-xl border-l-4 border-emerald-600 bg-emerald-50/40 dark:border-emerald-400 dark:bg-emerald-900/40 p-4 flex items-center gap-3">
          <div className="flex-1">
            <div className="font-semibold text-slate-900 dark:text-white">Resume session</div>
            <div className="text-sm text-gray-600 dark:text-zinc-100">You are on question {resumeInfo.idx + 1} of {resumeInfo.total} ({String(resumeInfo.amountToken)}).</div>
          </div>
          <button onClick={handleResumeContinue} className="px-3 py-2 rounded-lg bg-emerald-600 text-white">Continue</button>
          <button onClick={handleResumeReset} className="px-3 py-2 rounded-lg bg-slate-200 dark:bg-zinc-700 dark:text-white">Start over</button>
        </div>
      )}


      {hasQuestions === false && (
        <div className="rounded-xl border-l-4 border-amber-600 bg-amber-50/60 dark:border-amber-400 dark:bg-amber-900/40 p-4">
          <div className="font-semibold text-slate-900 dark:text-white">Coming soon</div>
          <div className="text-sm text-gray-600 dark:text-zinc-100">Questions for this section are coming soon.</div>
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
        <span className="ml-auto mr-2 text-xs text-gray-600 dark:text-zinc-300">
          {totalLoading ? "\u2026" : (totalCount != null ? `${totalCount} total` : "")}
        </span>
        <button
          onClick={() => handleAmount(amount)}
          disabled={hasQuestions === false}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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
