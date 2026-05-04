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
  title: "RealtyOS Auto-Qualifier",
  description:
    "Zero-latency lead engagement system that qualifies, tags, and books appointments automatically."
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

