import Link from "next/link";
import { MarketingShell, MarketingHero, MarketingSection } from "@/components/marketing-shell";

type Integration = {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  features: string[];
  status: "Available" | "Coming Soon";
};

const INTEGRATIONS: Integration[] = [
  {
    id: "manychat",
    name: "ManyChat",
    icon: "💬",
    color: "#0084FF",
    description: "Automate Instagram DMs and Facebook Messenger to qualify leads 24/7. Connect ManyChat flows to your RealtyOS inquiry link.",
    features: [
      "Auto-reply to IG DM keywords",
      "Facebook comment-to-DM automation",
      "Drip sequences for unqualified leads",
      "Real-time lead sync",
    ],
    status: "Available",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: "📸",
    color: "#E1306C",
    description: "Turn Instagram content into a lead machine. Bio link, Story mentions, and Reel CTAs all route to Sloane.",
    features: [
      "Smart bio link → inquiry form",
      "Story link stickers to Sloane",
      "Keyword-based DM triage",
      "Post-level lead attribution",
    ],
    status: "Available",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: "🎵",
    color: "#000000",
    description: "Capture leads from TikTok without breaking the scroll. Your bio link opens a Sloane-powered inquiry page.",
    features: [
      "Bio link with agent tracking",
      "TikTok Live comment capture",
      "Campaign-level ROI attribution",
      "Auto-push to CRM",
    ],
    status: "Available",
  },
  {
    id: "facebook",
    name: "Facebook Lead Ads",
    icon: "📘",
    color: "#1877F2",
    description: "Sync Facebook Lead Ad submissions directly into your pipeline, pre-qualified by Sloane before agent handoff.",
    features: [
      "Direct Lead Ad → RealtyOS sync",
      "AI pre-qualification",
      "Marketplace listing auto-response",
      "Retargeting pixel integration",
    ],
    status: "Coming Soon",
  },
  {
    id: "zapier",
    name: "Zapier",
    icon: "⚡",
    color: "#FF4A00",
    description: "Connect RealtyOS to 5,000+ apps. Automate routing, notifications, CRM updates, and follow-ups with no code.",
    features: [
      "Trigger on new qualified leads",
      "Sync to Sheets, Airtable, Notion",
      "SMS follow-ups via Twilio",
      "External CRM updates",
    ],
    status: "Coming Soon",
  },
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    icon: "📱",
    color: "#25D366",
    description: "Let prospects inquire via WhatsApp. Sloane handles the conversation in their preferred channel.",
    features: [
      "Catalog integration for listings",
      "Automated response templates",
      "Media sharing (plans, tours)",
      "Multi-agent routing",
    ],
    status: "Coming Soon",
  },
];

const WORKFLOW_STEPS = [
  { step: "1", title: "Share your link", desc: "Drop your unique inquiry link in bio, DMs, Stories, or ads." },
  { step: "2", title: "Sloane qualifies", desc: "AI handles name, budget, timeline, and location in under 60 seconds." },
  { step: "3", title: "Lead hits dashboard", desc: "Qualified leads appear in your dashboard in real time, scored and ready." },
  { step: "4", title: "Automation runs", desc: "ManyChat or Zapier triggers follow-ups, SMS, or calendar bookings." },
];

export default function AutomationsPage() {
  return (
    <MarketingShell>
      <MarketingHero
        kicker="Automations & integrations"
        title="Turn every social post into a qualified lead"
        subtitle="Connect RealtyOS to ManyChat, Instagram, TikTok, and 5,000+ apps. Automate lead capture — focus on closing."
      />

      <MarketingSection>
        <h2 style={{ textAlign: "center", fontSize: "1.4rem", fontWeight: "800", color: "#0F172A", margin: "0 0 32px 0" }}>
          How it works
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
          {WORKFLOW_STEPS.map((w) => (
            <div key={w.step} style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "24px 20px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "#FFF7ED",
                  border: "2px solid #FDBA74",
                  display: "grid",
                  placeItems: "center",
                  fontWeight: "800",
                  fontSize: "0.85rem",
                  color: "#F25C05",
                  marginBottom: "12px",
                }}
              >
                {w.step}
              </div>
              <h4 style={{ margin: "0 0 6px 0", fontSize: "0.95rem", fontWeight: "700", color: "#0F172A" }}>{w.title}</h4>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748B", lineHeight: 1.5 }}>{w.desc}</p>
            </div>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection background="#FFFFFF">
        <h2 style={{ textAlign: "center", fontSize: "1.4rem", fontWeight: "800", color: "#0F172A", margin: "0 0 12px 0" }}>Integrations</h2>
        <p style={{ textAlign: "center", fontSize: "0.95rem", color: "#64748B", margin: "0 0 32px 0" }}>
          Plug into the platforms where your prospects already spend time.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
          {INTEGRATIONS.map((intg) => (
            <div
              key={intg.id}
              style={{
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderRadius: "14px",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "10px",
                      background: intg.color + "18",
                      display: "grid",
                      placeItems: "center",
                      fontSize: "1.3rem",
                    }}
                  >
                    {intg.icon}
                  </div>
                  <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: "700", color: "#0F172A" }}>{intg.name}</h3>
                </div>
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: "600",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    background: intg.status === "Available" ? "#DCFCE7" : "#FEF3C7",
                    color: intg.status === "Available" ? "#15803D" : "#92400E",
                  }}
                >
                  {intg.status}
                </span>
              </div>

              <p style={{ margin: 0, fontSize: "0.9rem", color: "#475569", lineHeight: 1.55 }}>{intg.description}</p>

              <ul style={{ margin: 0, padding: "0 0 0 18px", display: "flex", flexDirection: "column", gap: "4px" }}>
                {intg.features.map((f, i) => (
                  <li key={i} style={{ fontSize: "0.85rem", color: "#64748B", lineHeight: 1.5 }}>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection>
        <div
          style={{
            background: "#0F172A",
            borderRadius: "16px",
            padding: "48px 32px",
            textAlign: "center",
          }}
        >
          <h2 style={{ color: "#FFFFFF", fontSize: "1.6rem", fontWeight: "800", margin: "0 0 12px 0" }}>
            Stop leaving leads on the table
          </h2>
          <p style={{ color: "#94A3B8", fontSize: "0.95rem", margin: "0 auto 24px auto", maxWidth: "480px", lineHeight: 1.6 }}>
            Every DM, comment, and bio click is a potential deal. Let automation capture them all.
          </p>
          <Link
            href="/admin/register"
            style={{
              display: "inline-block",
              background: "#F25C05",
              color: "#FFFFFF",
              padding: "14px 32px",
              borderRadius: "8px",
              fontWeight: "700",
              textDecoration: "none",
              fontSize: "0.95rem",
            }}
          >
            Start free trial
          </Link>
        </div>
      </MarketingSection>
    </MarketingShell>
  );
}
