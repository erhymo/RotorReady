"use client";
import { useEffect, useMemo, useState } from "react";
import BackButton from "@/components/BackButton";
import { auth, db } from "@/lib/firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

type Summary = { section: string; total: number; correct: number; percent: number; at: string };

export default function AccountPage() {
  function startWrongOnly() {
    const raw = localStorage.getItem("rr_progress_last_wrong:limitations");
    if (!raw) { alert("Ingen feilsett tilgjengelig. Fullfør en quiz først."); return; }
    const data = JSON.parse(raw);
    sessionStorage.setItem("limq_session", JSON.stringify(data));
    window.location.href = "/limitations-quiz/1";
  }
  const [history, setHistory] = useState<Summary[]>([]);
  const [ents, setEnts] = useState<{AW169?:boolean; AW189?:boolean; AW139?:boolean}>({});
  const [email, setEmail] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("rr_progress");
    if (raw) setHistory(JSON.parse(raw));
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, async (u) => {
      setEmail(u?.email || null);
      setLoggedIn(!!u);
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
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <BackButton className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl mb-2" />
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Min side</h1>
        <p className="text-slate-600 dark:text-zinc-300 mt-2">Din tilgang og progresjon i RotorReady.</p>
      </header>

      <section className="space-y-3">
        <div className="rounded-xl border-l-4 border-emerald-600 bg-emerald-50/40 dark:border-emerald-400 dark:bg-emerald-900/40 px-5 py-4 flex items-start justify-between gap-4">
          <div>
            <div className="font-semibold text-slate-900 dark:text-zinc-100">Tilgang</div>
            <div className="text-sm text-slate-700 dark:text-zinc-300 mt-0.5">
              {loggedIn ? "Innlogget" : <span><a href="/login" className="underline">Logg inn</a> for å se aktivt abonnement.</span>}
            </div>
            <div className="mt-2 flex gap-2 flex-wrap">
              <span key="AW169" className={`px-3 py-1 rounded-lg border text-sm ${active.includes("AW169") ? "bg-emerald-50 border-emerald-400 text-emerald-700" : "bg-white dark:bg-zinc-900 dark:text-zinc-100"}`}>AW169 {active.includes("AW169") ? "✓" : ""}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-2">Kjøp aktiveres via Stripe Checkout (se Paywall) eller av admin.</p>
          </div>
          {loggedIn && (
            <button
              className="px-4 py-2 rounded bg-gray-800 text-white text-sm hover:bg-gray-900 mt-2"
              onClick={async () => {
                await import("firebase/auth").then(({ getAuth, signOut }) => signOut(getAuth(auth.app)));
                window.location.href = "/";
              }}
            >
              Logg ut
            </button>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <div className="rounded-xl border-l-4 border-blue-600 bg-blue-50/40 dark:border-blue-400 dark:bg-blue-900/40 px-5 py-4">
          <div className="font-semibold text-slate-900 dark:text-zinc-100">Progresjon</div>
          {attempts === 0 ? (
            <p className="text-gray-600 dark:text-zinc-300">Ingen gjennomførte quizer enda.</p>
          ) : (
            <div className="space-y-2">
              <div className="text-sm text-slate-900 dark:text-zinc-100">Antall forsøk: <b>{attempts}</b></div>
              {last && <div className="text-sm text-slate-900 dark:text-zinc-100">Sist: {last.section} — {last.correct}/{last.total} ({Math.round(last.percent)}%)</div>}
              {best && <div className="text-sm text-slate-900 dark:text-zinc-100">Best: {best.section} — {best.correct}/{best.total} ({Math.round(best.percent)}%)</div>}
              <details className="mt-2">
                <summary className="cursor-pointer text-slate-900 dark:text-white">Vis historikk</summary>
                <ul className="list-disc ml-5 text-sm text-slate-900 dark:text-zinc-100">
                  {history.map((h,i)=>(
                    <li key={i}>{new Date(h.at).toLocaleString()} — {h.section}: {h.correct}/{h.total} ({Math.round(h.percent)}%)</li>
                  ))}
                </ul>
              </details>
            </div>
          )}
        </div>
        <div className="bg-slate-900 dark:bg-zinc-900 dark:border-zinc-700 border rounded-xl p-4 mt-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-white dark:text-zinc-100">Øv kun på feil</div>
              <div className="text-sm text-gray-300 dark:text-zinc-300">Bygger et sett av spørsmålene du nylig hadde feil.</div>
            </div>
            <button onClick={startWrongOnly} className="px-4 py-2 rounded-lg border bg-slate-900 text-white dark:bg-zinc-900 dark:text-zinc-100">Start</button>
          </div>
        </div>
      </section>
    </div>
  );
}
