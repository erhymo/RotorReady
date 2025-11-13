"use client";

import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Link from "next/link";


export default function ClientUserMenu() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);


  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);




  const handleSignOut = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      setShowMenu(false);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (loading) {
    return <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-zinc-700 animate-pulse" />;
  }

  if (!user || (user as any)?.isAnonymous) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const providerEmail = user?.providerData?.find((p) => p.email)?.email || "";
  const labelBase = (user.displayName || user.email || providerEmail || "").trim();
  const label = labelBase ? (labelBase.includes("@") ? labelBase.split("@")[0] : labelBase) : "Logged in";
  const initial = (label[0] || "U").toUpperCase();

  return (
    <div className="relative">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-2 rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <div className="h-8 w-8 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
            {initial}
          </div>
          <span className="text-sm font-medium text-slate-700 dark:text-zinc-200">
            {label}
          </span>
        </button>
      </div>

      {showMenu && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-lg z-50">
          <div className="p-3 border-b border-slate-200 dark:border-zinc-700">
            <div className="text-sm font-medium text-slate-900 dark:text-white">
              {label}
            </div>
            <div className="text-xs text-slate-500 dark:text-zinc-400">
              {user.email || providerEmail}
            </div>
          </div>

          <div className="p-1">
            <Link
              href="/account"
              className="block w-full rounded-md px-3 py-2 text-left text-sm text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors"
              onClick={() => setShowMenu(false)}
            >
              Account Settings
            </Link>
            <button
              onClick={handleSignOut}
              className="block w-full rounded-md px-3 py-2 text-left text-sm text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
