"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { NO_AIRPORTS } from "@/lib/airports/no_icao";
import { distanceNm } from "@/lib/geo/haversine";

export default function WeatherHubClient() {
  const router = useRouter();
  const [pos, setPos] = useState<{ lat: number; lon: number } | null>(null);
  const [geoErr, setGeoErr] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoErr("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (res) => {
        setPos({ lat: res.coords.latitude, lon: res.coords.longitude });
      },
      (err) => setGeoErr(err.message),
      { enableHighAccuracy: false, maximumAge: 60_000, timeout: 8_000 }
    );
  }, []);

  const nearestSorted = useMemo(() => {
    const list = NO_AIRPORTS.map((a) => ({
      ...a,
      distNm: pos ? distanceNm(pos.lat, pos.lon, a.lat, a.lon) : null,
    }));
    list.sort((a, b) => {
      if (a.distNm == null && b.distNm == null) return a.icao.localeCompare(b.icao);
      if (a.distNm == null) return 1;
      if (b.distNm == null) return -1;
      return a.distNm - b.distNm;
    });
    return list;
  }, [pos]);

  const primary = useMemo(() => (nearestSorted.length ? nearestSorted[0] : null), [nearestSorted]);

  useEffect(() => {
    if (primary?.icao) {
      router.replace(`/weather/${primary.icao}`);
    }
  }, [primary?.icao]);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Weather planning</h1>
      <p className="text-slate-600 dark:text-zinc-300">
        {geoErr ? "Location unavailable. Please open a specific airport (e.g. /weather/ENBR)." : "Finding your nearest airport…"}
      </p>
    </div>
  );
}

