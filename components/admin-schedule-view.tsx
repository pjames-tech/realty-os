"use client";

import { useState, useMemo } from "react";
import { useAdminData } from "@/lib/use-admin-data";
import { getInitials, getAvatarColor } from "@/lib/admin-helpers";
import { LeadRecord } from "@/lib/types";

// Removed FALLBACK_EVENTS, using conditional JSX instead

function groupAppointmentsByDate(leads: LeadRecord[]) {
  const groups: Record<string, { timestamp: number, events: any[] }> = {};

  for (const lead of leads) {
    if (!lead.appointment) continue;
    const d = new Date(lead.appointment.slot);
    
    // Normalize to start of that local day for strict group chronological sorting
    const dayTimestamp = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    
    const dateKey = d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric"
    }).toUpperCase();

    if (!groups[dateKey]) {
      groups[dateKey] = { timestamp: dayTimestamp, events: [] };
    }

    const endTime = new Date(d.getTime() + 60 * 60 * 1000); // assume 1hr
    const timeStr = `${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} - ${endTime.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;

    groups[dateKey].events.push({
      id: lead.id,
      time: timeStr,
      title: "Scheduled Consultation",
      location: lead.qualification.location || "To be confirmed",
      person: lead.name || lead.email || "Unknown",
      color: lead.status === "booked" ? "blue" : "purple",
      avatar: getInitials(lead.name),
      avatarBg: getAvatarColor(groups[dateKey].events.length),
      sortTime: d.getTime()
    });
  }

  // Sort groups chronologically, and sort events within each group chronologically
  return Object.entries(groups)
    .sort((a, b) => a[1].timestamp - b[1].timestamp)
    .map(([dateLabel, group], idx) => {
      const sortedEvents = group.events.sort((a, b) => a.sortTime - b.sortTime);
      return {
        id: `grp-${idx}`,
        dateLabel,
        timestamp: group.timestamp,
        events: sortedEvents
      };
    });
}

export function AdminScheduleView() {
  const { stats } = useAdminData();
  const [activeTab, setActiveTab] = useState("All");
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const appointmentsGrouped = useMemo(
    () => groupAppointmentsByDate(stats.leadsWithAppointments),
    [stats.leadsWithAppointments]
  );

  const displayEvents = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    let filtered = appointmentsGrouped;

    if (selectedDate !== null) {
      // Show exact day requested
      const targetStart = new Date(now.getFullYear(), now.getMonth(), selectedDate).getTime();
      filtered = appointmentsGrouped.filter((g) => g.timestamp === targetStart);
    } else {
      // "Upcoming Schedule" default: omit past completely
      filtered = appointmentsGrouped.filter((g) => g.timestamp >= startOfToday);
    }

    return filtered; // If empty, we handle it in render
  }, [appointmentsGrouped, selectedDate]);

  // Apply tab and search filtering dynamically
  const filteredEvents = useMemo(() => {
    return displayEvents.map(group => {
      let evts = group.events;

      // Tab filtering mapped to event color metadata
      if (activeTab === "Viewings") evts = evts.filter(e => e.color === "blue" || e.color === "orange");
      if (activeTab === "Virtual") evts = evts.filter(e => e.color === "purple");
      if (activeTab === "Meetings") evts = evts.filter(e => e.title.includes("Meeting") || e.title.includes("Consultation") || e.color === "blue");

      // Search Query Filtering
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        evts = evts.filter(e => 
          e.title.toLowerCase().includes(query) || 
          e.person.toLowerCase().includes(query) || 
          e.location.toLowerCase().includes(query)
        );
      }

      return { ...group, events: evts };
    }).filter(group => group.events.length > 0);
  }, [displayEvents, activeTab, searchQuery]);

  // Compute calendar dots from real appointment dates
  const appointmentDays = useMemo(() => {
    const days = new Map<number, string>();
    for (const lead of stats.leadsWithAppointments) {
      if (lead.appointment) {
        const d = new Date(lead.appointment.slot);
        const now = new Date();
        if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
          days.set(d.getDate(), lead.status === "booked" ? "blue" : "purple");
        }
      }
    }
    return days;
  }, [stats.leadsWithAppointments]);

  const today = new Date();
  const currentMonth = today.toLocaleString("en-US", { month: "long", year: "numeric" });
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDayOfWeek = new Date(today.getFullYear(), today.getMonth(), 1).getDay();

  return (
    <div className="crm-schedule-grid">
      <header className="crm-schedule-topbar">
        <div className="crm-schedule-actions" style={{ marginLeft: "auto", flexWrap: "wrap" }}>
          <div className="crm-search-bar small">
            <span className="crm-search-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
            <input type="text" placeholder="Search events..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <button className="crm-icon-btn" onClick={() => setActiveTab("All")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
          </button>
          <button className="crm-btn-primary" onClick={() => alert("Event scheduling wizard has not been mapped yet. Use Lead Dashboard to schedule new clients.")}>+ New Event</button>
        </div>
      </header>

      <section className="crm-schedule-content">
        {/* Calendar */}
        <div className="crm-calendar-card">
          <div className="crm-calendar-header">
            <h3>{currentMonth}</h3>
            <div className="crm-cal-nav">
              <button>‹</button>
              <button>›</button>
            </div>
          </div>

          <div className="crm-calendar-grid">
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
              <div key={d} className="crm-cal-day-name">{d}</div>
            ))}

            {/* Padding for first day */}
            {Array.from({ length: firstDayOfWeek }, (_, i) => (
              <div key={`pad-${i}`} className="crm-cal-day empty"></div>
            ))}

            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const isToday = day === today.getDate();
              const isSelected = day === selectedDate;
              const dotColor = appointmentDays.get(day);

              return (
                <div 
                  key={day} 
                  className={`crm-cal-day ${isSelected ? "selected-day" : isToday && !selectedDate ? "active" : ""}`}
                  style={{ cursor: "pointer", border: isSelected ? "2px solid var(--primary-color)" : "none" }}
                  onClick={() => setSelectedDate(day === selectedDate ? null : day)}
                >
                  <span className="day-number">{day}</span>
                  {dotColor && <span className={`cal-dot ${dotColor}`}></span>}
                </div>
              );
            })}
          </div>

          <div className="crm-calendar-legend">
            <div className="legend-item"><span className="dot blue"></span> Booked</div>
            <div className="legend-item"><span className="dot purple"></span> Virtual</div>
            <div className="legend-item"><span className="dot orange"></span> Open House</div>
          </div>
        </div>

        {/* Upcoming Schedule */}
        <div className="crm-upcoming-card">
          <div className="crm-upcoming-head">
            <h3>{selectedDate ? `Schedule for ${currentMonth.split(" ")[0]} ${selectedDate}` : "Upcoming Schedule"}</h3>
            <nav className="crm-upcoming-tabs">
              {["All", "Viewings", "Virtual", "Meetings"].map((tab) => (
                <button
                  key={tab}
                  className={activeTab === tab ? "active" : ""}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="crm-schedule-list">
            {filteredEvents.length === 0 ? (
              <div className="crm-empty-state" style={{ padding: "60px 20px", textAlign: "center", color: "var(--text-muted)" }}>
                <div style={{ width: "48px", height: "48px", background: "var(--surface-hover)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "var(--border)" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                </div>
                <h4 style={{ margin: "0 0 8px", color: "var(--text)", fontSize: "1rem" }}>No Schedule Found</h4>
                <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: "1.5" }}>{selectedDate ? `There are no events on ${currentMonth.split(" ")[0]} ${selectedDate}.` : "There are no upcoming appointments. Leads will appear here once they book."}</p>
              </div>
            ) : (
              filteredEvents.map((dayBlock) => (
                <div key={dayBlock.id} className="crm-schedule-day-block">
                  <h4 className="crm-schedule-date-label">{dayBlock.dateLabel}</h4>
                  <div className="crm-schedule-events">
                    {dayBlock.events.map((evt) => (
                      <div key={evt.id} className={`crm-schedule-event stripe-${evt.color}`}>
                        <div className="evt-time">{evt.time}</div>
                        <div className="evt-content">
                          <strong>{evt.title}</strong>
                          <span>{evt.location}</span>
                        </div>
                        <div className="evt-person">
                          <div className={`evt-avatar bg-${evt.avatarBg}-soft text-${evt.avatarBg}`}>
                            {evt.avatar}
                          </div>
                          <span>{evt.person}</span>
                        </div>
                        <button className="evt-action-btn" onClick={() => alert("Actions menu not wired.")}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
