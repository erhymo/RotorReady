"use client";
import { useState } from "react";

const ADMIN_USERNAME = process.env.NEXT_PUBLIC_ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "rotorready2025";

export default function AdminPage() {
  // ...existing code...
  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin</h1>
      <p>Du er logget inn som admin.</p>
      {/* Her kan du legge til adminfunksjoner og innhold */}
    </div>
  );
}
