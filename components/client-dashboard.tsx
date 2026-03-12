"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Lead = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  status: string;
  qualification: {
    budget?: string;
    timeline?: string;
    location?: string;
    propertyType?: string;
    confidence: number;
  };
  appointment?: { calendarLink: string; slot: string };
};

/* ── Demo data ────────────────────────────────────────── */
const AI_RECS = [
  { img: "/property-1.png", match: 98, price: "$3,450,000", beds: 5, baths: 4, location: "Bel Air, Los Angeles", reason: "Selected for your style" },
  { img: "/property-2.png", match: 95, price: "$2,180,000", beds: 4, baths: 3, location: "Pacific Palisades, CA", reason: "Matches your commute" },
  { img: "/property-3.png", match: 92, price: "$1,890,000", beds: 3, baths: 3, location: "Santa Monica, CA", reason: "Near top rated schools" },
];

const TOURS = [
  { img: "/property-1.png", name: "Ocean View Estate", address: "1042 Pacific Coast Highway", date: "Tomorrow", time: "10:30 AM", type: "In-person Tour", agent: "Sarah Jenkins" },
  { img: "/property-2.png", name: "Oakwood Manor", address: "889 West Oak Avenue", date: "Sat, Oct 12", time: "2:00 PM", type: "Virtual Tour", agent: "Sarah Jenkins" },
];

const SAVED = [
  { img: "/property-1.png", price: "$1,150,000", location: "Beverly Hills, Terrace Drive", sqft: "3,400", saved: "3d ago" },
  { img: "/property-2.png", price: "$985,000", location: "Silver Lake, Los Angeles", sqft: "1,800", saved: "4d ago" },
  { img: "/property-3.png", price: "$4,200,000", location: "Hollywood Hills, Skyline Dr", sqft: "5,600", saved: "1w ago" },
  { img: "/property-4.png", price: "$3,950,000", location: "Malibu, Cove Rd", sqft: "3,200", saved: "1w ago" },
];

export function ClientDashboard() {
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetch("/api/client/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((p) => setLead(p.lead || null))
      .catch(() => setLead(null))
      .finally(() => setLoading(false));
  }, []);

  async function handleLogout() {
    await fetch("/api/client/logout", { method: "POST" });
    router.push("/portal/login");
    router.refresh();
  }

  const firstName = lead?.name?.split(" ")[0] || "there";

  if (loading) {
    return (
      <main className="cd-shell">
        <div className="cd-loading">Loading your dashboard...</div>
      </main>
    );
  }

  return (
    <main className="cd-shell">
      {/* ── Top bar ── */}
      <header className="cd-topbar">
        <div className="cd-topbar-left">
          <Link href="/" className="lp-logo">
            <span className="lp-logo-mark">
              <span /><span /><span />
            </span>
            <strong>RealtyOS</strong>
          </Link>
          <div className="cd-search-wrap">
            <span>🔍</span>
            <input placeholder="Search properties, areas..." className="cd-search" />
          </div>
        </div>
        <nav className="cd-topbar-nav">
          <a className="cd-nav-active" href="#dashboard">Dashboard</a>
          <a href="#explore">Explore</a>
          <a href="#tours">Tours</a>
          <a href="#messages">Messages</a>
        </nav>
        <div className="cd-topbar-right">
          <button className="cd-icon-btn" aria-label="Notifications">🔔</button>
          <button className="cd-avatar-btn" onClick={handleLogout} title="Sign out">
            <Image src="/agent-avatar.png" alt="Profile" width={36} height={36} className="cd-avatar-img" />
          </button>
        </div>
      </header>

      {/* ── Welcome banner ── */}
      <section className="cd-welcome">
        <div>
          <h1>Welcome back, <span className="cd-name-highlight">{firstName}</span></h1>
          <p>Here&apos;s what&apos;s happening with your property search today.</p>
        </div>
        <button className="cd-message-agent-btn">💬 Message Agent</button>
      </section>

      {/* ── Stats row ── */}
      <section className="cd-stats-row">
        <div className="cd-stat-card">
          <span className="cd-stat-icon cd-stat-icon-heart">♥</span>
          <div>
            <small>Saved Homes</small>
            <strong>12 Properties</strong>
          </div>
        </div>
        <div className="cd-stat-card">
          <span className="cd-stat-icon cd-stat-icon-cal">📅</span>
          <div>
            <small>Upcoming Tours</small>
            <strong>2 Scheduled</strong>
          </div>
        </div>
        <div className="cd-stat-card">
          <span className="cd-stat-icon cd-stat-icon-ai">✨</span>
          <div>
            <small>AI Matches</small>
            <strong>8 New Today</strong>
          </div>
        </div>
      </section>

      {/* ── AI Recommendations ── */}
      <section className="cd-section">
        <div className="cd-section-head">
          <h2>✨ AI Recommendations</h2>
          <a className="cd-view-all" href="#matches">View all matches</a>
        </div>
        <div className="cd-rec-grid">
          {AI_RECS.map((r) => (
            <article key={r.location} className="cd-rec-card">
              <div className="cd-rec-img-wrap">
                <Image src={r.img} alt={r.location} fill className="cd-rec-img" />
                <span className="cd-match-badge">{r.match}% Match</span>
                <button className="lp-listing-fav" aria-label="Favorite">♡</button>
              </div>
              <div className="cd-rec-info">
                <div className="cd-rec-price-row">
                  <strong>{r.price}</strong>
                  <span>🛏 {r.beds} 🚿 {r.baths}</span>
                </div>
                <p className="cd-rec-location">{r.location}</p>
                <div className="cd-rec-reason">
                  <span>{r.reason.toUpperCase()}</span>
                  <a className="cd-see-why" href="#why">See Why</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Tours + Agent ── */}
      <section className="cd-two-col">
        {/* Tours */}
        <div className="cd-tours-section">
          <div className="cd-section-head">
            <h2>Upcoming Tours</h2>
            <button className="cd-manage-btn">Manage Calendar</button>
          </div>
          <div className="cd-tours-list">
            {TOURS.map((t) => (
              <div key={t.name} className="cd-tour-row">
                <div className="cd-tour-thumb-wrap">
                  <Image src={t.img} alt={t.name} width={64} height={48} className="cd-tour-thumb" />
                </div>
                <div className="cd-tour-info">
                  <strong>{t.name}</strong>
                  <p>{t.address}</p>
                  <div className="cd-tour-tags">
                    <span className="cd-tour-type">{t.type}</span>
                    <span className="cd-tour-agent">Agent: {t.agent}</span>
                  </div>
                </div>
                <div className="cd-tour-date">
                  <span className={t.date === "Tomorrow" ? "cd-tomorrow" : ""}>{t.date}</span>
                  <small>{t.time}</small>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agent */}
        <div className="cd-agent-section">
          <h2>My Agent</h2>
          <div className="cd-agent-card">
            <Image src="/agent-avatar.png" alt="Agent" width={80} height={80} className="cd-agent-avatar" />
            <strong>Sarah Jenkins</strong>
            <span className="cd-agent-title">Senior Advisor</span>
            <button className="cd-agent-message-btn">💬 Quick Message</button>
            <button className="cd-agent-call-btn">📞 Schedule Call</button>
            <p className="cd-agent-note">&ldquo;Sarah has closed 4 homes in Bel Air this month.&rdquo;</p>
          </div>
        </div>
      </section>

      {/* ── Saved Homes ── */}
      <section className="cd-section">
        <div className="cd-section-head">
          <h2>My Saved Homes</h2>
          <div className="cd-nav-arrows">
            <button aria-label="Previous">←</button>
            <button aria-label="Next">→</button>
          </div>
        </div>
        <div className="cd-saved-grid">
          {SAVED.map((s) => (
            <article key={s.location} className="cd-saved-card">
              <div className="cd-saved-img-wrap">
                <Image src={s.img} alt={s.location} fill className="cd-saved-img" />
                <button className="cd-saved-heart" aria-label="Unsave">🧡</button>
              </div>
              <div className="cd-saved-info">
                <strong>{s.price}</strong>
                <p>{s.location}</p>
                <div className="cd-saved-meta">
                  <span>📐 {s.sqft} sqft</span>
                  <span>⏱ Saved {s.saved}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
