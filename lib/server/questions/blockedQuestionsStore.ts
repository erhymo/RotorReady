import { adminDb } from "@/lib/firebase/admin";

const COLLECTION = "blocked_questions";

export type BlockedQuestion = {
  id: string; // questionId
  section?: string;
  sectionId?: string;
  dataSource?: string | null;
  dataFile?: string | null;
  createdAt: string;
};

export async function addBlockedQuestion(entry: {
  id: string;
  section?: string;
  sectionId?: string;
  dataSource?: string | null;
  dataFile?: string | null;
}) {
  const now = new Date().toISOString();
  const docRef = adminDb.collection(COLLECTION).doc(entry.id);
  await docRef.set(
    {
      id: entry.id,
      section: entry.section ?? null,
      sectionId: entry.sectionId ?? null,
      dataSource: entry.dataSource ?? null,
      dataFile: entry.dataFile ?? null,
      createdAt: now,
    },
    { merge: true },
  );
  return { id: entry.id };
}

export async function listBlockedQuestionIds(): Promise<string[]> {
  const snap = await adminDb.collection(COLLECTION).get();
  return snap.docs.map((d) => d.id);
}

