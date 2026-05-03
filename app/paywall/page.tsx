"use client";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function PaywallInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const from = sp.get("from") || "/";

  return (
    <div className="max-w-xl mx-auto p-6 rounded-2xl space-y-3 border-l-4 border-emerald-600 bg-emerald-50/40 dark:border-emerald-400 dark:bg-emerald-900/40">
      <h1 className="text-2xl font-bold dark:text-zinc-100">RotorReady is free for now</h1>
      <p className="text-gray-600 dark:text-zinc-300">
	        Subscriptions are disabled while RotorReady is in active development. You can use training, quizzes, procedures,
	        calculations and offline packages without payment or login.
      </p>
      <ul className="list-disc ml-5 text-sm text-gray-700 dark:text-zinc-300">
        <li>No Stripe checkout is shown.</li>
	        <li>No account is required.</li>
	        <li>All available RotorReady training content is open for this release.</li>
      </ul>
      <div className="flex gap-2">
        <button onClick={() => router.push(from)} className="px-4 py-2 rounded-lg bg-emerald-600 text-white">Continue</button>
        <button onClick={() => router.push("/")} className="px-4 py-2 rounded-lg bg-blue-600 text-white">Home</button>
      </div>
    </div>
  );
}

export default function PaywallPage() {
  return (
    <div className="min-h-[60vh] grid place-items-center p-6">
      <Suspense>
        <PaywallInner />
      </Suspense>
    </div>
  );
}
