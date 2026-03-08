"use client";

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
    missingFields: string[];
  };
  appointment?: {
    calendarLink: string;
    slot: string;
  };
};

export function ClientPortal() {
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetch("/api/client/me", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload) => setLead(payload.lead || null))
      .finally(() => setLoading(false));
  }, []);

  async function handleLogout() {
    await fetch("/api/client/logout", { method: "POST" });
    router.push("/portal/login");
    router.refresh();
  }

  return (
    <main className="marketing-shell">
      <section className="marketing-form-section">
        <div className="marketing-form-copy">
          <span className="section-kicker">Client portal</span>
          <h2>Your qualification progress</h2>
          <p>
            Review the current status of your request and proceed to booking when
            your lead is ready.
          </p>
          <button className="ghost-button" onClick={handleLogout} type="button">
            Sign out
          </button>
        </div>

        <div className="settings-card">
          {loading ? (
            <p className="muted-copy">Loading your status...</p>
          ) : !lead ? (
            <p className="muted-copy">No client record found.</p>
          ) : (
            <div className="qualification-list">
              <div className="detail-summary">
                <div>
                  <strong>{lead.name || lead.email || lead.phone || "Client record"}</strong>
                  <p>Status overview</p>
                </div>
                <span className={`status-pill status-${lead.status}`}>{lead.status}</span>
              </div>
              <div className="qualification-row">
                <div className="qualification-head">
                  <span>Budget</span>
                  <strong>{lead.qualification.budget || "Pending"}</strong>
                </div>
              </div>
              <div className="qualification-row">
                <div className="qualification-head">
                  <span>Timeline</span>
                  <strong>{lead.qualification.timeline || "Pending"}</strong>
                </div>
              </div>
              <div className="qualification-row">
                <div className="qualification-head">
                  <span>Location</span>
                  <strong>{lead.qualification.location || "Pending"}</strong>
                </div>
              </div>
              <div className="qualification-row">
                <div className="qualification-head">
                  <span>Property type</span>
                  <strong>{lead.qualification.propertyType || "Pending"}</strong>
                </div>
              </div>
              {lead.appointment ? (
                <a
                  className="view-profile-link"
                  href={lead.appointment.calendarLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open booking
                </a>
              ) : (
                <p className="muted-copy">Booking link will appear when qualification is complete.</p>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
