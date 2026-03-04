import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import FaviconRotator from "@/components/FaviconRotator";
import SmoothScroll from "@/components/ui/SmoothScroll";
import GlobalFooter from "@/components/ui/GlobalFooter";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-tech",
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Drew Quevedo | Personal Brand Engine",
  description: "High-performance autonomous brand ecosystems.",
  icons: {
    icon: "/favicons/ai-chip.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable} font-body antialiased bg-black text-white selection:bg-[#7a43e6] selection:text-white`}
      >
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-YS92QWWW4Z`}
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-YS92QWWW4Z');
            `,
          }}
        />
        <div className="fixed inset-0 -z-10 matrix-gradient pointer-events-none" />
        <SmoothScroll>
          <main className="relative min-h-screen">
            {children}
          </main>
          <GlobalFooter />
        </SmoothScroll>
        <FaviconRotator />
      </body>
    </html>
  );
}
