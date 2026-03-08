"use client";

import { FormEvent, useEffect, useState } from "react";

type Lead = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  source: string;
  status: string;
  tags: string[];
  qualification: {
    budget?: string;
    timeline?: string;
    location?: string;
    propertyType?: string;
    confidence: number;
    missingFields: string[];
  };
  conversation: Array<{
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: string;
  }>;
  appointment?: {
    id: string;
    slot: string;
    calendarLink: string;
    bookedAt: string;
  };
  updatedAt: string;
};

type Metrics = {
  processedMessages: number;
  averageResponseTimeMs: number;
  maxResponseTimeMs: number;
  underThreeSecondsRate: number;
};

const emptyMetrics: Metrics = {
  processedMessages: 0,
  averageResponseTimeMs: 0,
  maxResponseTimeMs: 0,
  underThreeSecondsRate: 0
};

export function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [metrics, setMetrics] = useState<Metrics>(emptyMetrics);
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    source: "manual-entry",
    message: ""
  });

  const selectedLead = leads.find((lead) => lead.id === selectedLeadId) || null;
  const appointments = leads
    .filter((lead) => Boolean(lead.appointment))
    .sort((left, right) =>
      new Date(left.appointment!.slot).getTime() - new Date(right.appointment!.slot).getTime()
    )
    .slice(0, 4);

  useEffect(() => {
    void refreshData();
  }, []);

  async function refreshData() {
    setLoading(true);
    setError("");

    try {
      const [leadsResponse, metricsResponse] = await Promise.all([
        fetch("/api/leads", { cache: "no-store" }),
        fetch("/api/metrics", { cache: "no-store" })
      ]);

      const leadsPayload = await leadsResponse.json();
      const metricsPayload = await metricsResponse.json();
      const nextLeads = Array.isArray(leadsPayload.leads) ? leadsPayload.leads : [];

      setLeads(nextLeads);
      setMetrics(metricsPayload || emptyMetrics);

      if (!selectedLeadId && nextLeads.length > 0) {
        setSelectedLeadId(nextLeads[0].id);
      } else if (
        selectedLeadId &&
        !nextLeads.some((lead: Lead) => lead.id === selectedLeadId)
      ) {
        setSelectedLeadId(nextLeads[0]?.id || "");
      }
    } catch {
      setError("Could not load admin data.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formData.message.trim()) {
      setError("Manual entry requires a lead note.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/leads/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Lead creation failed");
      }

      setFormData({
        name: "",
        email: "",
        phone: "",
        source: "manual-entry",
        message: ""
      });
      await refreshData();
      setSelectedLeadId(payload.lead.id);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Lead creation failed"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="dashboard-grid">
      <section className="dashboard-summary">
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-meta">
            <span>Avg. response time</span>
            <em>{metrics.averageResponseTimeMs} ms</em>
          </div>
          <strong>{secondsLabel(metrics.averageResponseTimeMs)}</strong>
        </div>
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-meta">
            <span>Conversion rate</span>
            <em>{metrics.underThreeSecondsRate}% under 3s</em>
          </div>
          <strong>{conversionLabel(leads)}</strong>
        </div>
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-meta">
            <span>Total bookings</span>
            <em>{appointments.length} upcoming</em>
          </div>
          <strong>{leads.filter((lead) => lead.status === "booked").length}</strong>
        </div>
      </section>

      <section className="admin-two-column">
        <div className="stack-column">
          <article className="admin-card feed-card">
            <div className="card-head">
              <div>
                <h2>Live ingest feed</h2>
                <p>Recent leads entering qualification.</p>
              </div>
              <button className="ghost-button" onClick={() => void refreshData()} type="button">
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            <div className="lead-feed">
              {leads.length === 0 ? (
                <p className="muted-copy">No leads yet.</p>
              ) : (
                leads.map((lead) => (
                  <button
                    key={lead.id}
                    className={`feed-row ${selectedLeadId === lead.id ? "feed-row-active" : ""}`}
                    onClick={() => setSelectedLeadId(lead.id)}
                    type="button"
                  >
                    <div className="feed-avatar">
                      {(lead.name || lead.email || "L").slice(0, 1).toUpperCase()}
                    </div>
                    <div className="feed-copy">
                      <strong>{lead.name || lead.email || lead.phone || "Unnamed lead"}</strong>
                      <p>{lead.source}</p>
                      <span>{timeAgo(lead.updatedAt)}</span>
                    </div>
                    <div className="feed-meta">
                      <span className={`status-pill status-${lead.status}`}>{lead.status}</span>
                      <small>{lead.qualification.missingFields.length} missing</small>
                    </div>
                  </button>
                ))
              )}
            </div>
          </article>

          <article className="admin-card" id="manual-entry">
            <div className="card-head">
              <div>
                <h2>Manual entry</h2>
                <p>Create a lead directly from the admin side.</p>
              </div>
            </div>

            <form className="admin-form" onSubmit={handleCreateLead}>
              <div className="form-row">
                <input
                  placeholder="Lead name"
                  value={formData.name}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, name: event.target.value }))
                  }
                />
                <input
                  placeholder="Email"
                  value={formData.email}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, email: event.target.value }))
                  }
                />
              </div>
              <div className="form-row">
                <input
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, phone: event.target.value }))
                  }
                />
                <input
                  placeholder="Source"
                  value={formData.source}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, source: event.target.value }))
                  }
                />
              </div>
              <textarea
                placeholder="Lead note"
                rows={5}
                value={formData.message}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, message: event.target.value }))
                }
              />
              <button className="header-button" disabled={submitting} type="submit">
                {submitting ? "Creating..." : "Create lead"}
              </button>
            </form>
          </article>
        </div>

        <div className="stack-column">
          <article className="admin-card detail-card">
            <div className="card-head">
              <div>
                <h2>Qualification details</h2>
                <p>Current AI understanding of the selected lead.</p>
              </div>
            </div>

            {!selectedLead ? (
              <p className="muted-copy">Select a lead from the feed.</p>
            ) : (
              <>
                <div className="detail-summary">
                  <div>
                    <strong>{selectedLead.name || selectedLead.email || selectedLead.phone || "Lead record"}</strong>
                    <p>{selectedLead.source}</p>
                  </div>
                  <span className={`status-pill status-${selectedLead.status}`}>
                    {selectedLead.status}
                  </span>
                </div>

                <div className="qualification-list">
                  <QualificationRow
                    color="blue"
                    label="Budget"
                    value={selectedLead.qualification.budget || "Unknown"}
                    progress={progressValue(selectedLead.qualification.budget)}
                  />
                  <QualificationRow
                    color="orange"
                    label="Timeline"
                    value={selectedLead.qualification.timeline || "Unknown"}
                    progress={progressValue(selectedLead.qualification.timeline)}
                  />
                  <QualificationRow
                    color="green"
                    label="Location"
                    value={selectedLead.qualification.location || "Unknown"}
                    progress={progressValue(selectedLead.qualification.location)}
                  />
                  <QualificationRow
                    color="blue"
                    label="Property Type"
                    value={selectedLead.qualification.propertyType || "Unknown"}
                    progress={progressValue(selectedLead.qualification.propertyType)}
                  />
                </div>

                <a
                  className="view-profile-link"
                  href={selectedLead.appointment?.calendarLink || "#"}
                  target={selectedLead.appointment ? "_blank" : undefined}
                  rel={selectedLead.appointment ? "noreferrer" : undefined}
                >
                  {selectedLead.appointment ? "Open Booking" : "Awaiting booking"}
                </a>
              </>
            )}
          </article>

          <article className="admin-card">
            <div className="card-head">
              <div>
                <h2>Upcoming appointments</h2>
                <p>Booked calls and viewings from qualified leads.</p>
              </div>
            </div>

            <div className="appointment-list">
              {appointments.length === 0 ? (
                <p className="muted-copy">No upcoming appointments.</p>
              ) : (
                appointments.map((lead) => (
                  <a
                    key={lead.id}
                    className="appointment-row"
                    href={lead.appointment?.calendarLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div className="appointment-date">
                      <span>{dateLabel(lead.appointment!.slot)}</span>
                      <strong>{dayLabel(lead.appointment!.slot)}</strong>
                    </div>
                    <div className="appointment-copy">
                      <strong>{lead.name || lead.email || "Qualified lead"}</strong>
                      <p>{timeLabel(lead.appointment!.slot)}</p>
                    </div>
                  </a>
                ))
              )}
            </div>
          </article>
        </div>
      </section>

      {error ? <p className="error-banner">{error}</p> : null}
    </div>
  );
}

function QualificationRow({
  label,
  value,
  progress,
  color
}: {
  label: string;
  value: string;
  progress: number;
  color: "blue" | "orange" | "green";
}) {
  return (
    <div className="qualification-row">
      <div className="qualification-head">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div className="progress-track">
        <div
          className={`progress-bar progress-${color}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function progressValue(value?: string): number {
  return value ? 88 : 24;
}

function secondsLabel(milliseconds: number): string {
  return `${(milliseconds / 1000).toFixed(1)}s`;
}

function conversionLabel(leads: Lead[]): string {
  if (leads.length === 0) {
    return "0%";
  }

  const converted = leads.filter((lead) =>
    ["qualified", "booked"].includes(lead.status)
  ).length;
  return `${Math.round((converted / leads.length) * 100)}%`;
}

function timeAgo(timestamp: string): string {
  const minutes = Math.max(
    1,
    Math.round((Date.now() - new Date(timestamp).getTime()) / 60000)
  );

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.round(minutes / 60);
  return `${hours} hr ago`;
}

function dateLabel(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, { month: "short" }).toUpperCase();
}

function dayLabel(timestamp: string): string {
  return new Date(timestamp).getDate().toString();
}

function timeLabel(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit"
  });
}
