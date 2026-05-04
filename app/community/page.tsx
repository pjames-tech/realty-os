import type { ReactNode } from "react";
import { MarketingShell, MarketingHero, MarketingSection } from "@/components/marketing-shell";
import { Icon } from "@/components/icons";

type Group = { icon: ReactNode; name: string; desc: string };

const GROUPS: Group[] = [
  { icon: <Icon.Chart size={22} />, name: "Market Intel", desc: "Local market trends, pricing data, and investment insights." },
  { icon: <Icon.Target size={22} />, name: "Lead Generation", desc: "Strategies for acquiring and converting more leads." },
  { icon: <Icon.Spark size={22} />, name: "New Agent Hub", desc: "Guidance, mentorship, and first-deal stories." },
  { icon: <Icon.Wrench size={22} />, name: "Tech & Tools", desc: "RealtyOS features, CRM hacks, and integrations." },
  { icon: <Icon.Building size={22} />, name: "Luxury & Commercial", desc: "High-end property discussions and deal structures." },
  { icon: <Icon.Megaphone size={22} />, name: "Marketing Playbooks", desc: "Social content, paid-ads frameworks, and funnel teardowns." },
];

export default function CommunityPage() {
  return (
    <MarketingShell>
      <MarketingHero
        kicker="Community"
        title="Thousands of agents, one conversation"
        subtitle="Share playbooks, ask questions, and learn from operators who've been in the trenches."
      />

      <MarketingSection>
        <h2 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#0F172A", margin: "0 0 24px 0", textAlign: "center" }}>
          Groups inside the community
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {GROUPS.map((g) => (
            <div
              key={g.name}
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "12px",
                padding: "24px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#FFF7ED",
                  color: "#ff7300",
                  borderRadius: "10px",
                  marginBottom: "12px",
                }}
              >
                {g.icon}
              </div>
              <h3 style={{ margin: "0 0 6px 0", fontSize: "1rem", fontWeight: "700", color: "#0F172A" }}>{g.name}</h3>
              <p style={{ margin: 0, color: "#64748B", fontSize: "0.9rem", lineHeight: 1.6 }}>{g.desc}</p>
            </div>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection background="#FFFFFF">
        <div
          style={{
            background: "linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 100%)",
            border: "1px solid #FDBA74",
            borderRadius: "16px",
            padding: "40px",
            textAlign: "center",
            maxWidth: "720px",
            margin: "0 auto",
          }}
        >
          <h2 style={{ fontSize: "1.6rem", fontWeight: "800", color: "#0F172A", margin: "0 0 12px 0" }}>
            Join the conversation
          </h2>
          <p style={{ color: "#475569", lineHeight: 1.6, margin: "0 0 24px 0" }}>
            The RealtyOS community lives on Slack. Every new customer gets an invite; if you&apos;d like early access, email us.
          </p>
          <a
            href="mailto:community@realtyos.com?subject=Community%20invite"
            style={{
              display: "inline-block",
              background: "#ff7300",
              color: "#FFFFFF",
              padding: "12px 28px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "0.95rem",
            }}
          >
            Request an invite
          </a>
        </div>
      </MarketingSection>
    </MarketingShell>
  );
}
