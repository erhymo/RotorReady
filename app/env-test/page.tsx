"use client";
import React from "react";

export default function EnvTestPage() {
  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Env Test</h1>
      <div className="mb-2">NEXT_PUBLIC_FIREBASE_API_KEY:</div>
      <pre className="bg-gray-100 p-2 rounded border mb-4">{process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "(not set)"}</pre>
      <div className="mb-2">NEXT_PUBLIC_TEST_KEY:</div>
      <pre className="bg-gray-100 p-2 rounded border">{process.env.NEXT_PUBLIC_TEST_KEY || "(not set)"}</pre>
    </div>
  );
}