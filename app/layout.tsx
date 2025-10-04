
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import ProtectedRoutes from "@/components/ProtectedRoutes";
import ThemeInitializer from "@/components/ThemeInitializer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RotorReady - AW169 Training Platform",
  description: "Comprehensive training platform for AW169 helicopter operations",
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
                  var stored = localStorage.getItem('rr_theme');
                  var prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (stored === 'dark') {
                    root.classList.add('dark');
                  } else if (stored === 'light') {
                    root.classList.remove('dark');
                  } else if (prefersDark) {
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
        <ThemeInitializer />

        <div className="sticky top-0 z-30">
          <Header />
        </div>
        <main>
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
