"use client";
import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, db } from "@/lib/firebase/client";
import { signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";

function LoginInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/account";
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [err, setErr] = React.useState("");
  const [veri, setVeri] = React.useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setErr(""); setVeri("");
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      if (!cred.user.emailVerified) {
        setVeri("E-post ikke verifisert. Sender verifiseringslink…");
        try { await sendEmailVerification(cred.user); } catch {}
        return;
      }
      try {
        // Ensure user doc exists with email
        await setDoc(doc(db, "users", cred.user.uid), { email }, { merge: true });
        // If webhook granted entitlements by email, merge them into the user doc
        const emailKey = (email || "").toLowerCase();
        const mapRef = doc(db, "users_by_email", emailKey);
        const mapped = await getDoc(mapRef);
        if (mapped.exists()) {
          await setDoc(doc(db, "users", cred.user.uid), mapped.data(), { merge: true });
          await deleteDoc(mapRef);
        }
      } catch {}
      router.push(next);
    } catch (e: any) {
      setErr(e?.message || "Login feilet");
    }
  }

  return (
    <div className="max-w-sm mx-auto p-6 bg-white dark:bg-zinc-900 dark:border-zinc-700 border rounded-2xl space-y-3">
      <h1 className="text-2xl font-bold">Logg inn</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border rounded px-3 py-2 dark:bg-zinc-900 dark:border-zinc-700" placeholder="E-post" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border rounded px-3 py-2 dark:bg-zinc-900 dark:border-zinc-700" placeholder="Passord" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        {err && <div className="text-sm text-red-600">{err}</div>}
        {veri && <div className="text-sm text-amber-700">{veri}</div>}
        <button className="w-full rounded bg-blue-600 text-white py-2 font-medium">Logg inn</button>
      </form>
      <div className="text-sm"><a className="underline" href="/signup">Opprett konto</a></div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Laster…</div>}>
      <LoginInner />
    </Suspense>
  );
}
export const dynamic = "force-dynamic";
