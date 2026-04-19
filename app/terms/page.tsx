import { MarketingShell, MarketingHero, MarketingSection } from "@/components/marketing-shell";

const SECTIONS: { heading: string; body: string }[] = [
  {
    heading: "Acceptance",
    body: "By accessing or using RealtyOS, you agree to these terms. If you don't agree, don't use the platform. These terms apply whether you use the software as an agent, a brokerage admin, or a client engaging with a listing.",
  },
  {
    heading: "Who can use it",
    body: "Agent and brokerage accounts are intended for licensed real estate professionals. You're responsible for maintaining accurate account information and for complying with all applicable real estate regulations in your jurisdiction.",
  },
  {
    heading: "Your content",
    body: "You own the leads, listings, and messages you create on the platform. You grant RealtyOS a limited license to process that content to deliver the service (including AI qualification, search, and analytics). You're responsible for ensuring you have the right to submit the content.",
  },
  {
    heading: "AI-generated output",
    body: "RealtyOS uses AI for qualification, drafting, and recommendations. AI output is a starting point — not legal, financial, or regulatory advice. Review before acting, especially for pricing, disclosures, and compliance decisions.",
  },
  {
    heading: "Limitation of liability",
    body: "The platform is provided as-is. To the maximum extent allowed by law, RealtyOS is not liable for indirect, incidental, or consequential damages, or for decisions made in reliance on AI-generated content. Total liability is capped at the fees paid in the 12 months before the claim.",
  },
  {
    heading: "Termination",
    body: "We may suspend or terminate accounts that violate these terms, engage in fraudulent activity, or threaten platform integrity. You may close your account at any time; we'll help export your data.",
  },
  {
    heading: "Changes",
    body: "We may update these terms as the product evolves. Material changes will be announced in advance; continued use after the effective date constitutes acceptance.",
  },
];

export default function TermsPage() {
  return (
    <MarketingShell>
      <MarketingHero
        kicker="Terms"
        title="Terms of Service"
        subtitle="The rules of engagement for using RealtyOS — written in plain language."
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
              Questions about these terms? Email <strong style={{ color: "#0F172A" }}>legal@realtyos.com</strong>.
            </p>
          </div>
        </div>
      </MarketingSection>
    </MarketingShell>
  );
}
