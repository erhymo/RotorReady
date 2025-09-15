"use client";
import * as React from "react";
import { auth } from "@/lib/firebase/client";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function ClientUserMenu() {
  const [email, setEmail] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, u => setEmail(u?.email || null));
    return () => unsub && unsub();
  }, []);

  if (!auth) return null;

  if (!email) {
    return <a href="/login" className="text-slate-700 hover:text-slate-900 text-sm">Logg inn</a>;
  }

  return (
    <div className="relative">
      <button onClick={()=>setOpen(v=>!v)} className="text-slate-700 hover:text-slate-900 text-sm">
        {email.split("@")[0]}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow z-50">
          <a href="/account" className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">Min side</a>
          <button onClick={()=>signOut(auth)} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">Logg ut</button>
        </div>
      )}
    </div>
  );
}
