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
        setErr(j?.error || "Checkout not configured");
        return;
      }
      if (j?.url) window.location.href = j.url;
    } catch (e: any) {
      setErr("Could not start checkout");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 rounded-2xl space-y-3 border-l-4 border-emerald-600 bg-emerald-50/40 dark:border-emerald-400 dark:bg-emerald-900/40">
      <h1 className="text-2xl font-bold dark:text-zinc-100">Full access requires a subscription</h1>
      <p className="text-gray-600 dark:text-zinc-300">
        Create an account to start a free 10-day trial for your chosen model, or purchase a subscription for full access to the question bank, lights training, and offline mode.
      </p>
      <ul className="list-disc ml-5 text-sm text-gray-700 dark:text-zinc-300">
        <li>Unlimited quizzes per module (Limitations, AFM, QRH …)</li>
        <li>Offline download for training without internet</li>
        <li>Future sync across devices</li>
      </ul>
      <div className="flex gap-2">
        <button onClick={() => { window.location.href = "/signup"; }} className="px-4 py-2 rounded-lg bg-blue-600 text-white">Start free trial</button>
        <button onClick={buyCheckout} disabled={busy} className="px-4 py-2 rounded-lg bg-emerald-600 text-white disabled:opacity-50">Buy (Checkout)</button>
        <button onClick={simulateBuy} className="px-4 py-2 rounded-lg bg-blue-600 text-white">Buy (DEV)</button>
        <button onClick={()=>router.push("/")} className="px-4 py-2 rounded-lg bg-emerald-600 text-white">Back to home</button>
      </div>
      {err && <p className="text-sm text-amber-700">{err}</p>}
      <p className="text-xs text-gray-500 dark:text-zinc-400">Stripe integration coming — this button simulates purchase in dev.</p>
    </div>
  );
}

export default function PaywallPage() {
  // DEV: Bypass paywall for quiz testing
  return null;
}
