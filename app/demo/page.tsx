"use client";

import { useState } from "react";
import { MarketingShell, MarketingHero, MarketingSection } from "@/components/marketing-shell";

export default function DemoPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({ name: "", email: "", company: "", teamSize: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        subject: `Demo request — ${form.company} (${form.teamSize})`,
        message: `Company: ${form.company}\nTeam size: ${form.teamSize}\n\nRequesting a personalized demo.`,
      }),
    });

    if (res.ok) {
      setStatus("success");
    } else {
      const data = await res.json().catch(() => null);
      setErrorMsg(data?.error || "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <MarketingShell>
      <MarketingHero
        kicker="Book a demo"
        title="See RealtyOS in action"
        subtitle="A 30-minute walkthrough of how teams use RealtyOS to qualify leads, route them to agents, and close deals faster."
      />

      <MarketingSection>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "48px", alignItems: "start" }}>
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#0F172A", marginTop: 0, marginBottom: "16px" }}>What you'll see</h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                "Live Sloane qualification flow",
                "Agent dashboard walkthrough",
                "Brokerage admin + team management",
                "Client portal end-to-end",
                "Integrations for your existing stack",
              ].map((item) => (
                <li key={item} style={{ display: "flex", gap: "12px", alignItems: "flex-start", color: "#475569", lineHeight: 1.6 }}>
                  <span style={{ color: "#F25C05", fontWeight: "700" }}>→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {status === "success" ? (
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "16px",
                padding: "48px 32px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>✅</div>
              <h2 style={{ margin: "0 0 12px 0", fontSize: "1.3rem", fontWeight: "800", color: "#0F172A" }}>
                Demo requested
              </h2>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "#64748B", lineHeight: 1.6 }}>
                We'll reach out to <strong style={{ color: "#0F172A" }}>{form.email}</strong> within one business day to schedule your walkthrough.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "16px",
                padding: "32px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "#475569" }}>Full name</span>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Jane Smith"
                />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "#475569" }}>Work email</span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="jane@brokerage.com"
                />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "#475569" }}>Brokerage</span>
                <input
                  required
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="Vanguard Realty Group"
                />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "#475569" }}>Team size</span>
                <select required value={form.teamSize} onChange={(e) => setForm({ ...form, teamSize: e.target.value })}>
                  <option value="">Select…</option>
                  <option value="solo">Just me</option>
                  <option value="2-5">2–5 agents</option>
                  <option value="6-20">6–20 agents</option>
                  <option value="20+">20+ agents</option>
                </select>
              </label>

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
                  background: "#F25C05",
                  color: "#FFF",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: status === "submitting" ? "wait" : "pointer",
                  opacity: status === "submitting" ? 0.6 : 1,
                  fontSize: "0.95rem",
                }}
              >
                {status === "submitting" ? "Submitting…" : "Request demo"}
              </button>
            </form>
          )}
        </div>
      </MarketingSection>
    </MarketingShell>
  );
}
