import { MarketingShell, MarketingHero, MarketingSection, FeatureCard } from "@/components/marketing-shell";
import { Icon } from "@/components/icons";

export default function CareersPage() {
  return (
    <MarketingShell>
      <MarketingHero
        kicker="Careers"
        title="Build what's next in real estate"
        subtitle="We're a small, senior team shipping AI-native software for an industry that's been waiting on it for a decade."
      />

      <MarketingSection>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "start" }}>
          <div>
            <h2 style={{ fontSize: "1.6rem", fontWeight: "800", color: "#0F172A", margin: "0 0 16px 0" }}>How we work</h2>
            <p style={{ color: "#475569", lineHeight: 1.7, margin: "0 0 14px 0" }}>
              Remote-first, async-by-default, built around deep work. We value taste, pragmatism, and shipping things people actually use.
            </p>
            <p style={{ color: "#475569", lineHeight: 1.7, margin: 0 }}>
              Compensation is competitive with senior SF/NY engineering roles. Meaningful equity for early hires.
            </p>
          </div>
          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "16px", padding: "28px" }}>
            <h3 style={{ margin: "0 0 8px 0", fontSize: "1.05rem", fontWeight: "700", color: "#0F172A" }}>Currently hiring</h3>
            <p style={{ color: "#64748B", fontSize: "0.95rem", lineHeight: 1.6, margin: "0 0 16px 0" }}>
              We don't have open roles posted right now, but we always want to meet sharp people.
            </p>
            <p style={{ color: "#475569", fontSize: "0.9rem", margin: 0 }}>
              Send your work to <strong style={{ color: "#0F172A" }}>careers@realtyos.com</strong>.
            </p>
          </div>
        </div>
      </MarketingSection>

      <MarketingSection background="#FFFFFF">
        <h2 style={{ fontSize: "1.6rem", fontWeight: "800", color: "#0F172A", margin: "0 0 32px 0", textAlign: "center" }}>
          What we care about
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
          <FeatureCard icon={<Icon.Brain size={22} />} title="Taste over process" description="We ship small, review closely, and trust judgment over checklists." />
          <FeatureCard icon={<Icon.Wrench size={22} />} title="Craft in production" description="We own our stack end-to-end — infra, data, AI, UX. Generalists thrive." />
          <FeatureCard icon={<Icon.Handshake size={22} />} title="Customers in the loop" description="Every engineer talks to agents. Every designer watches real sessions." />
        </div>
      </MarketingSection>
    </MarketingShell>
  );
}
