"use client";
import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, db } from "@/lib/firebase/client";
import { signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { mapAuthError } from "@/lib/auth/errors";


function LoginInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/account";
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [err, setErr] = React.useState("");


  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setErr(""); setVeri("");
    if (!auth) {
      setErr("Innlogging er utilgjengelig for øyeblikket. Prøv igjen senere.");
      return;
    }
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      if (!cred.user.emailVerified) {

        try { await sendEmailVerification(cred.user); } catch {}
        // Redirect til hovedsiden
        router.push("/account");
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
      router.push("/account");
    } catch (e: any) {
        console.error('Login error:', e);
        setErr(mapAuthError(e?.code) || e?.message || "Klarte ikke logge inn");
    }
  }

  return (
    <div className="max-w-sm mx-auto p-6 rounded-2xl space-y-3 border-l-4 border-blue-600 bg-blue-50/40 dark:border-blue-400 dark:bg-blue-900/40">
      <h1 className="text-2xl font-bold dark:text-zinc-100">Logg inn</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full border rounded px-3 py-2 dark:bg-blue-900 dark:border-blue-400 dark:text-zinc-100 placeholder:text-gray-500 dark:placeholder:text-zinc-300"
          placeholder="E-post"
          value={email}
          onChange={e=>setEmail(e.target.value)}
        />
        <input
          className="w-full border rounded px-3 py-2 dark:bg-blue-900 dark:border-blue-400 dark:text-zinc-100 placeholder:text-gray-500 dark:placeholder:text-zinc-300"
          placeholder="Passord"
          type="password"
          value={password}
          onChange={e=>setPassword(e.target.value)}
        />
        {err && <div className="text-sm text-red-600 dark:text-red-400">{err}</div>}

        <button type="submit" className="w-full rounded bg-blue-600 text-white py-2 font-medium">Logg inn</button>
      </form>
      <div className="text-sm"><a className="underline dark:text-zinc-100" href="/signup">Opprett konto</a></div>
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
