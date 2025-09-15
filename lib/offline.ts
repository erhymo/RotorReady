export type OfflineBlob = { type: "section"; id: string; payload: unknown; savedAt: string };

const keyFor = (id: string) => `offline:sections:${id}`;

export function saveSectionOffline(id: string, payload: unknown) {
  if (typeof window === "undefined") return;
  const blob: OfflineBlob = { type: "section", id, payload, savedAt: new Date().toISOString() };
  localStorage.setItem(keyFor(id), JSON.stringify(blob));
}

export function loadSectionOffline<T = unknown>(id: string): T | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(keyFor(id));
  if (!raw) return null;
  try { return JSON.parse(raw).payload as T; } catch { return null; }
}

export function clearOfflineSection(id: string) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(keyFor(id));
}

export function listOffline() {
  if (typeof window === "undefined") return [] as string[];
  return Object.keys(localStorage).filter(k => k.startsWith("offline:sections:"));
}

