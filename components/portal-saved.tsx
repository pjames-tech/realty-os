"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Route } from "next";
import { SavedRecord, formatPrice, formatRelativeTime } from "@/lib/property-types";

export function PortalSaved() {
  const [saved, setSaved] = useState<SavedRecord[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/client/saved", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      setSaved(data.saved ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function unsave(propertyId: string) {
    await fetch(`/api/client/saved/${propertyId}`, { method: "DELETE" });
    await load();
  }

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1>Saved Properties</h1>
        <p style={{ color: "var(--text-soft)" }}>Your favorites, all in one place.</p>
      </div>

      {loading ? (
        <div style={{ padding: "48px", textAlign: "center", color: "#64748B" }}>Loading...</div>
      ) : saved.length === 0 ? (
        <div style={{ padding: "48px", textAlign: "center", color: "#64748B", background: "#FFF", border: "1px dashed #CBD5E1", borderRadius: "12px" }}>
          You haven&apos;t saved any properties yet. <Link href={"/portal/explore" as Route}>Browse listings</Link> to get started.
        </div>
      ) : (
        <div className="cd-saved-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "24px" }}>
          {saved.map((s) => (
            <article key={s.id} className="cd-saved-card">
              <div className="cd-saved-img-wrap" style={{ height: "200px" }}>
                <Image
                  src={s.property.images[0] || "/property-1.png"}
                  alt={s.property.title}
                  fill
                  className="cd-saved-img"
                />
                <button
                  className="cd-saved-heart liked"
                  aria-label="Unsave"
                  onClick={() => unsave(s.property.id)}
                >
                  🧡
                </button>
              </div>
              <div className="cd-saved-info" style={{ padding: "20px" }}>
                <strong style={{ fontSize: "1.2rem", display: "block", marginBottom: "4px" }}>{formatPrice(s.property.price)}</strong>
                <p style={{ margin: "0 0 4px 0" }}>{s.property.title}</p>
                <p style={{ margin: "0 0 12px 0", color: "#64748B", fontSize: "0.9rem" }}>
                  {s.property.city}, {s.property.state}
                </p>
                <div className="cd-saved-meta" style={{ paddingTop: "16px", borderTop: "1px solid #E2E8F0" }}>
                  <span>🛏 {s.property.beds} 🚿 {s.property.baths}</span>
                  <span>⏱ {formatRelativeTime(s.savedAt)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
