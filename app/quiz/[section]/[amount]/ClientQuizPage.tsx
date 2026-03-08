"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ClientQuiz from "./ClientQuiz";
import { useActiveModelVariant } from "@/lib/models/hooks";
import { loadSectionOffline } from "@/lib/offline";
import { loadAllQuestions } from "@/lib/loadAllQuestions";
import { modelScopedKey } from "@/lib/models/storage";
import { buildQuizResumeSession, getQuizResumeStorageKey, readQuizResumeSnapshot, writeQuizResumeSnapshot } from "@/lib/quiz/resumeSnapshot";

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

  const amountTokenRender = String(amount === null ? "all" : amount);
  const resumeKeyRender = getQuizResumeStorageKey(activeVariant.id, section, amountTokenRender);

  useEffect(() => {
    if (variantLoading) return;
    let cancelled = false;

    async function goH125(items: QuizItem[]) {
      const sessionKey = `${modelScopedKey("h125q_session", activeVariant.id)}:${section}`;
      const amountToken = String(amount ?? "all");
      // Initialize local resume snapshot
      writeQuizResumeSnapshot({
        section,
        variantId: activeVariant.id,
        amountToken,
        items,
        idx: 0,
        answers: Array(items.length).fill(undefined),
        flags: Array(items.length).fill(false),
      });

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
      // 0a) Resume existing session if present (all sections, including "All")
      try {
        const amountToken = String(amount ?? "all");
        const snap = readQuizResumeSnapshot<QuizItem>(activeVariant.id, section, amountToken);
        if (!cancelled && snap) {
          if (isH125) {
            const key = `${modelScopedKey("h125q_session", activeVariant.id)}:${section}`;
            const session = {
              section,
              ...buildQuizResumeSession(snap),
            };
            sessionStorage.setItem(key, JSON.stringify(session));
            router.replace(`/quiz/${encodeURIComponent(section)}/h125/${snap.idx + 1}`);
            return;
          } else {
            setQuestions(snap.items);
            setResume({ idx: snap.idx, answers: snap.answers, flags: snap.flags });
            setError(null);
            return;
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

      // 0) Check if there is a session override (e.g. "Practice only incorrect questions")
      try {
        const overrideKey = `${modelScopedKey("quiz_session_override", activeVariant.id)}:${section}`;
        const raw = sessionStorage.getItem(overrideKey);
        if (!cancelled && raw) {
          const data = JSON.parse(raw) as { items?: QuizItem[] };
          if (Array.isArray(data.items) && data.items.length) {
            const allowed = data.items.filter(it => !blocked.has(it.id));
            let shuffled = shuffle(allowed);
            let limited = typeof amount === "number" ? shuffled.slice(0, amount) : shuffled;
            // avoid the same order as the previous two rounds
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
            // randomize alternatives per question
            const randomized = limited.map(shuffleOptionsForItem);
            // mark source file if possible is unknown in override; leave as undefined
            if (isH125) return goH125(randomized);
            setQuestions(randomized);
            setError(null);
            sessionStorage.removeItem(overrideKey);
            return;
          }
        }
      } catch {}

      // 'All' aggregator: get random questions across all chapters for the selected model
      if (section === "all") {
        try {
          const all = await loadAllQuestions(activeVariant.id);
          // bare single-choice
          const single = all.filter((q: any) => Array.isArray(q.options) && Array.isArray(q.answer) && q.answer.length === 1);
          let shuffled = shuffle(single as QuizItem[]);
          let limited = typeof amount === "number" ? shuffled.slice(0, amount) : shuffled;
          // Avoid an identical order as the previous two rounds for this combination
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

      // 1) Try locally (offline) first
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
