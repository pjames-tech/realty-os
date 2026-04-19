import { MarketingShell, MarketingHero, MarketingSection } from "@/components/marketing-shell";

const FAQS: { q: string; a: string }[] = [
  {
    q: "How do I add a new agent to my brokerage?",
    a: "Sign in as a brokerage admin, go to Settings → Team, and enter the agent's email. We'll generate an invite link you can send them — they finish setup on their own.",
  },
  {
    q: "How does Sloane qualify inbound leads?",
    a: "Sloane asks natural follow-up questions to extract budget, timeline, location, and property type. Each conversation is scored on completeness so your team can focus on the most qualified leads first.",
  },
  {
    q: "Can I route leads from social channels?",
    a: "Yes. Every brokerage has a shareable inquiry link — paste it in your Instagram bio, Facebook page, or marketing site, and leads flow directly into your dashboard.",
  },
  {
    q: "What happens when a lead is ready to book?",
    a: "Once Sloane has the required qualification fields, she offers your calendar link. Bookings are logged on the lead record and surfaced in the schedule view.",
  },
  {
    q: "Who can see each lead?",
    a: "Leads are scoped to the brokerage. Agents see the leads assigned to them; brokerage admins see all leads within their organization.",
  },
  {
    q: "Can I export my data?",
    a: "Yes. The admin dashboard has a CSV export for leads. If you need a full export, email support and we'll generate one.",
  },
];

export default function HelpPage() {
  return (
    <MarketingShell>
      <MarketingHero
        kicker="Help Center"
        title="Answers to the questions we get most"
        subtitle="Can't find what you need? Email support@realtyos.com and we usually reply the same day."
      />

      <MarketingSection>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {FAQS.map((f) => (
            <details
              key={f.q}
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "12px",
                padding: "20px 24px",
              }}
            >
              <summary
                style={{
                  fontSize: "1rem",
                  fontWeight: "700",
                  color: "#0F172A",
                  cursor: "pointer",
                  listStyle: "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {f.q}
                <span style={{ color: "#94A3B8", fontSize: "1.2rem" }}>+</span>
              </summary>
              <p style={{ color: "#475569", lineHeight: 1.7, margin: "12px 0 0 0" }}>{f.a}</p>
            </details>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection background="#FFFFFF">
        <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#0F172A", margin: "0 0 12px 0" }}>
            Still stuck?
          </h2>
          <p style={{ color: "#475569", lineHeight: 1.6, margin: "0 0 20px 0" }}>
            Our team replies within one business day. For urgent issues, mark your email &quot;URGENT&quot; in the subject line.
          </p>
          <p style={{ color: "#0F172A", fontWeight: "600", margin: 0 }}>support@realtyos.com</p>
        </div>
      </MarketingSection>
    </MarketingShell>
  );
}
