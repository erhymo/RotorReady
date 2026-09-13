"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Client-side redirect from an old `/thing/<value>` URL to the query-param page
 * that replaced it (`/thing/play?id=<value>`). Content pages moved to query
 * params so one bundled static page can serve content that didn't exist yet at
 * native-build time — these thin redirects only exist so links shared or
 * bookmarked under the old shape keep working.
 */
export default function LegacyRouteRedirect({
  to,
  param,
  value,
}: {
  to: string;
  param: string;
  value: string;
}) {
  const router = useRouter();

  useEffect(() => {
    router.replace(`${to}?${param}=${encodeURIComponent(value)}`);
  }, [router, to, param, value]);

  return null;
}
