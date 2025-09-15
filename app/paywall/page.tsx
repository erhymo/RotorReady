"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function PaywallInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const from = sp.get("from") || "/";
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  function simulateBuy() {
    localStorage.setItem("rr_paid", "1");
    router.push(from);
  }

  async function buyCheckout() {
    try {
      setBusy(true); setErr("");
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const j = await res.json();
      if (!res.ok) {
        setErr(j?.error || "Checkout ikke konfigurert");
        return;
      }
      if (j?.url) window.location.href = j.url;
    } catch (e: any) {
      setErr("Klarte ikke starte checkout");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-zinc-900 dark:border-zinc-700 border rounded-2xl space-y-3">
      <h1 className="text-2xl font-bold">Fortsett med RotorReady</h1>
      <p className="text-gray-600 dark:text-zinc-300">Du har brukt opp gratis kvoten (3 økter per modul). Kjøp tilgang for å låse opp ubegrenset trening og offline-modus.</p>
      <ul className="list-disc ml-5 text-sm text-gray-700 dark:text-zinc-300">
        <li>Ubegrenset quiz per modul (Limitations, AFM, QRH …)</li>
        <li>Offline-nedlasting for trening uten nett</li>
        <li>Fremtidig synk mellom enheter</li>
      </ul>
      <div className="flex gap-2">
        <button onClick={buyCheckout} disabled={busy} className="px-4 py-2 rounded-lg bg-emerald-600 text-white disabled:opacity-50">Kjøp (Checkout)</button>
        <button onClick={simulateBuy} className="px-4 py-2 rounded-lg bg-blue-600 text-white">Kjøp (DEV)</button>
        <button onClick={()=>router.push("/")} className="px-4 py-2 rounded-lg border bg-white dark:bg-zinc-900">Til forsiden</button>
      </div>
      {err && <p className="text-sm text-amber-700">{err}</p>}
      <p className="text-xs text-gray-500 dark:text-zinc-400">Stripe-integrasjon kommer — denne knappen simulerer kjøp i dev.</p>
    </div>
  );
}

export default function PaywallPage() {
  // DEV: Bypass paywall for quiz testing
  return null;
}
