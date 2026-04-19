"use client";

import { useAdminData } from "@/lib/use-admin-data";
import { getInitials, getSourceColor, getSourceLabel, getAvatarColor, timeAgo } from "@/lib/admin-helpers";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

function getRoleFromCookie(): { role: string; org: string; email: string } {
  if (typeof document === "undefined") return { role: "SOLO_AGENT", org: "", email: "" };
  const cookie = document.cookie.split(";").find(c => c.trim().startsWith("ros_admin_session="));
  if (!cookie) return { role: "SOLO_AGENT", org: "", email: "" };
  const parts = cookie.split("=")[1]?.split(":") || [];
  return { role: parts[1] || "SOLO_AGENT", org: parts[2] || "", email: parts[0] || "" };
}

export function AgentDashboard() {
  const { leads, metrics, stats, loading, refresh } = useAdminData();
  const [roleInfo, setRoleInfo] = useState({ role: "SOLO_AGENT", org: "", email: "" });

  useEffect(() => { setRoleInfo(getRoleFromCookie()); }, []);

  const isSolo = roleInfo.role === "SOLO_AGENT";
  const displayLeads = leads.slice(0, 5);
  const selectedLeadIdx = 0;
  const selectedLead = displayLeads[selectedLeadIdx];

  // Computed metrics
  const avgResponse = metrics.averageResponseTimeMs > 0
    ? (metrics.averageResponseTimeMs / 1000).toFixed(1) + "s"
    : "—";
  const totalLeads = stats.totalLeads || 0;
  const conversionPct = stats.conversionRate || 0;

  return (
    <div className="crm-dashboard-grid">
      {/* ── Role Context Banner ── */}
      <section style={{ background: isSolo ? "#FFF7ED" : "#EFF6FF", border: `1px solid ${isSolo ? "#FDBA74" : "#93C5FD"}`, borderRadius: "12px", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <div>
          <strong style={{ fontSize: "0.85rem", color: isSolo ? "#C2410C" : "#1D4ED8" }}>
            {isSolo ? "Solo Agent Dashboard" : `${roleInfo.org || "Organization"} Agent`}
          </strong>
          <p style={{ margin: "4px 0 0", fontSize: "0.8rem", color: "#64748B" }}>
            {isSolo
              ? "Share your inquiry link on social media to start receiving leads."
              : "Leads assigned to you by your organization admin appear here."
            }
          </p>
        </div>
        {isSolo && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px", flexShrink: 0 }}>
            <button onClick={() => { const link = window.location.origin + "/inquiry" + (roleInfo.email ? `?agent=${encodeURIComponent(roleInfo.email)}` : ""); navigator.clipboard.writeText(link); alert("Inquiry link copied!"); }} style={{ background: "#F25C05", color: "#fff", border: "none", borderRadius: "6px", padding: "8px 16px", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer", whiteSpace: "nowrap" }}>
              📋 Copy Inquiry Link
            </button>
            {roleInfo.email && <span style={{ fontSize: "0.7rem", color: "#94A3B8", fontFamily: "monospace" }}>/inquiry?agent={roleInfo.email}</span>}
          </div>
        )}
      </section>

      {/* ── Empty State ── */}
      {displayLeads.length === 0 && (
        <section style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "16px", padding: "48px 32px", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>📭</div>
          <h3 style={{ margin: "0 0 8px", fontSize: "1.2rem", fontWeight: 700, color: "#0F172A" }}>No leads yet</h3>
          <p style={{ margin: "0 0 24px", fontSize: "0.9rem", color: "#64748B", maxWidth: "400px", marginLeft: "auto", marginRight: "auto" }}>
            {isSolo
              ? "Share your unique inquiry link on Instagram, Facebook, or your website. Sloane will qualify incoming leads 24/7."
              : "Your organization admin will assign leads to you. Check back soon or contact your team lead."
            }
          </p>
          {isSolo && (
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button onClick={() => { const link = window.location.origin + "/inquiry" + (roleInfo.email ? `?agent=${encodeURIComponent(roleInfo.email)}` : ""); navigator.clipboard.writeText(link); alert("Copied!"); }} style={{ background: "#F25C05", color: "#fff", border: "none", borderRadius: "8px", padding: "12px 24px", fontWeight: 600, cursor: "pointer" }}>Copy Inquiry Link</button>
              <Link href={"/getting-started" as any} style={{ border: "1px solid #E2E8F0", borderRadius: "8px", padding: "12px 24px", fontWeight: 600, color: "#475569", textDecoration: "none" }}>View Setup Guide</Link>
            </div>
          )}
        </section>
      )}

      {displayLeads.length > 0 && (<>
      {/* ── Top Metrics Row ── */}
      <section className="crm-metrics-row">
        <div className="crm-metric-card">
          <div className="crm-metric-head">
            <span>Avg Response Time</span>
            <div className="crm-icon-box green">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            </div>
          </div>
          <div className="crm-metric-value">
            <strong>{avgResponse}</strong>
            <span className="trend-up">↑ 12%</span>
          </div>
          <p className="crm-metric-sub">Target response is &lt; 5s</p>
        </div>

        <div className="crm-metric-card">
          <div className="crm-metric-head">
            <span>Live Lead Velocity</span>
            <div className="crm-icon-box orange">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
            </div>
          </div>
          <div className="crm-metric-value">
            <strong>{totalLeads}</strong>
            <span className="metric-unit">leads</span>
          </div>
          <p className="crm-metric-sub">Total captured leads</p>
        </div>

        <div className="crm-metric-card">
          <div className="crm-metric-head">
            <span>Conversion Prob.</span>
            <div className="crm-icon-box blue">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
            </div>
          </div>
          <div className="crm-metric-value">
            <strong>{conversionPct}%</strong>
            <span className="metric-status-blue">{conversionPct >= 50 ? "High" : "Medium"}</span>
          </div>
          <p className="crm-metric-sub">Based on current ingestion quality</p>
        </div>
      </section>

      {/* ── Main Two Columns ── */}
      <section className="crm-dashboard-columns">
        {/* Left Column: Live Ingest Feed */}
        <div className="crm-feed-column">
          <div className="crm-section-header">
            <div className="live-indicator">
              <span className="pulse-dot"></span>
              <h2>Live Ingest Feed</h2>
            </div>
            <Link href={"/agent/leads" as any} className="crm-text-button">
              View All Leads
            </Link>
          </div>

          <div className="crm-feed-list">
            {displayLeads.map((lead, idx) => {
              const sourceColor = getSourceColor(lead.source);
              const sourceLabel = getSourceLabel(lead.source).toUpperCase();
              const initials = getInitials(lead.name);
              const avatarColor = getAvatarColor(idx);

              return (
                <div
                  key={lead.id}
                  className={`crm-feed-card ${idx === selectedLeadIdx ? "active" : ""}`}
                >
                  <div className="crm-feed-card-main">
                    <div className="crm-feed-avatar">
                      <div className={`avatar-initials bg-${avatarColor}`}>
                        {initials}
                      </div>
                    </div>
                    <div className="crm-feed-info">
                      <div className="crm-feed-title-row">
                        <div className="crm-feed-name-badge">
                          <strong>{lead.name || lead.email || "Unknown"}</strong>
                          <span className={`crm-badge crm-badge-${sourceColor}`}>{sourceLabel}</span>
                        </div>
                        <span className="crm-time-ago">
                          {timeAgo(lead.updatedAt)}
                        </span>
                      </div>
                      <p className="crm-feed-interest">
                        Interest: {lead.qualification.location || lead.qualification.propertyType || "General inquiry"}
                      </p>
                      <div className="crm-feed-details-row">
                        {lead.qualification.budget && (
                          <span className="crm-detail-pill">$ {lead.qualification.budget}</span>
                        )}
                        {lead.qualification.timeline && (
                          <span className="crm-detail-pill">{lead.qualification.timeline}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => alert("Initiating call to " + (lead.name || lead.email))} className="crm-feed-action-btn phone">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Lead Insights */}
        <div className="crm-insights-column">
          <div className="crm-section-header">
            <h2>Lead Insights</h2>
          </div>

          <div className="crm-insights-card">
            <div className="crm-insight-header">
              <div className="crm-insight-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              </div>
              <div>
                <span className="crm-insight-kicker">SELECTED LEAD</span>
                <h3>{selectedLead.name || selectedLead.email || "Unknown"}</h3>
              </div>
            </div>

            <hr className="crm-divider" />

            <div className="crm-insight-score-block">
              <div className="crm-insight-score-head">
                <span>QUALIFICATION SCORE</span>
                <strong>{selectedLead.qualification.confidence}/100</strong>
              </div>
              <div className="crm-score-bar-bg">
                <div className="crm-score-bar-fill" style={{ width: `${selectedLead.qualification.confidence}%` }}></div>
              </div>
            </div>

            <div className="crm-insight-quick-cards">
              <div className="crm-quick-card">
                <span>BUDGET</span>
                <strong>{selectedLead.qualification.budget || "Not specified"}</strong>
              </div>
              <div className="crm-quick-card">
                <span>TIMELINE</span>
                <strong>{selectedLead.qualification.timeline || "Not specified"}</strong>
              </div>
            </div>

            <div className="crm-insight-tags-block">
              <span>AUTOMATED TAGS</span>
              <div className="crm-tags-row">
                {(selectedLead.tags?.length > 0 ? selectedLead.tags : ["#NewLead"]).map((tag: string) => (
                  <span key={tag} className="crm-tag-pill">{tag}</span>
                ))}
              </div>
            </div>

            <div className="crm-insight-actions">
              <Link href={"/agent/leads" as any} className="crm-btn-primary-large">
                View Full Profile
              </Link>
              <Link href={"/agent/schedule" as any} className="crm-btn-outline-large">
                Schedule Appointment
              </Link>
            </div>
          </div>

          <div className="crm-market-pulse-card">
            <div className="crm-pulse-head">
              <h4>Local Market Pulse</h4>
              <span>{selectedLead.qualification.location || "General"} (Active)</span>
            </div>
            <div className="crm-pulse-chart">
              {[30, 50, 20, 70, 90, 60, 40, 80].map((v, i) => (
                <div key={i} className="pulse-bar" style={{ height: `${v}%`, background: i === 4 ? "var(--primary)" : undefined }}></div>
              ))}
            </div>
          </div>
        </div>
      </section>
      </>)}
    </div>
  );
}
