import { adminDb } from "@/lib/firebase/admin";

export type TrafficMetrics = {
  /**
   * Antall brukere vi har registrert minst én aktivitet for (har lastSeenAt).
   */
  totalTrackedUsers: number;
  /**
   * Unike brukere som har vært aktive de siste 7 dagene.
   */
  activeLast7Days: number;
  /**
   * Unike brukere som har vært aktive de siste 30 dagene.
   */
  activeLast30Days: number;
  /**
   * Unike brukere som har vært aktive i dag.
   */
  activeToday: number;
};

function toDate(value: any): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === "string") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  if (typeof value === "object" && typeof (value as any).toDate === "function") {
    const d = (value as any).toDate();
    if (d instanceof Date && !Number.isNaN(d.getTime())) return d;
  }
  return null;
}

export function createEmptyTrafficMetrics(): TrafficMetrics {
  return {
    totalTrackedUsers: 0,
    activeLast7Days: 0,
    activeLast30Days: 0,
    activeToday: 0,
  };
}

export async function getTrafficMetrics(now: Date = new Date()): Promise<TrafficMetrics> {
  const snapshot = await adminDb.collection("users").select("lastSeenAt").get();

  const nowMs = now.getTime();
  const sevenDaysAgoMs = nowMs - 7 * 24 * 60 * 60 * 1000;
  const thirtyDaysAgoMs = nowMs - 30 * 24 * 60 * 60 * 1000;
  const todayKey = now.toISOString().slice(0, 10);

  let totalTrackedUsers = 0;
  let activeLast7Days = 0;
  let activeLast30Days = 0;
  let activeToday = 0;

  snapshot.forEach((doc: any) => {
    const data = doc.data() as any;
    const lastSeen = toDate(data?.lastSeenAt);
    if (!lastSeen) return;

    const ts = lastSeen.getTime();
    totalTrackedUsers += 1;

    if (ts >= sevenDaysAgoMs) {
      activeLast7Days += 1;
    }
    if (ts >= thirtyDaysAgoMs) {
      activeLast30Days += 1;
    }
    if (lastSeen.toISOString().slice(0, 10) === todayKey) {
      activeToday += 1;
    }
  });

  return {
    totalTrackedUsers,
    activeLast7Days,
    activeLast30Days,
    activeToday,
  };
}

