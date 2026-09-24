import AirportDetailClient from "@/app/airports/_components/AirportDetailClient";
import { NO_AIRPORTS } from "@/lib/airports/no_icao";

// One page per airport, built ahead of time so the native app can carry them in its bundle.
export function generateStaticParams() {
  return NO_AIRPORTS.map((a) => ({ icao: a.icao }));
}

export default function AirportDetailPage() {
  return <AirportDetailClient />;
}
