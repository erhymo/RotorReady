'use client';
import { auth } from '@/lib/firebase/client';

const QUEUE_KEY = 'rr_flags_queue';
function loadQueue(): any[] {
  try { return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]') || []; } catch { return []; }
}
function saveQueue(items: any[]) {
  try { localStorage.setItem(QUEUE_KEY, JSON.stringify(items)); } catch {}
}
let initDone = false;
async function flushQueue() {
  const q = loadQueue(); if (!q.length) return;
  const rest: any[] = [];
  for (const item of q) {
    try {
      const res = await fetch('/api/admin/flags', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) });
      if (!res.ok) throw new Error('HTTP '+res.status);
    } catch {
      rest.push(item);
    }
  }
  saveQueue(rest);
}
function ensureInit() {
  if (initDone) return; initDone = true;
  if (typeof window !== 'undefined') {
    window.addEventListener('online', () => { flushQueue(); });
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') flushQueue(); });
    setTimeout(() => { flushQueue(); }, 0);
  }
}

export type FlagPayload = {
  section: string;
  questionId: string;
  sectionId?: string;
  dataSource?: "sections" | "all-questions";
  dataFile?: string | null;
  snapshot?: {
    question?: string;
    options?: string[];
    explanation?: string;
    references?: string[];
    answer?: number[];
  };
  reason?: string;
};

export async function reportFlag(payload: FlagPayload) {
  ensureInit();
  const data = {
    ...payload,
    userId: auth?.currentUser?.uid || 'guest',
    email: auth?.currentUser?.email || undefined,
    createdAt: new Date().toISOString(),
    status: 'open',
  } as any;

  // Offline-first: legg i lokal kø, og forsøk deretter server-post.
  const queued = loadQueue();
  queued.push(data);
  saveQueue(queued);

  try { await flushQueue(); } catch {}
}
