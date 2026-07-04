import { modelScopedKey } from "@/lib/models/storage";
import { buildInitialQuizResumeSession, type QuizResumeSessionLike } from "@/lib/quiz/resumeSnapshot";
import { shuffleOptionsForItem, type ShuffleableItem } from "@/lib/quiz/shuffleOptions";

const SECTION_ID = "limitations" as const;

type LimitationsWrongOnlyItem = ShuffleableItem & {
  id?: string | number | null;
};

type LimitationsWrongOnlySession<TItem> = {
  section: typeof SECTION_ID;
} & QuizResumeSessionLike<TItem>;

function buildLimitationsWrongOnlySession<TItem extends ShuffleableItem>(items: TItem[]): LimitationsWrongOnlySession<TItem> {
  const randomized = items.map(shuffleOptionsForItem);
  return {
    section: SECTION_ID,
    ...buildInitialQuizResumeSession(randomized),
  };
}

function getLimitationsWrongOnlyKeys(variantId: string) {
  return {
    histKey: `${modelScopedKey("rr_wrong_history", variantId)}:${SECTION_ID}`,
    lowerKey: `${modelScopedKey("rr_progress_last_wrong", variantId)}:${SECTION_ID}`,
    upperKey: `${modelScopedKey("rr_progress_last_wrong", variantId)}:${SECTION_ID.toUpperCase()}`,
    legacyLowerKey: variantId === "AW169" ? "rr_progress_last_wrong:limitations" : null,
    legacyUpperKey: variantId === "AW169" ? "rr_progress_last_wrong:LIMITATIONS" : null,
  };
}

export function loadLimitationsWrongOnlySession<TItem extends LimitationsWrongOnlyItem>(
  variantId: string,
): LimitationsWrongOnlySession<TItem> | null {
  const { histKey, lowerKey, upperKey, legacyLowerKey, legacyUpperKey } = getLimitationsWrongOnlyKeys(variantId);

  const rawHist = localStorage.getItem(histKey);
  let combinedItems: TItem[] | null = null;
  try {
    const arr = rawHist ? (JSON.parse(rawHist) as Array<{ items?: TItem[] }>) : null;
    if (Array.isArray(arr) && arr.length) {
      const deduped = new Map<string, TItem>();
      for (const session of arr.slice(-10)) {
        const items = Array.isArray(session?.items) ? session.items : [];
        for (const item of items) {
          const id = item?.id;
          if (id != null && !deduped.has(String(id))) {
            deduped.set(String(id), item);
          }
        }
      }
      combinedItems = Array.from(deduped.values());
    }
  } catch {}

  const lower = localStorage.getItem(lowerKey) || (legacyLowerKey ? localStorage.getItem(legacyLowerKey) : null);
  const upper = localStorage.getItem(upperKey) || (legacyUpperKey ? localStorage.getItem(legacyUpperKey) : null);
  const raw = lower || upper;

  if (!combinedItems && !raw) {
    return null;
  }

  if (combinedItems) {
    return buildLimitationsWrongOnlySession(combinedItems);
  }

  const data = JSON.parse(raw!) as { items?: TItem[] };
  const items = Array.isArray(data.items) ? data.items : [];
  return buildLimitationsWrongOnlySession(items);
}

export function clearLimitationsWrongOnlyRawStorage(variantId: string) {
  const { lowerKey, upperKey, legacyLowerKey, legacyUpperKey } = getLimitationsWrongOnlyKeys(variantId);

  localStorage.removeItem(lowerKey);
  localStorage.removeItem(upperKey);
  if (legacyLowerKey) localStorage.removeItem(legacyLowerKey);
  if (legacyUpperKey) localStorage.removeItem(legacyUpperKey);
}