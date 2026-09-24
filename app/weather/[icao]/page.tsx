import WeatherDetailClient from "@/app/weather/_components/WeatherDetailClient";
import { NO_AIRPORTS } from "@/lib/airports/no_icao";

// One page per airport in the (compiled-in) Norwegian list, built ahead of time so the
// native app can carry them in its bundle instead of handing Weather off to Chrome.
// An ICAO outside the list still renders on the web, where pages are served on demand.
export function generateStaticParams() {
  return NO_AIRPORTS.map((a) => ({ icao: a.icao }));
}

export default function WeatherDetailPage() {
  return <WeatherDetailClient />;
}
