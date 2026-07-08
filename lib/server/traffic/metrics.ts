import { adminDb } from "@/lib/firebase/admin";

export type TrafficWindowMetrics = {
  appOpens: number;
  uniqueVisitors: number;
};

export type TrafficMetrics = {
  /**
   * Antall lokale installasjoner/besøkende vi har registrert minst én app-open for.
   */
  totalTrackedUsers: number;
  last1Day: TrafficWindowMetrics;
  last7Days: TrafficWindowMetrics;
  last30Days: TrafficWindowMetrics;
  /** Legacy field kept for older admin clients. */
  activeLast7Days: number;
  /** Legacy field kept for older admin clients. */
  activeLast30Days: number;
  /** Legacy field kept for older admin clients. */
  activeToday: number;
};

const EMPTY_WINDOW: TrafficWindowMetrics = { appOpens: 0, uniqueVisitors: 0 };

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
    last1Day: { ...EMPTY_WINDOW },
    last7Days: { ...EMPTY_WINDOW },
    last30Days: { ...EMPTY_WINDOW },
    activeLast7Days: 0,
    activeLast30Days: 0,
    activeToday: 0,
  };
}

export async function getTrafficMetrics(now: Date = new Date()): Promise<TrafficMetrics> {
  const nowMs = now.getTime();
  const oneDayAgoMs = nowMs - 24 * 60 * 60 * 1000;
  const sevenDaysAgoMs = nowMs - 7 * 24 * 60 * 60 * 1000;
  const thirtyDaysAgoMs = nowMs - 30 * 24 * 60 * 60 * 1000;
  const thirtyDaysAgoIso = new Date(thirtyDaysAgoMs).toISOString();

  const [eventsSnapshot, visitorsSnapshot] = await Promise.all([
    adminDb.collection("trafficEvents").where("createdAt", ">=", thirtyDaysAgoIso).get(),
    adminDb.collection("trafficVisitors").select("lastSeenAt").get(),
  ]);

  const unique1d = new Set<string>();
  const unique7d = new Set<string>();
  const unique30d = new Set<string>();
  let opens1d = 0;
  let opens7d = 0;
  let opens30d = 0;

  eventsSnapshot.forEach((doc: any) => {
    const data = doc.data() as any;
    const createdAt = toDate(data?.createdAt);
    if (!createdAt) return;
    const ts = createdAt.getTime();
    const visitorId = typeof data?.visitorId === "string" && data.visitorId ? data.visitorId : doc.id;

    if (ts >= thirtyDaysAgoMs) {
      opens30d += 1;
      unique30d.add(visitorId);
    }
    if (ts >= sevenDaysAgoMs) {
      opens7d += 1;
      unique7d.add(visitorId);
    }
    if (ts >= oneDayAgoMs) {
      opens1d += 1;
      unique1d.add(visitorId);
    }
  });

  const trackedVisitors = new Set<string>();
  visitorsSnapshot.forEach((doc: any) => {
    const data = doc.data() as any;
    const lastSeen = toDate(data?.lastSeenAt);
    if (!lastSeen) return;
    trackedVisitors.add(doc.id);

    const ts = lastSeen.getTime();
    if (ts >= thirtyDaysAgoMs) unique30d.add(doc.id);
    if (ts >= sevenDaysAgoMs) unique7d.add(doc.id);
    if (ts >= oneDayAgoMs) unique1d.add(doc.id);
  });

  return {
    totalTrackedUsers: trackedVisitors.size,
    last1Day: { appOpens: opens1d, uniqueVisitors: unique1d.size },
    last7Days: { appOpens: opens7d, uniqueVisitors: unique7d.size },
    last30Days: { appOpens: opens30d, uniqueVisitors: unique30d.size },
    activeLast7Days: unique7d.size,
    activeLast30Days: unique30d.size,
    activeToday: unique1d.size,
  };
}

