import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { PublicAssistantLayer } from "@/components/public-assistant-layer";
import { ToastProvider } from "@/components/toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap"
});

export const metadata: Metadata = {
  title: "RealtyOS — AI-Powered Real Estate CRM",
  description:
    "Zero-latency lead engagement system that qualifies, tags, and books appointments automatically.",
  icons: {
    icon: "/icon.svg",
    apple: "/logo.png",
  },
  openGraph: {
    title: "RealtyOS — Qualify leads. Close deals. All on autopilot.",
    description: "AI lead qualification, automated scheduling, and a full agent dashboard — built for modern brokerages.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RealtyOS — AI-Powered Real Estate CRM",
    description: "AI lead qualification, automated scheduling, and a full agent dashboard.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var stored = localStorage.getItem("realtyos-theme");
                  var theme = stored === "dark" ? "dark" : "light";
                  document.documentElement.dataset.theme = theme;
                } catch (error) {
                  document.documentElement.dataset.theme = "light";
                }
              })();
            `
          }}
        />
      </head>
      <body className={inter.variable} suppressHydrationWarning>
        <ToastProvider>
          {children}
          <PublicAssistantLayer />
        </ToastProvider>
      </body>
    </html>
  );
}

