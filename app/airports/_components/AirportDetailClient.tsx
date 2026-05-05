"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AppTopBar from "@/components/AppTopBar";

export default function AirportDetailClient() {
  const { icao: icaoParam } = useParams() as { icao: string };
  const icao = useMemo(() => (icaoParam || "").toString().toUpperCase(), [icaoParam]);
  const [data, setData] = useState<{ ats: string | null; fuel: string | null; sourceUrl?: string; updatedAt?: string } | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!icao) return;
    let cancelled = false;
    fetch(`/api/airports/hours?icao=${icao}`, { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then((j) => { if (!cancelled) setData(j); })
      .catch((e) => { if (!cancelled) setErr(String(e)); });
    return () => { cancelled = true; };
  }, [icao]);

  return (
    <>
    <AppTopBar title={icao} backHref="/airports" backLabel="Airports" />
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{icao}</h1>

      {err && (
        <div className="text-sm text-red-600 dark:text-red-400">{err}</div>
      )}

      <div className="rounded-lg border border-slate-200 dark:border-zinc-800 divide-y divide-slate-200 dark:divide-zinc-800 overflow-hidden">
        <div className="px-4 py-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="text-sm text-slate-500 dark:text-zinc-400">ATS opening hours</div>
          <div className="sm:col-span-2 font-medium text-slate-900 dark:text-zinc-100">{data?.ats ?? "Not available – see AIP"}</div>
        </div>
        <div className="px-4 py-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="text-sm text-slate-500 dark:text-zinc-400">Fuel opening hours</div>
          <div className="sm:col-span-2 font-medium text-slate-900 dark:text-zinc-100">{data?.fuel ?? "Not available – see AIP"}</div>
        </div>
      </div>

	      <div className="text-xs text-slate-500 dark:text-zinc-400">
	        Note: Times without parentheses are winter time (UTC+1). Times in parentheses are summer time (UTC+2).
	      </div>


      <div className="text-xs text-slate-500 dark:text-zinc-400">
        Source: Avinor AIS. {data?.sourceUrl && (<a className="text-blue-600 hover:underline dark:text-blue-400" target="_blank" href={data.sourceUrl}>Open AIP</a>)}. Updated twice daily{data?.updatedAt ? ` — Last updated: ${new Date(data.updatedAt).toLocaleString()}` : ''}.
      </div>
    </div>
    </>
  );
}

