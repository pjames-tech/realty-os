import Link from "next/link";
import { MarketingShell, MarketingHero, MarketingSection } from "@/components/marketing-shell";

type Step = { num: string; title: string; desc: string; details: string[] };

const STEPS: Step[] = [
  {
    num: "01",
    title: "Create your account",
    desc: "Register as a solo agent if you're independent, or as a brokerage admin if you're setting up a team.",
    details: [
      "Pick a strong password",
      "Brokerage admins enter their organization name",
      "Your account activates instantly",
    ],
  },
  {
    num: "02",
    title: "Set up your lead pipeline",
    desc: "Configure intake so leads flow directly into your dashboard.",
    details: [
      "Copy your unique inquiry link for social posts",
      "Embed Sloane on your website for 24/7 qualification",
      "Connect CRM integrations in Settings",
    ],
  },
  {
    num: "03",
    title: "Let Sloane qualify leads",
    desc: "Sloane extracts budget, timeline, location, and property preferences through natural conversation.",
    details: [
      "Leads scored Hot / Warm / Cold automatically",
      "Auto-tagged with property preferences",
      "Instant notification when a lead is ready",
    ],
  },
  {
    num: "04",
    title: "Work your dashboard",
    desc: "The CRM dashboard is your command center — view leads, send messages, book tours, track performance.",
    details: [
      "Filter by status, score, or date",
      "Send direct messages to clients",
      "View analytics on conversion rates",
    ],
  },
  {
    num: "05",
    title: "Grow your team",
    desc: "If you're running a brokerage, invite agents from Settings → Team.",
    details: [
      "Generate a secure invite link per agent",
      "Agents are auto-assigned to your organization",
      "Route leads to specific agents from the dashboard",
    ],
  },
];

export default function GettingStartedPage() {
  return (
    <MarketingShell>
      <MarketingHero
        kicker="Getting started"
        title="From zero to qualified leads in 5 steps"
        subtitle="Follow this guide to set up your RealtyOS workspace and start converting leads automatically."
      />

      <MarketingSection>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {STEPS.map((step) => (
            <div
              key={step.num}
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "16px",
                padding: "28px",
              }}
            >
              <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
                <span
                  style={{
                    background: "#FFF7ED",
                    color: "#F25C05",
                    fontWeight: "800",
                    fontSize: "1rem",
                    width: "44px",
                    height: "44px",
                    borderRadius: "10px",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  {step.num}
                </span>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: "0 0 8px 0", fontSize: "1.1rem", fontWeight: "700", color: "#0F172A" }}>{step.title}</h3>
                  <p style={{ margin: "0 0 14px 0", fontSize: "0.95rem", lineHeight: 1.6, color: "#475569" }}>{step.desc}</p>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
                    {step.details.map((d) => (
                      <li key={d} style={{ fontSize: "0.9rem", color: "#64748B", display: "flex", gap: "10px", alignItems: "center" }}>
                        <span style={{ color: "#22C55E", fontWeight: "700" }}>✓</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection background="#FFFFFF">
        <div style={{ textAlign: "center" }}>
          <Link
            href="/admin/register"
            style={{
              display: "inline-block",
              background: "#F25C05",
              color: "#FFFFFF",
              padding: "14px 32px",
              borderRadius: "8px",
              fontWeight: "700",
              fontSize: "0.95rem",
              textDecoration: "none",
            }}
          >
            Create your free account →
          </Link>
          <p style={{ marginTop: "16px", fontSize: "0.9rem", color: "#94A3B8" }}>
            No credit card required. Start qualifying leads in minutes.
          </p>
        </div>
      </MarketingSection>
    </MarketingShell>
  );
}
