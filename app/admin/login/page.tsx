"use client";
import { useState } from "react";

const ADMIN_USERNAME = process.env.NEXT_PUBLIC_ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "rotorready2025";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Set session cookie for middleware
  document.cookie = `SESSION_COOKIE=ok; path=/; SameSite=Strict; Max-Age=${60*60*8}`;
      window.location.href = "/admin";
    } else {
      setError("Feil brukernavn eller passord");
    }
  }

  return (
    <div className="max-w-sm mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
      <form onSubmit={handleLogin} className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Brukernavn" value={username} onChange={e=>setUsername(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Passord" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button className="w-full rounded bg-blue-600 text-white py-2 font-medium">Logg inn</button>
      </form>
    </div>
  );
}
