"use client";
import { useEffect, useMemo, useState } from "react";
import BackButton from "@/components/BackButton";
import { auth, db } from "@/lib/firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

type Summary = { section: string; total: number; correct: number; percent: number; at: string };

export default function AccountPage() {
  const [history, setHistory] = useState<Summary[]>([]);
  const [ents, setEnts] = useState<{AW169?:boolean; AW189?:boolean; AW139?:boolean}>({});
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("rr_progress");
    if (raw) setHistory(JSON.parse(raw));
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, async (u) => {
      setEmail(u?.email || null);
      if (u && db) {
        try { const snap = await getDoc(doc(db, "users", u.uid)); setEnts(snap.data()?.entitlements || {}); } catch {}
      }
    });
    return () => unsub && unsub();
  }, []);

  const attempts = history.length;
  const last = attempts ? history[attempts - 1] : null;
  const best = attempts ? history.reduce((a,b)=> (b.percent > a.percent ? b : a)) : null;

  const active = useMemo(() => {
    return Object.entries(ents).filter(([,v])=>Boolean(v)).map(([k])=>k);
  }, [ents]);

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <BackButton />
      <h1 className="text-2xl font-bold">Min side</h1>

      <section className="bg-white rounded-xl border p-4">
        <h2 className="font-semibold mb-2">Tilgang</h2>
        {email ? (
          <div className="text-sm text-slate-700">Innlogget som <b>{email}</b></div>
        ) : (
          <div className="text-sm"><a href="/login" className="underline">Logg inn</a> for å se aktivt abonnement.</div>
        )}
        <div className="mt-2 flex gap-2 flex-wrap">
          {["AW169","AW189","AW139"].map(k => (
            <span key={k} className={`px-3 py-1 rounded-lg border text-sm ${active.includes(k) ? "bg-emerald-50 border-emerald-400 text-emerald-700" : "bg-white"}`}>{k} {active.includes(k) ? "✓" : ""}</span>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">Kjøp aktiveres via Stripe Checkout (se Paywall) eller av admin.</p>
      </section>

      <section className="bg-white rounded-xl border p-4">
        <h2 className="font-semibold mb-2">Progresjon</h2>
        {attempts === 0 ? (
          <p className="text-gray-600">Ingen gjennomførte quizer enda.</p>
        ) : (
          <div className="space-y-2">
            <div className="text-sm">Antall forsøk: <b>{attempts}</b></div>
            {last && <div className="text-sm">Sist: {last.section} — {last.correct}/{last.total} ({Math.round(last.percent)}%)</div>}
            {best && <div className="text-sm">Best: {best.section} — {best.correct}/{best.total} ({Math.round(best.percent)}%)</div>}
            <details className="mt-2">
              <summary className="cursor-pointer">Vis historikk</summary>
              <ul className="list-disc ml-5 text-sm">
                {history.map((h,i)=>(
                  <li key={i}>{new Date(h.at).toLocaleString()} — {h.section}: {h.correct}/{h.total} ({Math.round(h.percent)}%)</li>
                ))}
              </ul>
            </details>
          </div>
        )}
      </section>
    </div>
  );
}
