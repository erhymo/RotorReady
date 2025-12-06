"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useActiveModelVariant } from "@/lib/models/hooks";

// Simple client-side access guard
// Rules now:
// - Logged-in users: full access
// - Not logged-in:
//   * 10-day local trial per productId
//   * After expiry: redirect to signup

const TRIAL_DAYS = 10;

function nowMs() {
  return Date.now();
}

function msFromDays(days: number) {
  return days * 24 * 60 * 60 * 1000;
}

export default function AccessGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { variant, loading: variantLoading } = useActiveModelVariant();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    if (variantLoading) return;
    let unsub: (() => void) | undefined;

    const productId = variant?.productId || "AW169";
    const key = `rr_trial:${productId}`;

    function allow() {
      setAllowed(true);
    }
    function block() {
      setAllowed(false);
      const from =
        typeof window !== "undefined" && typeof window.location?.pathname === "string"
          ? window.location.pathname || "/"
          : "/";
      router.push(`/signup?from=${encodeURIComponent(from)}`);
    }

    const runTrialCheck = () => {
      try {
        const raw = localStorage.getItem(key);
        const now = nowMs();
        if (!raw) {
          const expiresAt = new Date(now + msFromDays(TRIAL_DAYS)).toISOString();
          const startedAt = new Date().toISOString();
          localStorage.setItem(
            key,
            JSON.stringify({ active: true, startedAt, expiresAt })
          );
          allow();
          return;
        }
        const data = JSON.parse(raw);
        const exp = new Date(data?.expiresAt || 0).getTime();
        const active = data?.active !== false;
        if (Number.isFinite(exp) && exp > now && active) {
          allow();
        } else {
          block();
        }
      } catch {
        // If anything goes wrong with localStorage/JSON, be permissive
        allow();
      }
    };

    try {
      if (!auth) {
        // No Firebase on client (e.g. localhost without env) → rely on trial
        runTrialCheck();
      } else {
        unsub = onAuthStateChanged(auth, (user) => {
          if (user) {
            allow();
          } else {
            runTrialCheck();
          }
        });
      }
    } catch {
      // Fallback: rely on trial if subscription setup fails
      runTrialCheck();
    }

    return () => {
      if (unsub) unsub();
    };
  }, [variantLoading, variant?.productId, router]);

  if (allowed !== true) return null;
  return <>{children}</>;
}

