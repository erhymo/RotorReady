
import "./globals.css";
import Header from "@/components/Header";
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
      <body className="min-h-screen bg-slate-50 dark:bg-zinc-900">
        <div className="sticky top-0 z-30">
          <Header />
        </div>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
