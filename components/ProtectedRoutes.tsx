"use client";

import React from "react";

export default function ProtectedRoutes({ children }: { children: React.ReactNode }) {
  // Appen er gratis enn så lenge. Behold komponenten som et stabilt wrapper-
  // punkt for fremtidig tilgangsstyring, men ikke skjul innhold eller redirect.
  return <>{children}</>;
}

