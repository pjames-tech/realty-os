"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/schedule", label: "Schedule" },
  { href: "/admin/settings", label: "Settings" }
];

export function AdminShell({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST"
      });
    } finally {
      router.push("/admin/login");
      router.refresh();
      setLoggingOut(false);
    }
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark">R</div>
          <div>
            <strong>RealtyOS</strong>
            <span>Enterprise Admin</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                className={`sidebar-link ${active ? "sidebar-link-active" : ""}`}
                href={item.href as Route}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div>
            <strong>Admin access</strong>
            <span>Protected operations panel</span>
          </div>
          <button
            className="logout-button"
            disabled={loggingOut}
            onClick={handleLogout}
            type="button"
          >
            {loggingOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <div>
            <span className="admin-status">System online</span>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>

          <div className="admin-header-actions">
            <Link className="header-link" href="/admin/settings">
              Theme settings
            </Link>
            <Link className="header-button" href="/admin#manual-entry">
              Manual Entry
            </Link>
          </div>
        </header>

        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
