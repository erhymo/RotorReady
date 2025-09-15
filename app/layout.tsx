
import "./globals.css";
import { Header } from "@/components/Header";
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
  <body className="min-h-screen bg-gray-50 text-gray-900 dark:bg-zinc-900 dark:text-zinc-100 transition-colors">
        <Header />
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
