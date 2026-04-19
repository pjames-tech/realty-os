import { MarketingShell, MarketingHero, MarketingSection } from "@/components/marketing-shell";

const SECTIONS: { heading: string; body: string }[] = [
  {
    heading: "What we collect",
    body: "We collect information you provide when you create an account, submit an inquiry, or correspond with an agent — including name, email, phone number, and property preferences. We also collect standard server logs (IP, user agent, request paths) for security and debugging.",
  },
  {
    heading: "How we use it",
    body: "Your data powers the RealtyOS platform: qualifying inbound leads, matching you with the right agent, scheduling tours, and surfacing analytics to the team you're working with. We do not sell personal data to third parties.",
  },
  {
    heading: "Who sees it",
    body: "Lead and client data is scoped to the brokerage you engage with. Platform administrators have access for support and compliance purposes. Service providers (hosting, email, AI inference) process data on our behalf under strict contracts.",
  },
  {
    heading: "Security",
    body: "All traffic is encrypted in transit. Passwords are hashed with bcrypt. Sessions use HTTP-only, signed cookies. Access to infrastructure is restricted and audit-logged.",
  },
  {
    heading: "Your rights",
    body: "You can request a copy of your data, correct inaccuracies, or request deletion at any time. Contact privacy@realtyos.com and we'll respond within 30 days.",
  },
  {
    heading: "Changes",
    body: "If we materially change this policy, we'll notify active users by email and post the update here with a new effective date.",
  },
];

export default function PrivacyPage() {
  return (
    <MarketingShell>
      <MarketingHero
        kicker="Privacy"
        title="Privacy Policy"
        subtitle="How we collect, use, and protect the information you share with RealtyOS."
      />

      <MarketingSection>
        <p style={{ color: "#94A3B8", fontSize: "0.85rem", margin: "0 0 32px 0", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "700" }}>
          Effective date: January 1, 2025
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          {SECTIONS.map((s) => (
            <div key={s.heading}>
              <h2 style={{ fontSize: "1.15rem", fontWeight: "700", color: "#0F172A", margin: "0 0 8px 0" }}>{s.heading}</h2>
              <p style={{ color: "#475569", lineHeight: 1.7, margin: 0 }}>{s.body}</p>
            </div>
          ))}
          <div style={{ marginTop: "16px", paddingTop: "24px", borderTop: "1px solid #E2E8F0" }}>
            <p style={{ color: "#64748B", fontSize: "0.95rem", margin: 0 }}>
              Questions? Email <strong style={{ color: "#0F172A" }}>privacy@realtyos.com</strong>.
            </p>
          </div>
        </div>
      </MarketingSection>
    </MarketingShell>
  );
}
