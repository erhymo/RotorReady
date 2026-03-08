let blockedQuestionsPromise: Promise<Set<string>> | null = null;

export async function loadBlockedQuestionSet(): Promise<Set<string>> {
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