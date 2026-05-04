import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";
import { Logo } from "@/components/logo";

type MarketingLink = {
  href: Route;
  label: string;
};

const FOOTER_LINKS: Record<string, MarketingLink[]> = {
  Product: [
    { href: "/", label: "Home" },
    { href: "/demo", label: "Demo" },
    { href: "/automations", label: "Automations" },
    { href: "/docs", label: "Documentation" },
  ],
  Resources: [
    { href: "/getting-started", label: "Getting Started" },
    { href: "/tutorials", label: "Tutorials" },
    { href: "/help", label: "Help Center" },
    { href: "/community", label: "Community" },
  ],
  Company: [
    { href: "/about", label: "About" },
    { href: "/careers", label: "Careers" },
    { href: "/contact", label: "Contact" },
  ],
  Legal: [
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
  ],
};

export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "var(--font-sans)", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={{
        background: "#FFFFFF",
        borderBottom: "1px solid #E2E8F0",
        padding: "16px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <Logo size={32} />
          <span style={{ fontSize: "1.1rem", fontWeight: "700", color: "#1E293B" }}>RealtyOS</span>
        </Link>
        <nav style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <Link href="/docs" style={{ color: "#475569", textDecoration: "none", fontSize: "0.9rem", fontWeight: "500" }}>Docs</Link>
          <Link href="/help" style={{ color: "#475569", textDecoration: "none", fontSize: "0.9rem", fontWeight: "500" }}>Help</Link>
          <Link href="/contact" style={{ color: "#475569", textDecoration: "none", fontSize: "0.9rem", fontWeight: "500" }}>Contact</Link>
          <Link href="/admin/login" style={{ color: "#475569", textDecoration: "none", fontSize: "0.9rem", fontWeight: "500" }}>Sign In</Link>
          <Link href="/inquiry" style={{
            padding: "8px 16px",
            background: "#ff7300",
            color: "#FFF",
            textDecoration: "none",
            borderRadius: "8px",
            fontSize: "0.9rem",
            fontWeight: "600",
          }}>
            Get Started
          </Link>
        </nav>
      </header>

      {/* Content */}
      <main style={{ flexGrow: 1 }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{
        background: "#FFFFFF",
        borderTop: "1px solid #E2E8F0",
        padding: "48px 32px 24px",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: "48px", marginBottom: "32px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <Logo size={32} />
                <span style={{ fontSize: "1.1rem", fontWeight: "700", color: "#1E293B" }}>RealtyOS</span>
              </div>
              <p style={{ color: "#64748B", fontSize: "0.9rem", lineHeight: 1.5, margin: 0, maxWidth: "280px" }}>
                The AI-native operating system for modern real estate teams.
              </p>
            </div>
            {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
              <div key={heading}>
                <h4 style={{ margin: "0 0 12px 0", fontSize: "0.85rem", fontWeight: "700", color: "#1E293B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {heading}
                </h4>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} style={{ color: "#64748B", textDecoration: "none", fontSize: "0.9rem" }}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ paddingTop: "24px", borderTop: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ margin: 0, color: "#94A3B8", fontSize: "0.85rem" }}>© {new Date().getFullYear()} RealtyOS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Shared primitives for marketing content ────────────

export function MarketingHero({ kicker, title, subtitle }: { kicker?: string; title: string; subtitle?: string }) {
  return (
    <section style={{ padding: "80px 32px 48px", textAlign: "center" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {kicker && (
          <div style={{ color: "#ff7300", fontSize: "0.8rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>
            {kicker}
          </div>
        )}
        <h1 style={{ fontSize: "2.75rem", fontWeight: "800", color: "#0F172A", margin: "0 0 16px 0", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: "1.15rem", color: "#475569", lineHeight: 1.6, margin: 0 }}>
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}

export function MarketingSection({ children, background }: { children: ReactNode; background?: string }) {
  return (
    <section style={{ padding: "48px 32px", background: background ?? "transparent" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {children}
      </div>
    </section>
  );
}

export function FeatureCard({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "28px" }}>
      <div
        style={{
          width: "44px",
          height: "44px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FFF7ED",
          color: "#ff7300",
          borderRadius: "10px",
          marginBottom: "16px",
        }}
      >
        {icon}
      </div>
      <h3 style={{ margin: "0 0 8px 0", fontSize: "1.1rem", fontWeight: "700", color: "#0F172A" }}>{title}</h3>
      <p style={{ margin: 0, color: "#64748B", fontSize: "0.95rem", lineHeight: 1.6 }}>{description}</p>
    </div>
  );
}
