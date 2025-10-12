'use client';
import { auth, db } from '@/lib/firebase/client';
import { addDoc, collection } from 'firebase/firestore';

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
  const data = {
    ...payload,
    userId: auth?.currentUser?.uid || 'guest',
    createdAt: new Date().toISOString(),
    status: 'open',
  } as any;

  // 1) Primærvei: backend lagrer til Firestore (persist i prod)
  try {
    const res = await fetch("/api/admin/flags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) return;
  } catch {}

  // 2) Fallback: skriv direkte til Firestore fra klient hvis tilgjengelig
  try {
    if (db) {
      await addDoc(collection(db, 'flags'), data);
      return;
    }
  } catch {}

  // 3) Siste utvei: logg i dev
  if (process.env.NODE_ENV !== 'production') {
    console.warn('[flags] Failed to persist flag via API and client DB', data);
  }
}
