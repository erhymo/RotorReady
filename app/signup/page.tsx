"use client";
import * as React from "react";
import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase/client";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

function SignupInner() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [msg, setMsg] = React.useState("");
  const [err, setErr] = React.useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setErr(""); setMsg("");
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      try { await setDoc(doc(db, "users", cred.user.uid), { email, createdAt: new Date().toISOString() }, { merge: true }); } catch {}
      try { await sendEmailVerification(cred.user); } catch {}
      setMsg("Konto opprettet. Sjekk e-post for verifiseringslink.");
    } catch (e: any) {
      setErr(e?.message || "Klarte ikke opprette konto");
    }
  }

  return (
    <div className="max-w-sm mx-auto p-6 bg-white dark:bg-zinc-900 dark:border-zinc-700 border rounded-2xl space-y-3">
      <h1 className="text-2xl font-bold">Opprett konto</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border rounded px-3 py-2 dark:bg-zinc-900 dark:border-zinc-700" placeholder="E-post" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border rounded px-3 py-2 dark:bg-zinc-900 dark:border-zinc-700" placeholder="Passord" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        {err && <div className="text-sm text-red-600">{err}</div>}
        {msg && <div className="text-sm text-emerald-700">{msg}</div>}
        <button className="w-full rounded bg-blue-600 text-white py-2 font-medium">Opprett</button>
      </form>
      <div className="text-sm"><a className="underline" href="/login">Har konto? Logg inn</a></div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Laster…</div>}>
      <SignupInner />
    </Suspense>
  );
}
export const dynamic = "force-dynamic";
