"use client";

import { useEffect } from "react";

import { installGlobalErrorReporting } from "@/lib/clientErrors";

// Reports uncaught errors and unhandled promise rejections anywhere in the app.
// Render errors caught by an error boundary never reach window, so app/error.tsx
// reports those itself.
export default function ErrorReporter() {
  useEffect(() => installGlobalErrorReporting(), []);
  return null;
}
