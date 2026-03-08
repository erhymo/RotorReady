import { modelScopedKey } from "@/lib/models/storage";

export type QuizOverrideSession<TItem> = {
  items: TItem[];
};

export function getQuizOverrideStorageKey(variantId: string, section: string) {
  return `${modelScopedKey("quiz_session_override", variantId)}:${section}`;
}

export function buildQuizOverrideSession<TItem>(items: TItem[]): QuizOverrideSession<TItem> {
  return { items };
}

export function readQuizOverrideSession<TItem>(variantId: string, section: string): QuizOverrideSession<TItem> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(getQuizOverrideStorageKey(variantId, section));
    if (!raw) return null;
    const data = JSON.parse(raw) as { items?: TItem[] };
    return Array.isArray(data.items) ? buildQuizOverrideSession(data.items) : null;
  } catch {
    return null;
  }
}

export function writeQuizOverrideSession<TItem>(variantId: string, section: string, items: TItem[]) {
  sessionStorage.setItem(
    getQuizOverrideStorageKey(variantId, section),
    JSON.stringify(buildQuizOverrideSession(items)),
  );
}

export function clearQuizOverrideSession(variantId: string, section: string) {
  sessionStorage.removeItem(getQuizOverrideStorageKey(variantId, section));
}