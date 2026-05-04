"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import type { Route } from "next";
import {
  PropertyCard,
  TourRecord,
  SavedRecord,
  formatPrice,
  formatTourDate,
  formatTourType,
  formatRelativeTime,
} from "@/lib/property-types";
import { Icon } from "./icons";

type Lead = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  status: string;
  qualification: {
    budget?: string;
    timeline?: string;
    location?: string;
    propertyType?: string;
    confidence: number;
  };
  appointment?: { calendarLink: string; slot: string };
  agentName?: string;
};

const FALLBACK_IMG = "/property-1.png";

function propertyImg(p: PropertyCard): string {
  return p.images[0] || FALLBACK_IMG;
}

export function ClientDashboard() {
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<PropertyCard[]>([]);
  const [saved, setSaved] = useState<SavedRecord[]>([]);
  const [tours, setTours] = useState<TourRecord[]>([]);

  const reloadSaved = useCallback(async () => {
    const res = await fetch("/api/client/saved", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      setSaved(data.saved ?? []);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const [meRes, propsRes, savedRes, toursRes] = await Promise.all([
        fetch("/api/client/me", { cache: "no-store" }).then((r) => r.json()).catch(() => null),
        fetch("/api/properties?take=6", { cache: "no-store" }).then((r) => r.json()).catch(() => null),
        fetch("/api/client/saved", { cache: "no-store" }).then((r) => r.json()).catch(() => null),
        fetch("/api/client/tours", { cache: "no-store" }).then((r) => r.json()).catch(() => null),
      ]);

      if (cancelled) return;
      setLead(meRes?.lead ?? null);
      setRecommendations(propsRes?.properties ?? []);
      setSaved(savedRes?.saved ?? []);
      setTours((toursRes?.tours ?? []).filter((t: TourRecord) => t.status === "scheduled"));
      setLoading(false);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const savedIds = new Set(saved.map((s) => s.property.id));

  async function toggleSave(propertyId: string) {
    const isSaved = savedIds.has(propertyId);
    if (isSaved) {
      await fetch(`/api/client/saved/${propertyId}`, { method: "DELETE" });
    } else {
      await fetch("/api/client/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId }),
      });
    }
    await reloadSaved();
  }

  const firstName = lead?.name?.split(" ")[0] || "there";

  if (loading) {
    return (
      <main className="cd-shell">
        <div className="cd-loading">Loading your dashboard...</div>
      </main>
    );
  }

  return (
    <main className="cd-shell">
      <section className="cd-welcome" style={{ marginBottom: "48px" }}>
        <div>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "8px" }}>
            Hey, <span className="cd-name-highlight">{firstName}</span>
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#64748B" }}>
            Here&apos;s what&apos;s happening with your property search today.
          </p>
        </div>
      </section>

      <section className="cd-stats-row" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", marginBottom: "56px" }}>
        <Link href={"/portal/saved" as Route} className="cd-stat-card" style={{ padding: "32px 24px", textDecoration: "none", color: "inherit" }}>
          <span className="cd-stat-icon cd-stat-icon-heart"><Icon.HeartFilled size={20} /></span>
          <div>
            <small>Saved Homes</small>
            <strong style={{ fontSize: "1.2rem" }}>{saved.length} {saved.length === 1 ? "Property" : "Properties"}</strong>
          </div>
        </Link>
        <Link href={"/portal/tours" as Route} className="cd-stat-card" style={{ padding: "32px 24px", textDecoration: "none", color: "inherit" }}>
          <span className="cd-stat-icon cd-stat-icon-cal"><Icon.Calendar size={20} /></span>
          <div>
            <small>Upcoming Tours</small>
            <strong style={{ fontSize: "1.2rem" }}>{tours.length} Scheduled</strong>
          </div>
        </Link>
        <Link href={"/portal/explore" as Route} className="cd-stat-card" style={{ padding: "32px 24px", textDecoration: "none", color: "inherit" }}>
          <span className="cd-stat-icon cd-stat-icon-ai"><Icon.Sparkle size={20} /></span>
          <div>
            <small>New Listings</small>
            <strong style={{ fontSize: "1.2rem" }}>{recommendations.length} Available</strong>
          </div>
        </Link>
      </section>

      {/* ── Recommendations ── */}
      <section className="cd-section" style={{ marginBottom: "56px" }}>
        <div className="cd-section-head" style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "1.5rem", display: "inline-flex", alignItems: "center", gap: "10px" }}>
            <span style={{ color: "#ff7300", display: "inline-flex" }} aria-hidden="true">
              <Icon.Sparkle size={20} />
            </span>
            Recommended for You
          </h2>
          <Link className="cd-view-all" href={"/portal/explore" as Route}>
            View all listings
          </Link>
        </div>
        {recommendations.length === 0 ? (
          <EmptyState message="No listings available yet. Check back soon." />
        ) : (
          <div className="cd-rec-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px" }}>
            {recommendations.slice(0, 3).map((p) => (
              <article key={p.id} className="cd-rec-card" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <div className="cd-rec-img-wrap" style={{ height: "240px" }}>
                  <Image src={propertyImg(p)} alt={p.title} fill className="cd-rec-img" />
                  <button
                    className={`lp-listing-fav ${savedIds.has(p.id) ? "liked" : ""}`}
                    aria-label={savedIds.has(p.id) ? "Unsave" : "Save"}
                    onClick={() => toggleSave(p.id)}
                  >
                    {savedIds.has(p.id) ? <Icon.HeartFilled size={16} /> : <Icon.Heart size={16} />}
                  </button>
                </div>
                <div className="cd-rec-info" style={{ padding: "24px", flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div className="cd-rec-price-row" style={{ marginBottom: "8px" }}>
                      <strong style={{ fontSize: "1.4rem" }}>{formatPrice(p.price)}</strong>
                      <span style={{ fontSize: "0.95rem", display: "inline-flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <Icon.Bed size={14} /> {p.beds}
                        </span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <Icon.Bath size={14} /> {p.baths}
                        </span>
                      </span>
                    </div>
                    <p className="cd-rec-location" style={{ fontSize: "1.05rem", marginBottom: "16px" }}>{p.city}, {p.state}</p>
                  </div>
                  <div className="cd-rec-reason" style={{ paddingTop: "16px", borderTop: "1px solid #E2E8F0" }}>
                    <span style={{ fontSize: "0.8rem", letterSpacing: "0.05em" }}>{p.title.toUpperCase()}</span>
                    <Link className="cd-see-why" href={`/portal/explore` as Route}>
                      Details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ── Tours + Agent ── */}
      <section className="cd-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "40px", marginBottom: "56px" }}>
        <div className="cd-tours-section">
          <div className="cd-section-head" style={{ marginBottom: "24px" }}>
            <h2 style={{ fontSize: "1.5rem" }}>Upcoming Tours</h2>
            <Link href={"/portal/tours" as Route} className="cd-manage-btn" style={{ padding: "8px 16px", textDecoration: "none" }}>
              Manage Tours
            </Link>
          </div>
          {tours.length === 0 ? (
            <EmptyState message="No tours scheduled yet. Browse properties to book a viewing." />
          ) : (
            <div className="cd-tours-list" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {tours.slice(0, 3).map((t) => {
                const d = formatTourDate(t.scheduledAt);
                return (
                  <div key={t.id} className="cd-tour-row" style={{ padding: "20px", display: "flex", gap: "20px", alignItems: "center" }}>
                    <div className="cd-tour-thumb-wrap" style={{ width: "80px", height: "60px", flexShrink: 0 }}>
                      <Image
                        src={propertyImg(t.property)}
                        alt={t.property.title}
                        width={80}
                        height={60}
                        style={{ objectFit: "cover", borderRadius: "8px", width: "100%", height: "100%" }}
                      />
                    </div>
                    <div className="cd-tour-info" style={{ flexGrow: 1 }}>
                      <strong style={{ fontSize: "1.1rem" }}>{t.property.title}</strong>
                      <p style={{ margin: "4px 0 8px 0" }}>{t.property.address}</p>
                      <div className="cd-tour-tags">
                        <span className="cd-tour-type" style={{ padding: "4px 10px" }}>{formatTourType(t.type)}</span>
                        {t.property.agent && (
                          <span className="cd-tour-agent" style={{ padding: "4px 10px" }}>Agent: {t.property.agent.name}</span>
                        )}
                      </div>
                    </div>
                    <div className="cd-tour-date" style={{ textAlign: "right" }}>
                      <span className={d.isTomorrow ? "cd-tomorrow" : ""} style={{ fontSize: "1.1rem", display: "block", marginBottom: "4px" }}>
                        {d.date}
                      </span>
                      <small style={{ fontSize: "0.9rem" }}>{d.time}</small>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="cd-agent-section">
          <h2 style={{ fontSize: "1.5rem", marginBottom: "24px" }}>Your Agent</h2>
          <div className="cd-agent-card" style={{ padding: "32px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", textAlign: "center" }}>
            <Image
              src="/agent-avatar.png"
              alt="Agent"
              width={96}
              height={96}
              className="cd-agent-avatar"
              style={{ borderRadius: "50%", marginBottom: "8px", border: "4px solid #EFF6FF" }}
            />
            <strong style={{ fontSize: "1.2rem" }}>{lead?.agentName || "Unassigned"}</strong>
            <span className="cd-agent-title" style={{ color: "#2563EB", fontWeight: "600" }}>
              {lead?.agentName ? "Senior Advisor" : "Pending assignment"}
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%", marginTop: "16px" }}>
              <Link href={"/portal/messages" as Route} className="cd-agent-message-btn" style={{ width: "100%", padding: "12px", textAlign: "center", textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <Icon.Message size={16} /> Message
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Saved Homes ── */}
      <section className="cd-section">
        <div className="cd-section-head" style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "1.5rem" }}>Your Saved Homes</h2>
          <Link href={"/portal/saved" as Route} className="cd-view-all">
            View all
          </Link>
        </div>
        {saved.length === 0 ? (
          <EmptyState message="You haven't saved any properties yet. Explore listings and tap the heart to save favorites." />
        ) : (
          <div className="cd-saved-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
            {saved.slice(0, 4).map((s) => (
              <article key={s.id} className="cd-saved-card">
                <div className="cd-saved-img-wrap" style={{ height: "180px" }}>
                  <Image src={propertyImg(s.property)} alt={s.property.title} fill className="cd-saved-img" />
                  <button
                    className="cd-saved-heart liked"
                    aria-label="Unsave"
                    onClick={() => toggleSave(s.property.id)}
                  >
                    <Icon.HeartFilled size={16} />
                  </button>
                </div>
                <div className="cd-saved-info" style={{ padding: "20px" }}>
                  <strong style={{ fontSize: "1.2rem", marginBottom: "4px", display: "block" }}>{formatPrice(s.property.price)}</strong>
                  <p style={{ margin: "0 0 12px 0", height: "40px" }}>{s.property.city}, {s.property.state}</p>
                  <div className="cd-saved-meta" style={{ paddingTop: "16px", borderTop: "1px solid #E2E8F0" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <Icon.Ruler size={14} /> {s.property.sqft ?? "—"} sqft
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <Icon.Clock size={14} /> Saved {formatRelativeTime(s.savedAt)}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div style={{
      padding: "48px 32px",
      background: "#FFFFFF",
      border: "1px dashed #CBD5E1",
      borderRadius: "12px",
      textAlign: "center",
      color: "#64748B",
    }}>
      {message}
    </div>
  );
}
