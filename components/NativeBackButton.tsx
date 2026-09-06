"use client";

import { useEffect } from "react";

// Capacitor's Android WebView never wires the hardware/gesture back button to
// the page's own navigation history on its own — that's explicitly the app's
// responsibility via @capacitor/app's backButton event (confirmed: neither
// Capacitor core nor MainActivity.java had any such handling here at all).
// Without this, pressing back exits the whole app immediately from any
// screen, every time — found while verifying Android for this release, not
// something introduced today, but a real, app-wide bug worth fixing now
// rather than shipping around. No-op on iOS (the event simply never fires
// there — it has its own gesture-based navigation instead).
export default function NativeBackButton() {
  useEffect(() => {
    let handle: { remove: () => void } | undefined;
    let cancelled = false;

    (async () => {
      const { Capacitor } = await import("@capacitor/core");
      if (!Capacitor.isNativePlatform()) return;

      const { App } = await import("@capacitor/app");
      const h = await App.addListener("backButton", ({ canGoBack }) => {
        if (canGoBack) {
          window.history.back();
        } else {
          App.exitApp();
        }
      });
      if (cancelled) {
        h.remove();
      } else {
        handle = h;
      }
    })();

    return () => {
      cancelled = true;
      handle?.remove();
    };
  }, []);

  return null;
}
