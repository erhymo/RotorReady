"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Client-side redirect from an old `/thing/<value>` URL to the query-param page
 * that replaced it (`/thing/play?id=<value>`). Content pages moved to query
 * params so one bundled static page can serve content that didn't exist yet at
 * native-build time — these thin redirects only exist so links shared or
 * bookmarked under the old shape keep working.
 */
function LegacyRouteRedirectInner({
  to,
  param,
  value,
}: {
  to: string;
  param: string;
  value: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Carry any other query params across. Some of these links are navigation
    // state, not decoration — the AW169 procedures pass the light and variant
    // the user came from so the lights trainer can resume where they left off.
    const next = new URLSearchParams(searchParams.toString());
    next.set(param, value);
    router.replace(`${to}?${next.toString()}`);
  }, [router, searchParams, to, param, value]);

  return null;
}

// useSearchParams needs a Suspense boundary during static generation, and these
// redirects are rendered from plain server pages, so the boundary lives here
// rather than being repeated at every call site.
export default function LegacyRouteRedirect(props: { to: string; param: string; value: string }) {
  return (
    <Suspense fallback={null}>
      <LegacyRouteRedirectInner {...props} />
    </Suspense>
  );
}
