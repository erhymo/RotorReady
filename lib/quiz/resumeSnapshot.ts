import { modelScopedKey } from "@/lib/models/storage";

type StartedAtInput = string | number | Date | null | undefined;

type QuizResumeSnapshotParams<TItem> = {
  section: string;
  variantId: string;
  amountToken: string;
  items: TItem[];
  idx: number;
  answers: Array<number | null | undefined>;
  flags: boolean[];
  startedAt?: StartedAtInput;
};

type QuizResumeMatch = {
  key: string;
  snap: {
    amount?: unknown;
    idx?: unknown;
    updatedAt?: unknown;
    items?: unknown;
  };
};

export type QuizResumeInfo = {
  amountToken: string;
  idx: number;
  total: number;
};

export type QuizResumeState<TItem> = {
  amountToken: string;
  idx: number;
  items: TItem[];
  answers: Array<number | undefined>;
  flags: boolean[];
};

export function getQuizResumeStoragePrefix(variantId: string, section: string) {
  return `${modelScopedKey("quiz:resume", variantId)}:${section}:`;
}

export function getQuizResumeStorageKey(variantId: string, section: string, amountToken: string) {
  return `${getQuizResumeStoragePrefix(variantId, section)}${amountToken}`;
}

export function findLatestQuizResumeInfo(variantId: string, section: string): QuizResumeInfo | null {
  try {
    if (typeof window === "undefined" || !window.localStorage) return null;

    const prefix = getQuizResumeStoragePrefix(variantId, section);
    const matches: QuizResumeMatch[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith(prefix)) continue;

      const raw = localStorage.getItem(key);
      if (!raw) continue;

      try {
        const snap = JSON.parse(raw) as QuizResumeMatch["snap"];
        if (!Array.isArray(snap?.items) || !snap.items.length) continue;
        matches.push({ key, snap });
      } catch {}
    }

    if (!matches.length) return null;

    matches.sort((a, b) => Number(b.snap?.updatedAt || 0) - Number(a.snap?.updatedAt || 0));

    const top = matches[0];
    const total = Array.isArray(top.snap?.items) ? top.snap.items.length : 0;
    if (!total) return null;

    const idx = Math.min(Math.max(0, Number(top.snap?.idx ?? 0)), Math.max(0, total - 1));
    const amountToken = String(top.snap?.amount ?? top.key.substring(prefix.length));

    return { amountToken, idx, total };
  } catch {
    return null;
  }
}

export function readQuizResumeSnapshot<TItem>(
  variantId: string,
  section: string,
  amountToken: string,
): QuizResumeState<TItem> | null {
  try {
    const raw = localStorage.getItem(getQuizResumeStorageKey(variantId, section, amountToken));
    if (!raw) return null;

    const snap = JSON.parse(raw) as {
      amount?: unknown;
      idx?: unknown;
      items?: unknown;
      answers?: unknown;
      flags?: unknown;
    };

    if (!Array.isArray(snap?.items) || !snap.items.length) return null;

    const items = snap.items as TItem[];
    const idx = Math.min(Math.max(0, Number(snap.idx ?? 0)), Math.max(0, items.length - 1));
    const answers =
      Array.isArray(snap.answers) && snap.answers.length === items.length
        ? snap.answers.map((answer) => {
            if (answer == null) return undefined;
            const numericAnswer = Number(answer);
            return Number.isFinite(numericAnswer) ? numericAnswer : undefined;
          })
        : Array(items.length).fill(undefined);
    const flags =
      Array.isArray(snap.flags) && snap.flags.length === items.length
        ? snap.flags.map((flag) => !!flag)
        : Array(items.length).fill(false);

    return {
      amountToken: String(snap.amount ?? amountToken),
      idx,
      items,
      answers,
      flags,
    };
  } catch {
    return null;
  }
}

function normalizeStartedAt(startedAt?: StartedAtInput) {
  if (typeof startedAt === "number" && Number.isFinite(startedAt)) return startedAt;
  if (startedAt instanceof Date) {
    const time = startedAt.getTime();
    return Number.isFinite(time) ? time : Date.now();
  }
  if (typeof startedAt === "string" && startedAt) {
    const time = Date.parse(startedAt);
    return Number.isFinite(time) ? time : Date.now();
  }
  return Date.now();
}

export function writeQuizResumeSnapshot<TItem>({
  section,
  variantId,
  amountToken,
  items,
  idx,
  answers,
  flags,
  startedAt,
}: QuizResumeSnapshotParams<TItem>) {
  try {
    const snapshot = {
      section,
      variantId,
      amount: amountToken,
      items,
      idx,
      answers: answers.map((answer) => (answer == null ? undefined : Number(answer))),
      flags,
      startedAt: normalizeStartedAt(startedAt),
      updatedAt: Date.now(),
    };
    localStorage.setItem(getQuizResumeStorageKey(variantId, section, amountToken), JSON.stringify(snapshot));
  } catch {}
}

export function clearQuizResumeSnapshot(variantId: string, section: string, amountToken?: string | null) {
  if (!amountToken) return;
  try {
    localStorage.removeItem(getQuizResumeStorageKey(variantId, section, amountToken));
  } catch {}
}