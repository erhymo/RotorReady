"use client";
import { useEffect } from "react";
import posthog from "posthog-js";

export default function AnalyticsProvider() {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
    if (typeof window !== "undefined" && key && host) {
      posthog.init(key, { api_host: host, capture_pageview: true, person_profiles: "identified_only" });
      // Merk miljø på events
      const env = process.env.NEXT_PUBLIC_ENV || (process.env.NODE_ENV === "production" ? "production" : "development");
      posthog.register({ env });
    }
  }, []);
  return null;
}

