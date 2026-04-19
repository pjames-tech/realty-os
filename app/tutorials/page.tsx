import { MarketingShell, MarketingHero, MarketingSection } from "@/components/marketing-shell";

type Tutorial = { title: string; duration: string; desc: string };
type Section = { category: string; items: Tutorial[] };

const TUTORIALS: Section[] = [
  {
    category: "Getting started",
    items: [
      { title: "Setting up your first pipeline", duration: "4 min", desc: "Configure your lead sources and start receiving qualified leads." },
      { title: "Understanding your dashboard", duration: "6 min", desc: "A walkthrough of every section of the CRM dashboard and what each metric means." },
      { title: "Sharing your inquiry link", duration: "2 min", desc: "How to copy and distribute your Sloane-powered link on social media." },
    ],
  },
  {
    category: "Lead management",
    items: [
      { title: "Working the lead detail panel", duration: "5 min", desc: "View lead profiles, send messages, and update status." },
      { title: "Lead scoring explained", duration: "3 min", desc: "How Sloane's AI scoring system works and what Hot/Warm/Cold means." },
      { title: "Assigning leads to agents", duration: "4 min", desc: "For brokerage admins: how to route leads to specific agents." },
    ],
  },
  {
    category: "Team management",
    items: [
      { title: "Inviting agents to your brokerage", duration: "3 min", desc: "Generate invite links and onboard new agents to your organization." },
      { title: "Managing permissions", duration: "4 min", desc: "The difference between Brokerage Admin, Agent, and Solo Agent roles." },
    ],
  },
  {
    category: "Advanced",
    items: [
      { title: "Customizing Sloane's behavior", duration: "7 min", desc: "Tune the AI qualification prompts for your specific market." },
      { title: "CRM integrations", duration: "5 min", desc: "Connect RealtyOS to Salesforce, HubSpot, or Follow Up Boss." },
    ],
  },
];

export default function TutorialsPage() {
  return (
    <MarketingShell>
      <MarketingHero
        kicker="Video tutorials"
        title="Learn RealtyOS in minutes"
        subtitle="Short, focused walk-throughs covering every feature — from your first lead to advanced integrations."
      />

      <MarketingSection>
        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          {TUTORIALS.map((section) => (
            <div key={section.category}>
              <h2
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "800",
                  color: "#0F172A",
                  margin: "0 0 16px 0",
                  paddingBottom: "8px",
                  borderBottom: "2px solid #F25C05",
                  display: "inline-block",
                }}
              >
                {section.category}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {section.items.map((item) => (
                  <div
                    key={item.title}
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #E2E8F0",
                      borderRadius: "12px",
                      padding: "20px",
                      display: "flex",
                      gap: "16px",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "10px",
                        background: "#FFF7ED",
                        display: "grid",
                        placeItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#F25C05">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: "0 0 4px 0", fontSize: "0.95rem", fontWeight: "600", color: "#0F172A" }}>{item.title}</h4>
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748B", lineHeight: 1.5 }}>{item.desc}</p>
                    </div>
                    <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "#94A3B8", whiteSpace: "nowrap" }}>
                      {item.duration}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection background="#FFFFFF">
        <div style={{ textAlign: "center", maxWidth: "560px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: "800", color: "#0F172A", margin: "0 0 8px 0" }}>More on the way</h2>
          <p style={{ color: "#475569", lineHeight: 1.6, margin: 0 }}>
            We're recording new tutorials every week. Have a topic request? Email tutorials@realtyos.com.
          </p>
        </div>
      </MarketingSection>
    </MarketingShell>
  );
}
