"use client";

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AvatarPicker } from "@/components/avatar-picker";
import type { Route } from "next";

export function PortalShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [clientName, setClientName] = useState("Client");

  useEffect(() => {
    fetch("/api/client/me", { cache: "no-store" })
      .then(r => r.json())
      .then(data => {
        if (data.lead?.name) setClientName(data.lead.name.split(" ")[0]);
      })
      .catch(() => {});
  }, []);

  function handleLogout() {
    sessionStorage.removeItem("realtyos-client-avatar");
    fetch("/api/client/logout", { method: "POST" }).then(() => {
      router.push("/portal/login" as Route);
      router.refresh();
    });
  }

  const navLinks = [
    { label: "Overview", href: "/portal", icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
    { label: "Explore", href: "/portal/explore", icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> },
    { label: "Saved", href: "/portal/saved", icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> },
    { label: "Tours", href: "/portal/tours", icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
    { label: "Messages", href: "/portal/messages", icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg> },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "var(--font-sans)" }}>

      {/* Sidebar */}
      <aside style={{ width: "260px", background: "#FFFFFF", borderRight: "1px solid #E2E8F0", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        {/* Brand */}
        <div style={{ padding: "24px 20px", display: "flex", alignItems: "center", gap: "12px", borderBottom: "1px solid #E2E8F0" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "var(--brand-blue, #2563EB)", display: "grid", placeItems: "center" }}>
            <svg width="22" height="22" fill="#fff" viewBox="0 0 24 24"><path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm2 2h8v2H8V8zm0 4h5v2H8v-2z"/></svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "1.1rem", fontWeight: "700", color: "#1E293B", lineHeight: "1.1" }}>RealtyOS</span>
            <span style={{ fontSize: "0.65rem", fontWeight: "700", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Client Portal</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "24px 0" }}>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "4px" }}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/portal" && pathname.startsWith(link.href));
              return (
                <li key={link.href}>
                  <Link
                    href={link.href as Route}
                    style={{
                      display: "flex", alignItems: "center", gap: "14px", padding: "12px 24px",
                      background: isActive ? "#EFF6FF" : "transparent",
                      color: isActive ? "var(--brand-blue, #2563EB)" : "#64748B",
                      fontWeight: isActive ? "600" : "500",
                      textDecoration: "none",
                      borderRight: isActive ? "3px solid var(--brand-blue, #2563EB)" : "3px solid transparent",
                      transition: "all 0.15s ease",
                      fontSize: "0.95rem"
                    }}
                  >
                    <span style={{ color: isActive ? "var(--brand-blue, #2563EB)" : "#94A3B8" }}>{link.icon}</span>
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Section */}
        <div style={{ padding: "20px", borderTop: "1px solid #E2E8F0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <AvatarPicker />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <strong style={{ fontSize: "0.9rem", color: "#1E293B" }}>{clientName}</strong>
              <span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>Home Buyer</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "10px", background: "transparent", border: "1px solid #E2E8F0", borderRadius: "8px", color: "#EF4444", fontWeight: "600", fontSize: "0.85rem", cursor: "pointer" }}
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", background: "#F8FAFC" }}>

        {/* Page Content */}
        <main style={{ flex: 1, overflowY: "auto", padding: "48px 48px 80px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
