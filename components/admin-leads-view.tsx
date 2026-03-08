"use client";

import { useEffect, useState } from "react";

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
};

export function AdminLeadsView() {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    void fetch("/api/leads", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload) => setLeads(Array.isArray(payload.leads) ? payload.leads : []));
  }, []);

  return (
    <section className="admin-card table-card">
      <div className="card-head">
        <div>
          <h2>Lead directory</h2>
          <p>Full list of leads currently tracked in the system.</p>
        </div>
      </div>

      <div className="simple-table">
        <div className="simple-table-head">
          <span>Lead</span>
          <span>Status</span>
          <span>Confidence</span>
          <span>Summary</span>
        </div>
        {leads.map((lead) => (
          <div className="simple-table-row" key={lead.id}>
            <span>{lead.name || lead.email || lead.phone || "Unnamed lead"}</span>
            <span className={`status-pill status-${lead.status}`}>{lead.status}</span>
            <span>{Math.round(lead.qualification.confidence * 100)}%</span>
            <span>
              {lead.qualification.location || "Unknown"} /{" "}
              {lead.qualification.propertyType || "Unknown"}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
