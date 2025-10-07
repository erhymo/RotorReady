
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import ProtectedRoutes from "@/components/ProtectedRoutes";
import ThemeInitializer from "@/components/ThemeInitializer";
import AnalyticsProvider from "@/components/AnalyticsProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RotorReady – Your rotorwing training app",
  description: "Your rotorwing training app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try {
                  var root = document.documentElement;
                  var source = localStorage.getItem('rr_theme_source');
                  var stored = localStorage.getItem('rr_theme');
                  var mql = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
                  var prefersDark = !!(mql && mql.matches);
                  var useStored = (source === 'manual') && (stored === 'dark' || stored === 'light');
                  var theme = useStored ? stored : (prefersDark ? 'dark' : 'light');
                  if (theme === 'dark') {
                    root.classList.add('dark');
                  } else {
                    root.classList.remove('dark');
                  }
                } catch (e) {}
              })()
            `,
          }}
        />
      </head>
      <body className={`${inter.className} bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-white`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[1000] focus:rounded-md focus:bg-yellow-200 focus:px-3 focus:py-2 focus:text-slate-900">Skip to content</a>
        <ThemeInitializer />
        <AnalyticsProvider />

        <div className="sticky top-0 z-30">
          <Header />
        </div>
        <main id="main-content">
          {/* Client-side route protection for selected paths */}
          {/* eslint-disable-next-line @next/next/no-head-element */}
          {/* Wrapped in a client component to avoid server-side auth dependencies */}
          {/* NOTE: ProtectedRoutes only guards specific prefixes (quiz/offline/training/...) */}
          <ProtectedRoutes>{children}</ProtectedRoutes>
        </main>

      </body>
    </html>
  );
}
