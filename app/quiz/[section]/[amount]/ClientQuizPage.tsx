"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ClientQuiz from "./ClientQuiz";
import { useActiveModelVariant } from "@/lib/models/hooks";
import { loadSectionOffline } from "@/lib/offline";
import { loadAllQuestions } from "@/lib/loadAllQuestions";
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
  __file?: string;
};


function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
function signature(items: QuizItem[]) { return items.map(it => it.id).join(","); }
function shuffleOptionsForItem(it: QuizItem): QuizItem {
  if (!Array.isArray(it.options) || !Array.isArray(it.answer)) return it;
  const idx = it.options.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  const options = idx.map(i => it.options[i]);
  const answer = it.answer.map(a => idx.indexOf(a)).filter(n => n >= 0).sort((a,b)=>a-b);
  return { ...it, options, answer };
}

export default function ClientQuizPage({ section, amount }: { section: string; amount: number | null }) {
  const router = useRouter();
  const [questions, setQuestions] = useState<QuizItem[] | null>(null);
  const [resume, setResume] = useState<{ idx: number; answers: (number | undefined)[]; flags: boolean[] } | null>(null);

  const [error, setError] = useState<string | null>(null);
  const { variant: activeVariant, loading: variantLoading } = useActiveModelVariant();
  const isH125 = activeVariant.productId === "H125";

  const amountTokenRender = (amount === null ? "all" : amount) as string | number;
  const resumeKeyRender = `${modelScopedKey("quiz:resume", activeVariant.id)}:${section}:${amountTokenRender}`;

  useEffect(() => {
    if (variantLoading) return;
    let cancelled = false;

    async function goH125(items: QuizItem[]) {
      const sessionKey = `${modelScopedKey("h125q_session", activeVariant.id)}:${section}`;
      const amountToken = amount ?? "all";
      // Initialize local resume snapshot
      try {
        const resumeKey = `${modelScopedKey("quiz:resume", activeVariant.id)}:${section}:${amountToken}`;
        const snapshot = {
          section,
          variantId: activeVariant.id,
          amount: amountToken,
          items,
          idx: 0,
          answers: Array(items.length).fill(undefined),
          flags: Array(items.length).fill(false),
          startedAt: Date.now(),
          updatedAt: Date.now(),
        };
        localStorage.setItem(resumeKey, JSON.stringify(snapshot));
      } catch {}

      const session = {
        section,
        createdAt: new Date().toISOString(),
        items,
        answers: Array(items.length).fill(null) as Array<number|null>,
        flags: Array(items.length).fill(false) as boolean[],
        amountToken: String(amountToken),
      };
      sessionStorage.setItem(sessionKey, JSON.stringify(session));
      router.replace(`/quiz/${encodeURIComponent(section)}/h125/1`);
    }

    async function load() {
      // 0a) Resume existing session if present (all sections, også "All")
      try {
        const amountToken = amount ?? "all";
        const resumeKey = `${modelScopedKey("quiz:resume", activeVariant.id)}:${section}:${amountToken}`;
        const rawSnap = localStorage.getItem(resumeKey);
        if (!cancelled && rawSnap) {
          const snap = JSON.parse(rawSnap);
          if (Array.isArray(snap.items) && snap.items.length) {
            const items: QuizItem[] = snap.items;
            if (isH125) {
              const key = `${modelScopedKey("h125q_session", activeVariant.id)}:${section}`;
              const session = {
                section,
                createdAt: new Date().toISOString(),
                items,
                answers: Array(items.length).fill(null) as Array<number | null>,
                flags: Array(items.length).fill(false) as boolean[],
                amountToken: String(amountToken),
              } as any;
              if (Array.isArray(snap.answers) && snap.answers.length === items.length) {
                session.answers = snap.answers.map((a: any) => (a == null ? null : Number(a)));
              }
              if (Array.isArray(snap.flags) && snap.flags.length === items.length) {
                session.flags = snap.flags as boolean[];
              }
              sessionStorage.setItem(key, JSON.stringify(session));
              const idx = Math.min(Math.max(0, Number(snap.idx ?? 0)), items.length - 1);
              router.replace(`/quiz/${encodeURIComponent(section)}/h125/${idx + 1}`);
              return;
            } else {
              setQuestions(items);
              const idx = Math.min(Math.max(0, Number(snap.idx ?? 0)), items.length - 1);
              const answers =
                Array.isArray(snap.answers) && snap.answers.length === items.length
                  ? (snap.answers as (number | undefined)[])
                  : Array(items.length).fill(undefined);
              const flags =
                Array.isArray(snap.flags) && snap.flags.length === items.length
                  ? (snap.flags as boolean[])
                  : Array(items.length).fill(false);
              setResume({ idx, answers, flags });
              setError(null);
              return;
            }
          }
        }
      } catch {}

      // Fetch soft-deleted (blocked) question IDs so we can filter them out
      let blocked = new Set<string>();
      try {
        const res = await fetch('/api/blocked-questions', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          blocked = new Set<string>(Array.isArray(data?.ids) ? data.ids : []);
        }
      } catch {}

      // 0) Sjekk om det finnes en sesjons-override (f.eks. "Øv kun på feil")
      try {
        const overrideKey = `${modelScopedKey("quiz_session_override", activeVariant.id)}:${section}`;
        const raw = sessionStorage.getItem(overrideKey);
        if (!cancelled && raw) {
          const data = JSON.parse(raw) as { items?: QuizItem[] };
          if (Array.isArray(data.items) && data.items.length) {
            const allowed = data.items.filter(it => !blocked.has(it.id));
            let shuffled = shuffle(allowed);
            let limited = typeof amount === "number" ? shuffled.slice(0, amount) : shuffled;
            // unngå samme rekkefølge som siste to runder
            try {
              const key = `quiz:lastOrders:${activeVariant.id}:${section}:${amount ?? "all"}`;
              const lastOrders: string[] = JSON.parse(sessionStorage.getItem(key) || "[]");
              const sig = signature(limited);
              if (lastOrders.includes(sig)) {
                shuffled = shuffle(limited);
                limited = typeof amount === "number" ? shuffled.slice(0, amount) : shuffled;
              }
              const updated = [...lastOrders, signature(limited)].slice(-2);
              sessionStorage.setItem(key, JSON.stringify(updated));
            } catch {}
            // randomiser alternativer pr. spørsmål
            const randomized = limited.map(shuffleOptionsForItem);
            // merk kildefil hvis mulig er ukjent i override; la være undefined
            if (isH125) return goH125(randomized);
            setQuestions(randomized);
            setError(null);
            sessionStorage.removeItem(overrideKey);
            return;
          }
        }
      } catch {}

      // 'All' aggregator: hent random på tvers av alle kapitler for valgt modell
      if (section === "all") {
        try {
          const all = await loadAllQuestions(activeVariant.id);
          // bare single-choice
          const single = all.filter((q: any) => Array.isArray(q.options) && Array.isArray(q.answer) && q.answer.length === 1);
          let shuffled = shuffle(single as QuizItem[]);
          let limited = typeof amount === "number" ? shuffled.slice(0, amount) : shuffled;
          // Unngå identisk rekkefølge som siste to runder for denne kombinasjonen
          try {
            const key = `quiz:lastOrders:${activeVariant.id}:${section}:${amount ?? "all"}`;
            const lastOrders: string[] = JSON.parse(sessionStorage.getItem(key) || "[]");
            if (lastOrders.includes(signature(limited))) {
              shuffled = shuffle(limited);
              limited = typeof amount === "number" ? shuffled.slice(0, amount) : shuffled;
            }
            const updated = [...lastOrders, signature(limited)].slice(-2);
            sessionStorage.setItem(key, JSON.stringify(updated));
          } catch {}
          const randomized = limited.map(shuffleOptionsForItem);
          if (isH125) return goH125(randomized);
          setQuestions(randomized);
          setError(null);
          return;
        } catch (e) {
          setError("Could not load questions across sections");
          return;
        }
      }

      // 1) Forsøk lokalt (offline) først
      try {
        const offline = loadSectionOffline<{ items?: QuizItem[] }>(section, activeVariant.id);
        if (!cancelled && offline && Array.isArray(offline.items)) {
          const filtered = (offline.items as QuizItem[]).filter((it) => it && !blocked.has(it.id));
          if (filtered.length) {
            const enriched = filtered.map((it) => ({ ...it, __file: `model-data/${activeVariant.id}/sections/${section}.json` }));
            let shuffled = shuffle(enriched);
            let limited = typeof amount === "number" ? shuffled.slice(0, amount) : shuffled;
            try {
              const key = `quiz:lastOrders:${activeVariant.id}:${section}:${amount ?? "all"}`;
              const lastOrders: string[] = JSON.parse(sessionStorage.getItem(key) || "[]");
              if (lastOrders.includes(signature(limited))) {
                shuffled = shuffle(limited);
                limited = typeof amount === "number" ? shuffled.slice(0, amount) : shuffled;
              }
              const updated = [...lastOrders, signature(limited)].slice(-2);
              sessionStorage.setItem(key, JSON.stringify(updated));
            } catch {}
            const randomized = limited.map(shuffleOptionsForItem);
            if (isH125) return goH125(randomized);
            setQuestions(randomized);
            setError(null);
            return;
          }
        }
      } catch {
        // Ignore and try network
      }

      // 2) Then try network as usual
      const urls = [
        `/model-data/${activeVariant.id}/sections/${section}.json`,
        `/quiz-data/sections/${section}.json`,
      ];
      for (const url of urls) {
        try {
          const res = await fetch(url, { cache: "no-store" });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const raw = await res.text();
          let data: any;
          try {
            data = JSON.parse(raw);
          } catch {
            // Sanitize control characters (e.g. \u0013, \u0015) that may appear in copied references
            const cleaned = raw.replace(/[\u0000-\u001F]/g, " ");
            data = JSON.parse(cleaned);
          }
          if (!data.items || !Array.isArray(data.items)) throw new Error("Ugyldig dataformat");
          if (cancelled) return;

          // If we are loading from the global quiz-data fallback, filter items to the active variant/product
          let sourceItems: QuizItem[] = data.items as QuizItem[];
          const isGlobal = url.startsWith("/quiz-data");
          if (isGlobal) {
            sourceItems = sourceItems.filter((q: any) => {
              if (Array.isArray(q.modelIds)) return q.modelIds.includes(activeVariant.id);
              if (Array.isArray(q.models)) return q.models.includes(activeVariant.id);
              if (activeVariant.productId && Array.isArray(q.productIds)) return q.productIds.includes(activeVariant.productId);
              if (activeVariant.productId && typeof q.productId === "string") return q.productId === activeVariant.productId;
              // Default-allow only for AW169 (legacy sections without explicit scoping)
              return activeVariant.productId === "AW169";
            });
            // If nothing matches for this variant, try next URL
            if (!sourceItems.length) throw new Error("No items for active variant in global section");
          }

          const allowed = (sourceItems as QuizItem[]).filter((it) => it && !blocked.has(it.id));
          if (!allowed.length) throw new Error("No items after blocklist");
          const enriched: QuizItem[] = allowed.map((it: QuizItem) => ({
            ...it,
            __file: url.startsWith("/model-data")
              ? `model-data/${activeVariant.id}/sections/${section}.json`
              : `quiz-data/sections/${section}.json`
          }));

          let shuffled = shuffle(enriched);
          let limited = typeof amount === "number" ? shuffled.slice(0, amount) : shuffled;
          try {
            const key = `quiz:lastOrders:${activeVariant.id}:${section}:${amount ?? "all"}`;
            const lastOrders: string[] = JSON.parse(sessionStorage.getItem(key) || "[]");
            if (lastOrders.includes(signature(limited))) {
              shuffled = shuffle(limited);
              limited = typeof amount === "number" ? shuffled.slice(0, amount) : shuffled;
            }
            const updated = [...lastOrders, signature(limited)].slice(-2);
            sessionStorage.setItem(key, JSON.stringify(updated));
          } catch {}
          const randomized = limited.map(shuffleOptionsForItem);
          if (isH125) return goH125(randomized);
          setQuestions(randomized);
          setError(null);
          return;
        } catch (error) {
          console.warn("Could not load", url, error);
          continue;
        }
      }
      if (!cancelled) {
        setError("No questions found for selected model");
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
          <div className="text-slate-600 dark:text-zinc-300">Section &ldquo;{section}&rdquo;</div>
        </div>
      </div>
    );
  }
  if (!questions) {
    return <div className="min-h-screen grid place-items-center p-8 text-center dark:bg-zinc-900 dark:text-zinc-100">Loading questions ...</div>;
  }
  return (
    <ClientQuiz
      section={section}
      initial={questions}
      resumeKey={String(resumeKeyRender)}
      amountToken={String(amountTokenRender)}
      initialIdx={resume?.idx ?? 0}
      initialAnswers={resume?.answers}
      initialFlags={resume?.flags}
    />
  );
}
