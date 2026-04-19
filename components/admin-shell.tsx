"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { NotificationPanel } from "@/components/notification-panel";
import { useNotifications } from "@/lib/use-notifications";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/admin/leads", label: "Leads", icon: "Users" },
  { href: "/admin/listings", label: "Listings", icon: "Home" },
  { href: "/admin/analytics", label: "Analytics", icon: "BarChart3" },
  { href: "/admin/schedule", label: "Schedule", icon: "CalendarDays" },
];

const BOTTOM_NAV_ITEMS = [
  { href: "/admin/settings", label: "Settings", icon: "Settings" },
];

function Icon({ name, className = "" }: { name: string; className?: string }) {
  switch (name) {
    case "LayoutDashboard":
      return <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>;
    case "Users":
      return <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
    case "BarChart3":
      return <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><rect x="7" y="14" width="4" height="4" rx="1"/><rect x="15" y="7" width="4" height="11" rx="1"/></svg>;
    case "CalendarDays":
      return <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>;
    case "Settings":
      return <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;
    case "Home":
      return <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
    default:
      return null;
  }
}

const AVATAR_STORAGE_KEY = "realtyos-admin-avatar";
const USER_NAME_KEY = "realtyos-admin-name";
const USER_ROLE_KEY = "realtyos-admin-role";

export function AdminShell({
  title,
  description,
  children
}: {
  title?: string;
  description?: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const [userName, setUserName] = useState("Admin");
  const [userRole, setUserRole] = useState("Lead Specialist");

  const { notifications, unreadCount, markAllRead, clearAll, syncFromLeads } = useNotifications();

  // Load avatar & user info from localStorage
  useEffect(() => {
    const storedAvatar = localStorage.getItem(AVATAR_STORAGE_KEY);
    if (storedAvatar) setAvatarSrc(storedAvatar);
    const storedName = localStorage.getItem(USER_NAME_KEY);
    if (storedName) setUserName(storedName);
    const storedRole = localStorage.getItem(USER_ROLE_KEY);
    if (storedRole) setUserRole(storedRole);
  }, []);

  // Sync notifications from leads on mount
  useEffect(() => {
    void fetch("/api/leads", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.leads)) {
          syncFromLeads(data.leads);
        }
      })
      .catch(() => {});
  }, [syncFromLeads]);

  const handleAvatarClick = useCallback(() => {
    router.push("/admin/settings?tab=profile" as any);
  }, [router]);

  // Subtitle logic based on path
  let subtitle = "Lead Management";
  if (pathname === "/admin") subtitle = "Live Dashboard";
  if (pathname.includes("analytics")) subtitle = "Admin Dashboard";
  if (pathname.includes("schedule")) subtitle = "Property Management";
  if (pathname.includes("settings")) subtitle = "Real Estate CRM";

  const initials = userName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      localStorage.removeItem(AVATAR_STORAGE_KEY);
      localStorage.removeItem(USER_NAME_KEY);
      localStorage.removeItem(USER_ROLE_KEY);
      router.push("/admin/login");
      router.refresh();
      setLoggingOut(false);
    }
  }

  return (
    <div className="crm-layout">


      {/* ── Sidebar ── */}
      <aside className="crm-sidebar">
        <div className="crm-brand">
          <div className="crm-logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>
          </div>
          <div className="crm-brand-text">
            <strong>RealtyOS</strong>
            <span>{subtitle}</span>
          </div>
        </div>

        <nav className="crm-nav-main">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                className={`crm-nav-item ${active ? "active" : ""}`}
                href={item.href as any}
              >
                <Icon name={item.icon} className="crm-nav-icon" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="crm-sidebar-bottom">
          <nav className="crm-nav-settings">
            {BOTTOM_NAV_ITEMS.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  className={`crm-nav-item ${active ? "active" : ""}`}
                  href={item.href as any}
                >
                  <Icon name={item.icon} className="crm-nav-icon" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Pro Plan Upsell Module */}
          <div className="crm-pro-upsell">
            <span className="upsell-badge">PRO PLAN</span>
            <p>Upgrade for advanced AI matching</p>
            <button className="crm-btn-white">Upgrade Now</button>
          </div>

          <div className="crm-user-profile">
            <div className="crm-user-avatar" onClick={handleAvatarClick} title="Click to change avatar" style={{ cursor: "pointer" }}>
              {avatarSrc ? (
                <img src={avatarSrc} alt="Avatar" className="crm-avatar-img" />
              ) : (
                <div className="crm-avatar-placeholder">{initials}</div>
              )}
            </div>
            <div className="crm-user-info">
              <strong>{userName}</strong>
              <span>{userRole}</span>
            </div>
            <button
              className="crm-logout-btn"
              onClick={handleLogout}
              disabled={loggingOut}
              title="Sign out"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <main className="crm-main">
        <header className="crm-topbar">
          {title ? (
            <div className="crm-topbar-title">
              <h1>{title}</h1>
              {description && <p>{description}</p>}
            </div>
          ) : (
            <div className="crm-search-bar">
              <span className="crm-search-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </span>
              <input type="text" placeholder="Search leads, properties, or agents..." />
            </div>
          )}

          <div className="crm-topbar-actions">
            <div style={{ position: "relative" }}>
              <button className="crm-icon-btn" onClick={() => setShowNotifs(!showNotifs)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                {unreadCount > 0 && (
                  <span className="notification-dot">{unreadCount > 9 ? "9+" : unreadCount}</span>
                )}
              </button>
              {showNotifs && (
                <NotificationPanel
                  notifications={notifications}
                  onMarkAllRead={markAllRead}
                  onClearAll={clearAll}
                  onClose={() => setShowNotifs(false)}
                />
              )}
            </div>
            <div className="crm-topbar-user">
              <div className="crm-user-info right-align">
                <strong>{userName}</strong>
                <span>{userRole}</span>
              </div>
              <div className="crm-user-avatar" onClick={handleAvatarClick} title="Click to change avatar" style={{ cursor: "pointer" }}>
                {avatarSrc ? (
                  <img src={avatarSrc} alt="Avatar" className="crm-avatar-img" />
                ) : (
                  <div className="crm-avatar-placeholder">{initials}</div>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="crm-content-area">
          {children}
        </div>
      </main>
    </div>
  );
}
