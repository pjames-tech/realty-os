"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { PropertyCard, formatPrice, formatPropertyType } from "@/lib/property-types";
import { Icon } from "./icons";

type FormState = {
  title: string;
  description: string;
  price: string;
  beds: string;
  baths: string;
  sqft: string;
  type: "single_family" | "condo" | "townhouse" | "apartment" | "multi_family" | "land";
  status: "active" | "pending" | "sold" | "off_market";
  address: string;
  city: string;
  state: string;
  zip: string;
  images: string;
  features: string;
};

const EMPTY_FORM: FormState = {
  title: "",
  description: "",
  price: "",
  beds: "",
  baths: "",
  sqft: "",
  type: "single_family",
  status: "active",
  address: "",
  city: "",
  state: "",
  zip: "",
  images: "",
  features: "",
};

export function AdminListingsView() {
  const [listings, setListings] = useState<PropertyCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/properties?take=100", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      setListings(data.properties ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
    setShowForm(true);
  }

  function openEdit(p: PropertyCard) {
    setEditingId(p.id);
    setForm({
      title: p.title,
      description: p.description ?? "",
      price: String(p.price),
      beds: String(p.beds),
      baths: String(p.baths),
      sqft: p.sqft ? String(p.sqft) : "",
      type: p.type as FormState["type"],
      status: p.status as FormState["status"],
      address: p.address,
      city: p.city,
      state: p.state,
      zip: p.zip,
      images: p.images.join("\n"),
      features: p.features.join(", "),
    });
    setError("");
    setShowForm(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const body = {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      price: parseInt(form.price),
      beds: parseInt(form.beds),
      baths: parseFloat(form.baths),
      sqft: form.sqft ? parseInt(form.sqft) : undefined,
      type: form.type,
      status: form.status,
      address: form.address.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      zip: form.zip.trim(),
      images: form.images.split("\n").map((l) => l.trim()).filter(Boolean),
      features: form.features.split(",").map((l) => l.trim()).filter(Boolean),
    };

    const url = editingId ? `/api/properties/${editingId}` : "/api/properties";
    const method = editingId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error || "Failed to save");
      setSaving(false);
      return;
    }

    setShowForm(false);
    setSaving(false);
    await load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this listing? This cannot be undone.")) return;
    await fetch(`/api/properties/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ margin: 0 }}>Listings</h1>
          <p style={{ color: "#64748B", margin: "4px 0 0 0" }}>Manage your property inventory.</p>
        </div>
        <button
          onClick={openCreate}
          style={{ padding: "10px 20px", background: "#ff7300", color: "#FFF", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}
        >
          + New Listing
        </button>
      </div>

      {loading ? (
        <div style={{ padding: "48px", textAlign: "center", color: "#64748B" }}>Loading listings...</div>
      ) : listings.length === 0 ? (
        <div style={{ padding: "48px", textAlign: "center", color: "#64748B", background: "#FFF", border: "1px dashed #CBD5E1", borderRadius: "12px" }}>
          No listings yet. Click &ldquo;New Listing&rdquo; to create your first property.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
          {listings.map((p) => (
            <article key={p.id} style={{ background: "#FFF", border: "1px solid #E2E8F0", borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ position: "relative", height: "180px", background: "#F1F5F9" }}>
                {p.images[0] ? (
                  <Image src={p.images[0]} alt={p.title} fill style={{ objectFit: "cover" }} />
                ) : (
                  <div style={{ height: "100%", display: "grid", placeItems: "center", color: "#94A3B8" }}>No image</div>
                )}
                <span style={{
                  position: "absolute", top: "12px", left: "12px",
                  padding: "4px 10px", borderRadius: "100px",
                  background: p.status === "active" ? "#DCFCE7" : p.status === "sold" ? "#FEE2E2" : "#FEF3C7",
                  color: p.status === "active" ? "#16A34A" : p.status === "sold" ? "#DC2626" : "#A16207",
                  fontSize: "0.7rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em"
                }}>
                  {p.status.replace("_", " ")}
                </span>
              </div>
              <div style={{ padding: "16px", flexGrow: 1, display: "flex", flexDirection: "column" }}>
                <strong style={{ fontSize: "1.2rem", marginBottom: "4px" }}>{formatPrice(p.price)}</strong>
                <p style={{ margin: "0 0 4px 0", fontWeight: "500" }}>{p.title}</p>
                <p style={{ margin: "0 0 12px 0", color: "#64748B", fontSize: "0.85rem" }}>
                  {p.city}, {p.state} · {formatPropertyType(p.type)}
                </p>
                <div style={{ display: "flex", gap: "14px", fontSize: "0.85rem", color: "#475569", marginBottom: "16px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <Icon.Bed size={14} /> {p.beds}
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <Icon.Bath size={14} /> {p.baths}
                  </span>
                  {p.sqft && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <Icon.Ruler size={14} /> {p.sqft.toLocaleString()} sqft
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
                  <button
                    onClick={() => openEdit(p)}
                    style={{ flexGrow: 1, padding: "8px", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "6px", fontWeight: "600", cursor: "pointer", fontSize: "0.85rem" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(p.id)}
                    style={{ padding: "8px 12px", background: "transparent", border: "1px solid #FCA5A5", color: "#DC2626", borderRadius: "6px", fontWeight: "600", cursor: "pointer", fontSize: "0.85rem" }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {showForm && (
        <div
          onClick={() => setShowForm(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "grid", placeItems: "center", zIndex: 50, padding: "20px", overflow: "auto" }}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={save}
            style={{ background: "#FFF", borderRadius: "12px", padding: "32px", width: "100%", maxWidth: "640px", display: "flex", flexDirection: "column", gap: "16px", maxHeight: "90vh", overflowY: "auto" }}
          >
            <h2 style={{ margin: 0 }}>{editingId ? "Edit Listing" : "New Listing"}</h2>

            <FormField label="Title" required>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </FormField>

            <FormField label="Description">
              <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </FormField>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
              <FormField label="Price ($)" required>
                <input required type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </FormField>
              <FormField label="Beds" required>
                <input required type="number" min="0" value={form.beds} onChange={(e) => setForm({ ...form, beds: e.target.value })} />
              </FormField>
              <FormField label="Baths" required>
                <input required type="number" min="0" step="0.5" value={form.baths} onChange={(e) => setForm({ ...form, baths: e.target.value })} />
              </FormField>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
              <FormField label="Sq Ft">
                <input type="number" min="0" value={form.sqft} onChange={(e) => setForm({ ...form, sqft: e.target.value })} />
              </FormField>
              <FormField label="Type" required>
                <select required value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as FormState["type"] })}>
                  <option value="single_family">Single Family</option>
                  <option value="condo">Condo</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="apartment">Apartment</option>
                  <option value="multi_family">Multi-Family</option>
                  <option value="land">Land</option>
                </select>
              </FormField>
              <FormField label="Status" required>
                <select required value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as FormState["status"] })}>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="sold">Sold</option>
                  <option value="off_market">Off Market</option>
                </select>
              </FormField>
            </div>

            <FormField label="Address" required>
              <input required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </FormField>

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "12px" }}>
              <FormField label="City" required>
                <input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </FormField>
              <FormField label="State" required>
                <input required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
              </FormField>
              <FormField label="ZIP" required>
                <input required value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} />
              </FormField>
            </div>

            <FormField label="Image URLs (one per line)">
              <textarea rows={3} value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} placeholder="/property-1.png" />
            </FormField>

            <FormField label="Features (comma-separated)">
              <input value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder="Pool, Garage, Hardwood floors" />
            </FormField>

            {error && <p style={{ color: "#DC2626", margin: 0, fontSize: "0.9rem" }}>{error}</p>}

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "8px" }}>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: "10px 20px", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
                Cancel
              </button>
              <button type="submit" disabled={saving} style={{ padding: "10px 20px", background: "#ff7300", color: "#FFF", border: "none", borderRadius: "8px", fontWeight: "600", cursor: saving ? "wait" : "pointer", opacity: saving ? 0.6 : 1 }}>
                {saving ? "Saving..." : editingId ? "Save Changes" : "Create Listing"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "#475569" }}>
        {label}{required && <span style={{ color: "#DC2626" }}> *</span>}
      </span>
      <div className="listing-form-field" style={{ display: "contents" }}>
        {children}
      </div>
    </label>
  );
}
