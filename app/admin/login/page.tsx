"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";

function AdminLoginInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/admin/dashboard";

  // Automatisk login for lokal testing, men unngå loop hvis allerede logget inn
  // Fjern all automatisk login og redirect for testing
  return (
    <div className="max-w-sm mx-auto p-6 bg-white rounded-xl shadow mt-10 text-center">
      <h1 className="text-xl font-bold mb-4">Admin åpen for testing</h1>
      <p className="text-gray-500 mb-6">Ingen innlogging kreves i testmodus.</p>
      <a
        href="/admin/dashboard"
        className="inline-block w-full py-3 rounded bg-sky-700 text-white font-semibold text-lg shadow hover:bg-sky-800 transition mb-3"
      >
        Gå til admin dashboard (vanlig)
      </a>
      <button
        className="inline-block w-full py-3 rounded bg-green-700 text-white font-semibold text-lg shadow hover:bg-green-800 transition"
        style={{marginTop: 8}}
        onClick={() => { window.location.href = "/admin/dashboard"; }}
      >
        Gå til admin dashboard (direkte)
      </button>
    </div>
  );
}

export default function AdminLogin() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Laster…</div>}>
      <AdminLoginInner />
    </Suspense>
  );
}
