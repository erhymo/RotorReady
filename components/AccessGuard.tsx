"use client";

import React from "react";

// RotorReady's first App Store release is fully open. Keep this component as a
// stable wrapper for older route code, but never redirect or hide content.

export default function AccessGuard({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

