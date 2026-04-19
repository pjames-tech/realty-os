"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Route } from "next";
import { TourRecord, formatTourDate, formatTourType } from "@/lib/property-types";

export function PortalTours() {
  const [tours, setTours] = useState<TourRecord[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/client/tours", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      setTours(data.tours ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function cancel(id: string) {
    if (!confirm("Cancel this tour?")) return;
    await fetch(`/api/client/tours/${id}`, { method: "DELETE" });
    await load();
  }

  const upcoming = tours.filter((t) => t.status === "scheduled" && new Date(t.scheduledAt) >= new Date());
  const past = tours.filter((t) => t.status !== "scheduled" || new Date(t.scheduledAt) < new Date());

  return (
    <div>
      <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1>Tours</h1>
          <p style={{ color: "var(--text-soft)" }}>Manage your scheduled property viewings.</p>
        </div>
        <Link href={"/portal/explore" as Route} className="cd-manage-btn" style={{ textDecoration: "none" }}>
          Schedule New
        </Link>
      </div>

      {loading ? (
        <div style={{ padding: "48px", textAlign: "center", color: "#64748B" }}>Loading tours...</div>
      ) : (
        <>
          <h2 style={{ fontSize: "1.2rem", margin: "24px 0 16px" }}>Upcoming ({upcoming.length})</h2>
          {upcoming.length === 0 ? (
            <div style={{ padding: "48px", textAlign: "center", color: "#64748B", background: "#FFF", border: "1px dashed #CBD5E1", borderRadius: "12px" }}>
              No upcoming tours. Browse <Link href={"/portal/explore" as Route}>listings</Link> to book a viewing.
            </div>
          ) : (
            <div className="cd-tours-list" style={{ maxWidth: "800px" }}>
              {upcoming.map((t) => {
                const d = formatTourDate(t.scheduledAt);
                return (
                  <div key={t.id} className="cd-tour-row">
                    <div className="cd-tour-thumb-wrap">
                      <Image
                        src={t.property.images[0] || "/property-1.png"}
                        alt={t.property.title}
                        width={64}
                        height={48}
                        className="cd-tour-thumb"
                      />
                    </div>
                    <div className="cd-tour-info">
                      <strong>{t.property.title}</strong>
                      <p>{t.property.address}, {t.property.city}</p>
                      <div className="cd-tour-tags">
                        <span className="cd-tour-type">{formatTourType(t.type)}</span>
                        {t.property.agent && (
                          <span className="cd-tour-agent">Agent: {t.property.agent.name}</span>
                        )}
                      </div>
                    </div>
                    <div className="cd-tour-date">
                      <span className={d.isTomorrow ? "cd-tomorrow" : ""}>{d.date}</span>
                      <small>{d.time}</small>
                      <button
                        onClick={() => cancel(t.id)}
                        style={{ display: "block", marginTop: "8px", fontSize: "0.75rem", padding: "4px 10px", background: "transparent", border: "1px solid #FCA5A5", color: "#DC2626", borderRadius: "6px", cursor: "pointer" }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {past.length > 0 && (
            <>
              <h2 style={{ fontSize: "1.2rem", margin: "48px 0 16px" }}>Past ({past.length})</h2>
              <div className="cd-tours-list" style={{ maxWidth: "800px", opacity: 0.7 }}>
                {past.map((t) => {
                  const d = formatTourDate(t.scheduledAt);
                  return (
                    <div key={t.id} className="cd-tour-row">
                      <div className="cd-tour-thumb-wrap">
                        <Image
                          src={t.property.images[0] || "/property-1.png"}
                          alt={t.property.title}
                          width={64}
                          height={48}
                          className="cd-tour-thumb"
                        />
                      </div>
                      <div className="cd-tour-info">
                        <strong>{t.property.title}</strong>
                        <p>{t.property.address}</p>
                        <div className="cd-tour-tags">
                          <span className="cd-tour-type">{formatTourType(t.type)}</span>
                          <span className="cd-tour-agent">{t.status === "cancelled" ? "Cancelled" : "Completed"}</span>
                        </div>
                      </div>
                      <div className="cd-tour-date">
                        <span>{d.date}</span>
                        <small>{d.time}</small>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
