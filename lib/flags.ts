'use client';

let firebaseClientPromise: Promise<typeof import('@/lib/firebase/client')> | null = null;
let firestoreLitePromise: Promise<typeof import('firebase/firestore/lite')> | null = null;

function loadFirebaseClient() {
  if (!firebaseClientPromise) {
    firebaseClientPromise = import('@/lib/firebase/client');
  }
  return firebaseClientPromise;
}

function loadFirestoreLite() {
  if (!firestoreLitePromise) {
    firestoreLitePromise = import('firebase/firestore/lite');
  }
  return firestoreLitePromise;
}

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
  const { auth, db } = await loadFirebaseClient().catch(() => ({ auth: undefined, db: undefined }));
  // fetch ID token once per flush; refresh per item if needed
  const idToken = auth?.currentUser ? await auth.currentUser.getIdToken().catch(() => null) : null;
  for (const item of q) {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (idToken) headers['Authorization'] = `Bearer ${idToken}`;
      const res = await fetch('/api/flags', { method: 'POST', headers, body: JSON.stringify(item) });
      if (!res.ok) throw new Error('HTTP '+res.status);
    } catch (e) {
      // Fallback: write directly to Firestore from client (no Vercel server env needed)
      let persisted = false;
      try {
        if (db) {
          const { collection, addDoc } = await loadFirestoreLite();
          await addDoc(collection(db as any, 'flags'), item);
          persisted = true;
        }
      } catch {}
      if (!persisted) rest.push(item);
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
  const { auth } = await loadFirebaseClient().catch(() => ({ auth: undefined }));
  const data = {
    ...payload,
    userId: auth?.currentUser?.uid || 'guest',
    // email/name sendes med for bakoverkomp., server ignorerer og beriker selv
    email: auth?.currentUser?.email || undefined,
    name: auth?.currentUser?.displayName || undefined,
    createdAt: new Date().toISOString(),
    status: 'open',
  } as any;

  // Offline-first: legg i lokal kø, og forsøk deretter server-post.
  const queued = loadQueue();
  queued.push(data);
  saveQueue(queued);

  try { await flushQueue(); } catch {}
}
