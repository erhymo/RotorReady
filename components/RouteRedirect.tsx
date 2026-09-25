"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Client-side redirect for a retired page, so links and bookmarks to it keep
 * working. Client-side because the native app is a static export: there is no
 * server to answer with an HTTP redirect.
 */
export default function RouteRedirect({ to }: { to: string }) {
  const router = useRouter();
  useEffect(() => {
    router.replace(to);
  }, [router, to]);
  return null;
}
