"use client";

import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { PropertyCard, formatPrice, formatPropertyType } from "@/lib/property-types";

const PROPERTY_TYPES = [
  { value: "", label: "All Types" },
  { value: "single_family", label: "Single Family" },
  { value: "condo", label: "Condo" },
  { value: "townhouse", label: "Townhouse" },
  { value: "apartment", label: "Apartment" },
  { value: "multi_family", label: "Multi-Family" },
];

const PRICE_RANGES = [
  { label: "Any Price", min: "", max: "" },
  { label: "Under $500k", min: "", max: "500000" },
  { label: "$500k – $1M", min: "500000", max: "1000000" },
  { label: "$1M – $3M", min: "1000000", max: "3000000" },
  { label: "$3M+", min: "3000000", max: "" },
];

export function PortalExplore() {
  const [properties, setProperties] = useState<PropertyCard[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [priceIdx, setPriceIdx] = useState(0);
  const [minBeds, setMinBeds] = useState("");

  const loadSaved = useCallback(async () => {
    const res = await fetch("/api/client/saved", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      setSavedIds(new Set((data.saved ?? []).map((s: { property: { id: string } }) => s.property.id)));
    }
  }, []);

  const search = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (type) params.set("type", type);
    const price = PRICE_RANGES[priceIdx];
    if (price.min) params.set("minPrice", price.min);
    if (price.max) params.set("maxPrice", price.max);
    if (minBeds) params.set("minBeds", minBeds);
    params.set("take", "48");

    const res = await fetch(`/api/properties?${params}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      setProperties(data.properties ?? []);
    }
    setLoading(false);
  }, [q, type, priceIdx, minBeds]);

  useEffect(() => {
    void search();
    void loadSaved();
  }, [search, loadSaved]);

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
    await loadSaved();
  }

  async function bookTour(propertyId: string) {
    const when = new Date();
    when.setDate(when.getDate() + 2);
    when.setHours(10, 0, 0, 0);

    const res = await fetch("/api/client/tours", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        propertyId,
        scheduledAt: when.toISOString(),
        type: "in_person",
      }),
    });
    if (res.ok) {
      alert("Tour requested! Your agent will confirm the time.");
    } else {
      alert("Could not request tour. Please try again.");
    }
  }

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1>Explore Properties</h1>
        <p style={{ color: "var(--text-soft)" }}>Discover homes matching your lifestyle.</p>
      </div>

      {/* Filters */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr 1fr auto",
        gap: "12px",
        padding: "16px",
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: "12px",
        marginBottom: "24px",
      }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by city, neighborhood, or address..."
          style={{ padding: "10px 14px", border: "1px solid #E2E8F0", borderRadius: "8px", fontSize: "0.9rem" }}
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{ padding: "10px 14px", border: "1px solid #E2E8F0", borderRadius: "8px", fontSize: "0.9rem", background: "#FFF" }}
        >
          {PROPERTY_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <select
          value={priceIdx}
          onChange={(e) => setPriceIdx(Number(e.target.value))}
          style={{ padding: "10px 14px", border: "1px solid #E2E8F0", borderRadius: "8px", fontSize: "0.9rem", background: "#FFF" }}
        >
          {PRICE_RANGES.map((r, i) => (
            <option key={i} value={i}>{r.label}</option>
          ))}
        </select>
        <select
          value={minBeds}
          onChange={(e) => setMinBeds(e.target.value)}
          style={{ padding: "10px 14px", border: "1px solid #E2E8F0", borderRadius: "8px", fontSize: "0.9rem", background: "#FFF" }}
        >
          <option value="">Any Beds</option>
          <option value="1">1+ Beds</option>
          <option value="2">2+ Beds</option>
          <option value="3">3+ Beds</option>
          <option value="4">4+ Beds</option>
          <option value="5">5+ Beds</option>
        </select>
        <button
          onClick={search}
          style={{ padding: "10px 20px", background: "var(--brand-blue, #2563EB)", color: "#FFF", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}
        >
          Search
        </button>
      </div>

      {loading ? (
        <div style={{ padding: "64px", textAlign: "center", color: "#64748B" }}>Searching...</div>
      ) : properties.length === 0 ? (
        <div style={{ padding: "64px", textAlign: "center", color: "#64748B", background: "#FFF", border: "1px dashed #CBD5E1", borderRadius: "12px" }}>
          No properties match your filters. Try broadening your search.
        </div>
      ) : (
        <div className="cd-rec-grid">
          {properties.map((p) => (
            <article key={p.id} className="cd-rec-card">
              <div className="cd-rec-img-wrap">
                <Image
                  src={p.images[0] || "/property-1.png"}
                  alt={p.title}
                  fill
                  className="cd-rec-img"
                />
                <button
                  className={`lp-listing-fav ${savedIds.has(p.id) ? "liked" : ""}`}
                  aria-label={savedIds.has(p.id) ? "Unsave" : "Save"}
                  onClick={() => toggleSave(p.id)}
                  style={{ position: "absolute", top: "12px", right: "12px" }}
                >
                  {savedIds.has(p.id) ? "♥" : "♡"}
                </button>
              </div>
              <div className="cd-rec-info" style={{ padding: "20px" }}>
                <div className="cd-rec-price-row" style={{ marginBottom: "8px" }}>
                  <strong style={{ fontSize: "1.3rem" }}>{formatPrice(p.price)}</strong>
                  <span>🛏 {p.beds} 🚿 {p.baths}</span>
                </div>
                <strong style={{ display: "block", marginBottom: "4px" }}>{p.title}</strong>
                <p className="cd-rec-location">{p.city}, {p.state}</p>
                <div style={{ display: "flex", gap: "8px", marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #E2E8F0" }}>
                  <span style={{ fontSize: "0.75rem", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", flexGrow: 1 }}>
                    {formatPropertyType(p.type)}
                  </span>
                  <button
                    onClick={() => bookTour(p.id)}
                    style={{ fontSize: "0.8rem", padding: "4px 12px", background: "var(--brand-blue, #2563EB)", color: "#FFF", border: "none", borderRadius: "6px", fontWeight: "600", cursor: "pointer" }}
                  >
                    Book Tour
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
