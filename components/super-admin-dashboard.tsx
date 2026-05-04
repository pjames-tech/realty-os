"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Icon } from "./icons";

type Stats = {
  totalAgencies: number;
  totalAgents: number;
  totalLeads: number;
  bookedLeads: number;
  qualifiedLeads: number;
  activeListings: number;
  newLeadsLast30: number;
  conversionRate: number;
  qualificationRate: number;
  avgResponseTimeMs: number;
  under3sRate: number;
  processedMessages: number;
};

type Activity = {
  leads: Array<{ id: string; name?: string | null; email?: string | null; status: string; createdAt: string }>;
  listings: Array<{ id: string; title: string; price: number; city: string; createdAt: string }>;
  bookings: Array<{ id: string; slot: string; bookedAt: string; lead: { name?: string | null; email?: string | null } }>;
};

function formatMs(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / (1000 * 60));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function SuperAdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/super-admin/stats", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        setStats(data.stats);
        setActivity(data.recentActivity);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <div style={{ padding: "80px", textAlign: "center", color: "#64748B", fontFamily: "var(--font-sans)" }}>
        Loading platform metrics...
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", fontFamily: "var(--font-sans)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ color: "#ff7300", fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>Platform Intelligence</div>
          <h1 style={{ fontSize: "2rem", fontWeight: "800", color: "#0F172A", margin: "0 0 8px 0", letterSpacing: "-0.02em" }}>Overview Dashboard</h1>
          <p style={{ color: "#64748B", margin: 0, fontSize: "0.95rem" }}>Real-time health and performance metrics for RealtyOS.</p>
        </div>
      </div>

      {/* Top 4 Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
        <StatCard
          label="Active Agencies"
          value={stats.totalAgencies.toString()}
          caption={`${stats.totalAgents} agents total`}
          icon={<Icon.Building size={60} />}
        />
        <StatCard
          label="Total Leads"
          value={stats.totalLeads.toString()}
          caption={`+${stats.newLeadsLast30} in last 30 days`}
          icon={<Icon.Users size={60} />}
          accent={stats.newLeadsLast30 > 0}
        />
        <StatCard
          label="Active Listings"
          value={stats.activeListings.toString()}
          caption="Published properties"
          icon={<Icon.Home size={60} />}
        />
        <StatCard
          label="Conversion Rate"
          value={`${stats.conversionRate.toFixed(1)}%`}
          caption={`${stats.bookedLeads} booked tours`}
          icon={<Icon.Target size={60} />}
          accent={stats.conversionRate > 0}
        />
      </div>

      {/* Performance row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
        <StatCard
          label="AI Response Time"
          value={stats.avgResponseTimeMs > 0 ? formatMs(stats.avgResponseTimeMs) : "—"}
          caption={`${stats.processedMessages} messages processed`}
          icon={<Icon.Bolt size={60} />}
        />
        <StatCard
          label="Under 3s Response"
          value={stats.processedMessages > 0 ? `${stats.under3sRate.toFixed(0)}%` : "—"}
          caption="Target: >95%"
          icon={<Icon.Target size={60} />}
        />
        <StatCard
          label="Qualification Rate"
          value={`${stats.qualificationRate.toFixed(1)}%`}
          caption={`${stats.qualifiedLeads} qualified leads`}
          icon={<Icon.Sparkle size={60} />}
        />
      </div>

      {/* Recent Activity */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
        <ActivityCard title="Latest Leads" icon={<Icon.User size={16} />}>
          {activity?.leads.length ? (
            activity.leads.map((l) => (
              <ActivityRow
                key={l.id}
                primary={l.name || l.email || "Anonymous"}
                secondary={`Status: ${l.status.replace("_", " ")}`}
                meta={formatTimeAgo(l.createdAt)}
              />
            ))
          ) : (
            <EmptyActivity message="No leads yet" />
          )}
        </ActivityCard>

        <ActivityCard title="New Listings" icon={<Icon.Home size={16} />}>
          {activity?.listings.length ? (
            activity.listings.map((p) => (
              <ActivityRow
                key={p.id}
                primary={p.title}
                secondary={`${p.city} · $${(p.price / 1000).toFixed(0)}k`}
                meta={formatTimeAgo(p.createdAt)}
              />
            ))
          ) : (
            <EmptyActivity message="No listings yet" />
          )}
        </ActivityCard>

        <ActivityCard title="Recent Bookings" icon={<Icon.Calendar size={16} />}>
          {activity?.bookings.length ? (
            activity.bookings.map((b) => (
              <ActivityRow
                key={b.id}
                primary={b.lead.name || b.lead.email || "Unknown lead"}
                secondary={`Slot: ${b.slot}`}
                meta={formatTimeAgo(b.bookedAt)}
              />
            ))
          ) : (
            <EmptyActivity message="No bookings yet" />
          )}
        </ActivityCard>
      </div>
    </div>
  );
}

function StatCard({ label, value, caption, icon, accent }: { label: string; value: string; caption: string; icon: ReactNode; accent?: boolean }) {
  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "24px", position: "relative", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
      <h3 style={{ fontSize: "0.8rem", color: "#64748B", textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.05em", margin: "0 0 16px 0" }}>{label}</h3>
      <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "12px" }}>
        <span style={{ fontSize: "2rem", fontWeight: "800", color: "#0F172A", lineHeight: "1" }}>{value}</span>
        {accent && (
          <span style={{ background: "#DCFCE7", color: "#16A34A", padding: "2px 8px", borderRadius: "100px", fontSize: "0.7rem", fontWeight: "700" }}>
            Active
          </span>
        )}
      </div>
      <p style={{ margin: 0, fontSize: "0.8rem", color: "#94A3B8" }}>{caption}</p>
      <div style={{ position: "absolute", bottom: "-12px", right: "-4px", color: "#ff7300", opacity: 0.1, pointerEvents: "none", zIndex: 0, display: "inline-flex" }} aria-hidden="true">
        {icon}
      </div>
    </div>
  );
}

function ActivityCard({ title, icon, children }: { title: string; icon: ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <span style={{ width: "28px", height: "28px", display: "inline-flex", alignItems: "center", justifyContent: "center", background: "#FFF7ED", color: "#ff7300", borderRadius: "6px" }} aria-hidden="true">
          {icon}
        </span>
        <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: "700", color: "#0F172A" }}>{title}</h3>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {children}
      </div>
    </div>
  );
}

function ActivityRow({ primary, secondary, meta }: { primary: string; secondary: string; meta: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: "12px", borderBottom: "1px solid #F1F5F9", gap: "12px" }}>
      <div style={{ flexGrow: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontWeight: "600", color: "#1E293B", fontSize: "0.9rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{primary}</p>
        <p style={{ margin: "2px 0 0 0", fontSize: "0.8rem", color: "#64748B" }}>{secondary}</p>
      </div>
      <span style={{ fontSize: "0.75rem", color: "#94A3B8", whiteSpace: "nowrap" }}>{meta}</span>
    </div>
  );
}

function EmptyActivity({ message }: { message: string }) {
  return (
    <p style={{ margin: 0, fontSize: "0.85rem", color: "#94A3B8", textAlign: "center", padding: "16px 0" }}>
      {message}
    </p>
  );
}
