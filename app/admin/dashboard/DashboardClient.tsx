"use client";
import { useEffect, useState } from "react";
import AdminPanel from "./AdminPanel";

export default function DashboardClient() {
  const [initial, setInitial] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const [sectionsRes, flagsRes, messagesRes] = await Promise.all([
          fetch("/api/admin/sections").then(r => r.json()),
          fetch("/api/admin/flags").then(r => r.json()),
          fetch("/api/admin/messages").then(r => r.json()),
        ]);
        setInitial({
          sections: sectionsRes.sections,
          flags: flagsRes,
          messages: messagesRes,
        });
        setErrorMsg("");
      } catch (e) {
        setErrorMsg(e?.message || "Ukjent feil ved lasting av admin-data.");
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  if (loading) return <div className="max-w-2xl mx-auto p-6 mt-10 text-center text-lg">Laster admin-data…</div>;
  if (errorMsg || !initial) return (
    <div className="max-w-2xl mx-auto p-6 mt-10">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <strong>Feil ved lasting av admin-data:</strong> {errorMsg || "Ingen data tilgjengelig."}
      </div>
    </div>
  );
  return <AdminPanel initial={initial} />;
}
