"use client";

import { useEffect, useState } from 'react';
import { firebaseApp } from '../lib/firebase/client';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

export default function ClientUserMenu() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  return (
    <div style={{ padding: 8 }}>
      {user ? (
        <span className="text-sm text-slate-700 dark:text-zinc-200">Logget inn</span>
      ) : (
        <a
          href="/login"
          className="text-sm text-slate-700 dark:text-zinc-200 underline hover:text-blue-700 dark:hover:text-blue-400"
        >
          Logg inn
        </a>
      )}
    </div>
  );
}
