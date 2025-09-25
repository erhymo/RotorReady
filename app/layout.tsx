
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
      <body>
        <header style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
          <h1>RotorReady</h1>
          <ClientUserMenu />
        </header>
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
