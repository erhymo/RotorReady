"use client";

import React from "react";
import { usePathname } from "next/navigation";
import AccessGuard from "@/components/AccessGuard";

const PROTECTED_PREFIXES = [
  "/quiz",
  "/offline",
  "/training",
  "/limitations-quiz",
  "/engine-systems-quiz",
  "/avionics-fms-limitations-quiz",
  "/emergency-quiz",
  "/qrh-afm-quiz",
];

const PUBLIC_PREFIXES = [
  "/auth",
  "/login",
  "/signup",
  "/api",
  "/admin", // keep admin routes out of this client guard; they have their own auth
];

export default function ProtectedRoutes({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";

  const isPublic = PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  if (!isProtected || isPublic) return <>{children}</>;
  return <AccessGuard>{children}</AccessGuard>;
}

