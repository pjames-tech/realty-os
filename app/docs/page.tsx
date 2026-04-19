import { MarketingShell, MarketingHero, MarketingSection } from "@/components/marketing-shell";

export default function DocsPage() {
  return (
    <MarketingShell>
      <MarketingHero
        kicker="Documentation"
        title="Platform architecture & vision"
        subtitle="How RealtyOS is built, who it's for, and what makes it different from a generic CRM."
      />

      <MarketingSection>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", marginBottom: "40px" }}>
          <div>
            <h2 style={{ fontSize: "1.3rem", fontWeight: "800", color: "#0F172A", margin: "0 0 12px 0" }}>The problem</h2>
            <p style={{ color: "#475569", lineHeight: 1.7, margin: 0 }}>
              Real estate software is fragmented. Brokers stitch together a CRM, a website, a chat widget, and a client portal —
              all from different vendors, none speaking to each other. Leads drop, responses drag, and clients feel like tickets.
            </p>
          </div>
          <div style={{ background: "#FFF6F0", border: "1px solid #FDBA74", borderRadius: "12px", padding: "20px", borderLeft: "4px solid #F25C05" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: "800", color: "#C04904", margin: "0 0 12px 0" }}>The solution</h2>
            <p style={{ color: "#9A3412", lineHeight: 1.7, margin: 0, fontWeight: "500" }}>
              An AI-native, multi-tenant operating system built vertically for real estate. Client portal, agent dashboard, and AI receptionist unified in one instant-sync architecture.
            </p>
          </div>
        </div>

        <h2 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#0F172A", margin: "40px 0 20px 0" }}>How it works for each role</h2>

        <div style={{ display: "grid", gap: "20px" }}>
          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "24px" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#0F172A", margin: "0 0 12px 0" }}>
              Clients
            </h3>
            <p style={{ color: "#475569", lineHeight: 1.6, margin: "0 0 12px 0" }}>
              Meet <strong>Sloane</strong>, our AI receptionist — she handles first contact, qualifies budget and timeline, and hands off to a human when it's time.
              After signup, clients get a dedicated portal with:
            </p>
            <ul style={{ margin: 0, paddingLeft: "20px", color: "#475569", lineHeight: 1.7 }}>
              <li>Curated listings matched to their stated preferences.</li>
              <li>A unified timeline of scheduled tours (in-person and virtual).</li>
              <li>A single message thread that merges AI history with live agent replies.</li>
            </ul>
          </div>

          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "24px" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#0F172A", margin: "0 0 12px 0" }}>
              Agents & brokerages
            </h3>
            <p style={{ color: "#475569", lineHeight: 1.6, margin: "0 0 12px 0" }}>
              Every lead arrives pre-qualified with a complete intent profile. Brokerage admins manage teams, listings, and assignment rules from one console.
            </p>
            <ul style={{ margin: 0, paddingLeft: "20px", color: "#475569", lineHeight: 1.7 }}>
              <li>Register as a solo agent or under a brokerage umbrella.</li>
              <li>Custom inquiry links route leads directly to the right console.</li>
              <li>Take over from Sloane mid-conversation with a live chat handoff.</li>
            </ul>
          </div>

          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "24px" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#0F172A", margin: "0 0 12px 0" }}>
              Developers
            </h3>
            <p style={{ color: "#475569", lineHeight: 1.6, margin: "0 0 12px 0" }}>
              The stack is deliberately lean — no heavy CSS frameworks, no bloated component libraries.
            </p>
            <ul style={{ margin: 0, paddingLeft: "20px", color: "#475569", lineHeight: 1.7 }}>
              <li><strong>Next.js 16 App Router</strong> with Server Components and edge-friendly proxy middleware.</li>
              <li><strong>Supabase (Postgres + Auth)</strong> via Prisma ORM with Zod validation at every boundary.</li>
              <li><strong>Vanilla CSS + design tokens</strong>. No Tailwind, no CSS-in-JS runtime.</li>
              <li><strong>OpenAI function-calling</strong> powers qualification; chat state persists server-side.</li>
            </ul>
          </div>
        </div>
      </MarketingSection>

      <MarketingSection background="#FFFFFF">
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#0F172A", margin: "0 0 12px 0" }}>Want the deep dive?</h2>
          <p style={{ color: "#475569", lineHeight: 1.6, margin: "0 0 20px 0" }}>
            Source, schema, and engineering notes live in the repo README.
          </p>
          <a
            href="https://github.com/pjames-tech/realty-os#readme"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              background: "#1E293B",
              color: "#FFFFFF",
              padding: "12px 24px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "0.95rem",
            }}
          >
            View on GitHub →
          </a>
        </div>
      </MarketingSection>
    </MarketingShell>
  );
}
