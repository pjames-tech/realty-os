"use client";

import { useEffect, useState } from "react";

type Lead = {
  id: string;
  name?: string;
  email?: string;
  appointment?: {
    slot: string;
    calendarLink: string;
  };
};

export function AdminScheduleView() {
  const [appointments, setAppointments] = useState<Lead[]>([]);

  useEffect(() => {
    void fetch("/api/leads", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload) => {
        const leads = Array.isArray(payload.leads) ? payload.leads : [];
        setAppointments(
          leads
            .filter((lead: Lead) => Boolean(lead.appointment))
            .sort(
              (left: Lead, right: Lead) =>
                new Date(left.appointment!.slot).getTime() -
                new Date(right.appointment!.slot).getTime()
            )
        );
      });
  }, []);

  return (
    <section className="admin-card table-card">
      <div className="card-head">
        <div>
          <h2>Schedule</h2>
          <p>Upcoming booked appointments from the qualification pipeline.</p>
        </div>
      </div>

      <div className="appointment-list">
        {appointments.length === 0 ? (
          <p className="muted-copy">No scheduled appointments yet.</p>
        ) : (
          appointments.map((lead) => (
            <a
              className="appointment-row"
              href={lead.appointment?.calendarLink}
              key={lead.id}
              target="_blank"
              rel="noreferrer"
            >
              <div className="appointment-date">
                <span>
                  {new Date(lead.appointment!.slot)
                    .toLocaleDateString(undefined, { month: "short" })
                    .toUpperCase()}
                </span>
                <strong>{new Date(lead.appointment!.slot).getDate()}</strong>
              </div>
              <div className="appointment-copy">
                <strong>{lead.name || lead.email || "Qualified lead"}</strong>
                <p>
                  {new Date(lead.appointment!.slot).toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
              </div>
            </a>
          ))
        )}
      </div>
    </section>
  );
}
