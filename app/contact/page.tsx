"use client";

import { useState } from "react";
import { MarketingShell, MarketingHero, MarketingSection } from "@/components/marketing-shell";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } else {
      const data = await res.json().catch(() => null);
      setErrorMsg(data?.error || "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <MarketingShell>
      <MarketingHero
        kicker="Contact"
        title="Get in touch"
        subtitle="Questions about features, pricing, or partnerships? We usually reply within one business day."
      />

      <MarketingSection>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "48px" }}>
          <div>
            <h3 style={{ fontSize: "1rem", fontWeight: "700", color: "#0F172A", marginTop: 0 }}>Reach us directly</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "20px" }}>
              <div>
                <p style={{ margin: "0 0 4px 0", fontSize: "0.8rem", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "700" }}>Sales</p>
                <p style={{ margin: 0, color: "#475569" }}>sales@realtyos.com</p>
              </div>
              <div>
                <p style={{ margin: "0 0 4px 0", fontSize: "0.8rem", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "700" }}>Support</p>
                <p style={{ margin: 0, color: "#475569" }}>support@realtyos.com</p>
              </div>
              <div>
                <p style={{ margin: "0 0 4px 0", fontSize: "0.8rem", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "700" }}>Press</p>
                <p style={{ margin: 0, color: "#475569" }}>press@realtyos.com</p>
              </div>
            </div>
          </div>

          <form onSubmit={submit} style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "16px", padding: "32px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "#475569" }}>Name</span>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "#475569" }}>Email</span>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </label>
            </div>
            <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "#475569" }}>Subject</span>
              <input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "#475569" }}>Message</span>
              <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </label>

            {status === "success" && (
              <div style={{ padding: "12px 16px", background: "#DCFCE7", color: "#166534", borderRadius: "8px", fontSize: "0.9rem" }}>
                Thanks! We&apos;ll get back to you within 24 hours.
              </div>
            )}
            {status === "error" && (
              <div style={{ padding: "12px 16px", background: "#FEE2E2", color: "#991B1B", borderRadius: "8px", fontSize: "0.9rem" }}>
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              style={{
                padding: "12px 24px",
                background: "#ff7300",
                color: "#FFF",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: status === "submitting" ? "wait" : "pointer",
                opacity: status === "submitting" ? 0.6 : 1,
                fontSize: "0.95rem",
              }}
            >
              {status === "submitting" ? "Sending..." : "Send message"}
            </button>
          </form>
        </div>
      </MarketingSection>
    </MarketingShell>
  );
}
