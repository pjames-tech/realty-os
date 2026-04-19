import { MarketingShell, MarketingHero, MarketingSection, FeatureCard } from "@/components/marketing-shell";

export default function AboutPage() {
  return (
    <MarketingShell>
      <MarketingHero
        kicker="About RealtyOS"
        title="Built for the next generation of real estate"
        subtitle="We believe every agent — whether solo or in a brokerage — deserves enterprise-grade tools. So we built them."
      />

      <MarketingSection>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: "1.8rem", fontWeight: "800", color: "#0F172A", marginTop: 0, marginBottom: "16px" }}>
              Our mission
            </h2>
            <p style={{ color: "#475569", lineHeight: 1.7, marginBottom: "16px" }}>
              Real estate is a relationship business. But in 2025, too much of an agent&apos;s time is spent on
              plumbing — qualifying leads, scheduling tours, chasing follow-ups — instead of on the relationship itself.
            </p>
            <p style={{ color: "#475569", lineHeight: 1.7, margin: 0 }}>
              RealtyOS unifies lead qualification, client communication, and pipeline management into a single platform
              powered by AI. Our job is to handle the plumbing so agents can focus on what matters most: closing deals
              and helping families find their next home.
            </p>
          </div>
          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "16px", padding: "32px" }}>
            <h3 style={{ marginTop: 0, marginBottom: "20px", fontSize: "1.1rem", fontWeight: "700", color: "#0F172A" }}>
              What makes us different
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "14px" }}>
              <li style={{ color: "#475569", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <span style={{ color: "#F25C05", fontWeight: "700" }}>→</span>
                AI-native — not AI bolted on top of a CRM from 2008.
              </li>
              <li style={{ color: "#475569", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <span style={{ color: "#F25C05", fontWeight: "700" }}>→</span>
                Built for real estate, not a generic tool with industry skins.
              </li>
              <li style={{ color: "#475569", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <span style={{ color: "#F25C05", fontWeight: "700" }}>→</span>
                Enterprise-grade without the enterprise price tag.
              </li>
              <li style={{ color: "#475569", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <span style={{ color: "#F25C05", fontWeight: "700" }}>→</span>
                Transparent, honest pricing. No sales calls required.
              </li>
            </ul>
          </div>
        </div>
      </MarketingSection>

      <MarketingSection background="#FFFFFF">
        <h2 style={{ fontSize: "1.8rem", fontWeight: "800", color: "#0F172A", marginTop: 0, marginBottom: "32px", textAlign: "center" }}>
          What we&apos;re building
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
          <FeatureCard icon="⚡" title="Instant lead qualification" description="Sloane, our AI receptionist, qualifies inbound leads 24/7 in under 3 seconds." />
          <FeatureCard icon="🎯" title="Smart routing" description="Leads are matched to the right agent based on specialty, territory, and availability." />
          <FeatureCard icon="📊" title="Pipeline clarity" description="Every conversation, booking, and handoff surfaces in one unified timeline." />
        </div>
      </MarketingSection>
    </MarketingShell>
  );
}
