"use client";
import { useEffect, useState } from "react";
import BackButton from "@/components/BackButton";
import { saveSectionOffline, loadSectionOffline, clearOfflineSection, listOffline } from "@/lib/offline";
import { isPaidAsync } from "@/lib/quota";
import { useRouter } from "next/navigation";

async function fetchSection(id: string) {
  const res = await fetch(`/quiz-data/sections/${id}.json`, { cache: "no-store" });
  if (!res.ok) throw new Error("Could not fetch section");
  return res.json();
}

export default function OfflinePage() {
  const [status, setStatus] = useState<string>("");
  const [hasLimitations, setHasLimitations] = useState<boolean>(false);
  const [keys, setKeys] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const paid = await isPaidAsync();
      if (!paid) router.replace("/paywall?from=/offline");
    })();
  }, [router]);

  useEffect(() => {
    setHasLimitations(!!loadSectionOffline("limitations"));
    setKeys(listOffline());
  }, []);

  async function downloadLimitations() {
    setStatus("Laster ned 'Limitations'…");
    try {
      const data = await fetchSection("limitations");
      saveSectionOffline("limitations", data);
      setHasLimitations(true);
      setKeys(listOffline());
      setStatus("✓ 'Limitations' lagret for offline bruk");
    } catch {
      setStatus("❌ Klarte ikke å laste ned");
    }
  }

  function clearLimitations() {
    clearOfflineSection("limitations");
    setHasLimitations(false);
    setKeys(listOffline());
    setStatus("Slettet lokale offline-data");
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <BackButton />
      <h1 className="text-2xl font-bold mb-4">Offline pakker</h1>
      <section className="bg-white rounded-xl border p-4 space-y-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Limitations</span>
          {hasLimitations ? <span className="text-green-600 text-xs">Lagret</span> : <span className="text-gray-400 text-xs">Ikke lagret</span>}
        </div>
        <button onClick={downloadLimitations} className="rounded bg-blue-600 text-white px-4 py-2 font-medium">Last ned/oppdater</button>
        {hasLimitations && <button onClick={clearLimitations} className="rounded bg-gray-200 text-gray-800 px-4 py-2 font-medium">Fjern fra enhet</button>}
        <div className="text-xs text-gray-500">{status}</div>
      </section>
      <section className="bg-white rounded-xl border p-4 mt-6">
        <h2 className="font-semibold mb-2">Andre seksjoner lagret offline</h2>
        <ul className="list-disc ml-5 text-sm">
          {keys.filter(k=>k!=="limitations").map(k=>(
            <li key={k}>{k}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
