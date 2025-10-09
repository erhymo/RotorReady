import { adminDb } from "@/lib/firebase/admin";

export type AdminFlag = {
  id: string;
  section: string;
  sectionId?: string;
  questionId: string;
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
  userId?: string;
  createdAt: string;
  status: "open" | "reviewed-OK" | "rejected";
};

const COLLECTION = "flags";

function toIso(input: any): string {
  if (!input) return new Date().toISOString();
  if (typeof input === "string") return input;
  if (typeof input?.toDate === "function") return input.toDate().toISOString();
  try { return new Date(input).toISOString(); } catch { return new Date().toISOString(); }
}

export async function listFlags(): Promise<AdminFlag[]> {
  // Order newest first; tolerate missing fields
  const snap = await adminDb.collection(COLLECTION).orderBy("createdAt", "desc").get();
  return snap.docs.map((d) => {
    const data = d.data() || {};
    return {
      id: d.id,
      section: String(data.section || ""),
      sectionId: data.sectionId || undefined,
      questionId: String(data.questionId || ""),
      dataSource: data.dataSource,
      dataFile: data.dataFile ?? null,
      snapshot: data.snapshot || undefined,
      reason: data.reason || undefined,
      userId: data.userId || undefined,
      createdAt: toIso(data.createdAt),
      status: (data.status as AdminFlag["status"]) || "open",
    } satisfies AdminFlag;
  });
}

export async function addFlag(payload: Omit<AdminFlag, "id" | "createdAt" | "status"> & Partial<Pick<AdminFlag, "status" | "createdAt">>) {
  const now = new Date().toISOString();
  const docRef = await adminDb.collection(COLLECTION).add({
    ...payload,
    status: payload.status ?? "open",
    createdAt: payload.createdAt ?? now,
  });
  const snap = await docRef.get();
  const data = snap.data() || {};
  return {
    id: docRef.id,
    section: String(data.section || payload.section || ""),
    sectionId: data.sectionId || payload.sectionId,
    questionId: String(data.questionId || payload.questionId || ""),
    dataSource: data.dataSource ?? payload.dataSource,
    dataFile: data.dataFile ?? payload.dataFile ?? null,
    snapshot: data.snapshot ?? payload.snapshot,
    reason: data.reason ?? payload.reason,
    userId: data.userId ?? payload.userId,
    createdAt: toIso(data.createdAt) || now,
    status: (data.status as AdminFlag["status"]) || "open",
  } as AdminFlag;
}

export async function updateFlagStatus(id: string, status: AdminFlag["status"]) {
  const docRef = adminDb.collection(COLLECTION).doc(id);
  await docRef.update({ status });
}

