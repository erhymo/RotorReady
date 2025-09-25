
import "./globals.css";
import ClientUserMenu from "@/components/ClientUserMenu";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RotorReady",
  description: "Training app for AW169 crew",
};

const initTheme = `
(function(){try{
  var t = localStorage.getItem('rr_theme');
  if(t==='dark'){document.documentElement.classList.add('dark');}
}catch(e){}})()
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{__html: initTheme}} /></head>
      <body className="bg-slate-50 dark:bg-zinc-900 min-h-screen">
        {/* Full site header/navigation */}
        <div className="sticky top-0 z-30">
          {/* Use the original Header component for navigation and branding */}
          {require("@/components/Header").Header()}
        </div>
        {/* Main content container for consistent layout */}
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
