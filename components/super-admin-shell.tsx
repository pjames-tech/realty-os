"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import type { Route } from "next";
import { createClient } from "@/lib/supabase/client";

export function SuperAdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    await fetch("/api/super-admin/logout", { method: "POST" });
    router.push("/super-admin/login" as Route);
    router.refresh();
  }

  const primaryNav = [
    { label: "Overview", href: "/super-admin", icon: <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
    { label: "Agencies", href: "/super-admin/agencies", icon: <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
    { label: "Platform Stats", href: "/super-admin/platform-stats", icon: <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
    { label: "Settings", href: "/super-admin/settings", icon: <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F8FAFC", fontFamily: "var(--font-sans)" }}>
      {/* Sidebar */}
      <aside style={{ width: "260px", background: "#FFFFFF", borderRight: "1px solid #E2E8F0", display: "flex", flexDirection: "column" }}>
        {/* Brand */}
        <div style={{ padding: "24px 20px", display: "flex", alignItems: "center", gap: "12px", borderBottom: "1px solid #E2E8F0" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#F25C05", display: "grid", placeItems: "center" }}>
            <svg width="22" height="22" fill="#fff" viewBox="0 0 24 24"><path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm2 2h8v2H8V8zm0 4h5v2H8v-2z"/></svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "1.1rem", fontWeight: "700", color: "#1E293B", lineHeight: "1.1" }}>RealtyOS</span>
            <span style={{ fontSize: "0.65rem", fontWeight: "700", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>Super Admin</span>
          </div>
        </div>

        {/* Primary Nav */}
        <nav style={{ flex: 1, padding: "32px 0 20px" }}>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
            {primaryNav.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/super-admin" && pathname.startsWith(link.href));
              return (
                <li key={link.href}>
                  <Link 
                    href={link.href as Route}
                    style={{
                      display: "flex", alignItems: "center", gap: "16px", padding: "12px 24px",
                      background: isActive ? "#FFF6F0" : "transparent",
                      color: isActive ? "#F25C05" : "#64748B",
                      fontWeight: isActive ? "600" : "500",
                      textDecoration: "none",
                      borderRight: isActive ? "3px solid #F25C05" : "3px solid transparent",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <span style={{ color: isActive ? "#F25C05" : "#94A3B8" }}>{link.icon}</span>
                    <span style={{ fontSize: "0.95rem" }}>{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer Nav */}
        <div style={{ padding: "24px 0", borderTop: "1px solid #E2E8F0" }}>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
            <li>
              <Link href={"/docs" as Route} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "12px 24px", color: "#64748B", fontWeight: "500", textDecoration: "none" }}>
                <span style={{ color: "#94A3B8" }}><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></span>
                <span style={{ fontSize: "0.95rem" }}>Documentation</span>
              </Link>
            </li>
            <li>
              <button 
                onClick={handleLogout}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: "16px", padding: "12px 24px", color: "#EF4444", fontWeight: "500", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
              >
                <span style={{ color: "#EF4444" }}><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg></span>
                <span style={{ fontSize: "0.95rem" }}>Log Out</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
        
        {/* Topbar */}
        <header style={{ height: "73px", background: "#FFFFFF", borderBottom: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px" }}>
          {/* Search */}
          <div style={{ display: "flex", alignItems: "center", background: "#F1F5F9", borderRadius: "100px", padding: "8px 16px", width: "400px" }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#64748B"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              placeholder="Search agencies, users, or logs..." 
              style={{ background: "transparent", border: "none", outline: "none", padding: "4px 8px", width: "100%", fontSize: "0.9rem", color: "#1E293B" }}
            />
          </div>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", color: "#64748B" }}>
              <button style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}>
                <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/></svg>
              </button>
              <button style={{ background: "#475569", color: "#fff", border: "none", width: "24px", height: "24px", borderRadius: "50%", display: "grid", placeItems: "center", fontWeight: "bold", fontSize: "0.8rem", cursor: "pointer" }}>
                ?
              </button>
            </div>
            
            <div style={{ width: "1px", height: "32px", background: "#E2E8F0" }}></div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
               <div style={{ display: "flex", flexDirection: "column", textAlign: "right" }}>
                 <strong style={{ fontSize: "0.9rem", color: "#1E293B" }}>Super Admin</strong>
                 <span style={{ fontSize: "0.75rem", color: "#64748B" }}>System Controller</span>
               </div>
               <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#CBD5E1", overflow: "hidden" }}>
                 <Image src="/agent-avatar.png" alt="Super Admin Profile" width={40} height={40} style={{ objectFit: "cover" }} />
               </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, overflowY: "auto", padding: "40px 40px 80px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
