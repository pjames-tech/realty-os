"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAdminData } from "@/lib/use-admin-data";
import {
  getInitials,
  getSourceColor,
  getSourceLabel,
  getStatusBadge,
  getAvatarColor,
  exportLeadsToCsv
} from "@/lib/admin-helpers";
import { LeadRecord } from "@/lib/types";

const PAGE_SIZE = 10;

export function AdminLeadsView() {
  const { leads, stats, loading, refresh } = useAdminData();

  const [activeTab, setActiveTab] = useState("Pipeline");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);

  // Tab filter
  const tabFiltered = useMemo(() => {
    switch (activeTab) {
      case "Overview": return leads;
      case "Pipeline": return leads.filter((l) => ["new", "qualifying", "qualified", "booked"].includes(l.status));
      case "Archive": return leads.filter((l) => l.status === "disqualified");
      default: return leads;
    }
  }, [leads, activeTab]);

  // Search + status + source filters
  const filtered = useMemo(() => {
    let result = tabFiltered;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (l) =>
          (l.name || "").toLowerCase().includes(q) ||
          (l.email || "").toLowerCase().includes(q) ||
          (l.phone || "").toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((l) => l.status === statusFilter);
    }

    if (sourceFilter !== "all") {
      result = result.filter((l) => l.source === sourceFilter);
    }

    return result;
  }, [tabFiltered, searchQuery, statusFilter, sourceFilter]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Unique sources for filter dropdown
  const uniqueSources = useMemo(() => {
    const s = new Set(leads.map((l) => l.source));
    return Array.from(s);
  }, [leads]);

  function handlePageChange(page: number) {
    setCurrentPage(Math.max(1, Math.min(totalPages, page)));
  }

  return (
    <div className="crm-leads-grid">
      {/* ── Top Header ── */}
      <header className="crm-leads-topbar">
        <div className="crm-leads-tabs">
          <nav>
            {["Overview", "Pipeline", "Archive"].map((tab) => (
              <button
                key={tab}
                className={`crm-tab-link ${activeTab === tab ? "active" : ""}`}
                onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
        <div className="crm-leads-actions">
          <div className="crm-search-bar small">
            <span className="crm-search-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <button className="crm-icon-btn" onClick={() => exportLeadsToCsv(filtered)} title="Export CSV">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          </button>
          <button className="crm-btn-primary" onClick={() => setShowAddModal(true)}>
            + Add New Lead
          </button>
        </div>
      </header>



      {/* ── Filters ── */}
      <div className="crm-filters-row">
        <div className="crm-filters-group">
          <select
            className="crm-filter-dropdown"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="qualifying">Qualifying</option>
            <option value="qualified">Qualified</option>
            <option value="booked">Booked</option>
            <option value="disqualified">Disqualified</option>
          </select>

          <select
            className="crm-filter-dropdown"
            value={sourceFilter}
            onChange={(e) => { setSourceFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="all">All Sources</option>
            {uniqueSources.map((src) => (
              <option key={src} value={src}>{getSourceLabel(src)}</option>
            ))}
          </select>
        </div>
        <span className="crm-showing-count">
          Showing {paginated.length} of {filtered.length} leads
        </span>
      </div>

      {/* ── Leads Table ── */}
      <div className="crm-table-container">
        <table className="crm-table">
          <thead>
            <tr>
              <th>NAME</th>
              <th>SOURCE</th>
              <th>STATUS</th>
              <th>AI CONFIDENCE</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {loading && paginated.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: "32px", color: "var(--text-muted)" }}>Loading leads...</td></tr>
            ) : paginated.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: "32px", color: "var(--text-muted)" }}>No leads found. Try adjusting your filters or add a new lead.</td></tr>
            ) : (
              paginated.map((lead, idx) => {
                const badge = getStatusBadge(lead.status);
                const srcColor = getSourceColor(lead.source);
                const avatarColor = getAvatarColor(idx);
                const expanded = expandedLeadId === lead.id;

                return (
                  <React.Fragment key={lead.id}>
                    <tr>
                      <td>
                        <div className="crm-table-cell-name">
                          <div className={`table-avatar bg-${avatarColor}-soft text-${avatarColor}`}>
                            {getInitials(lead.name)}
                          </div>
                          <div className="table-name-block">
                            <strong>{lead.name || "Unknown"}</strong>
                            <span>{lead.email || lead.phone || "No contact"}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="crm-table-cell-source">
                          <span className={`dot ${srcColor}`}></span>
                          {getSourceLabel(lead.source)}
                        </div>
                      </td>
                      <td>
                        <span className={`crm-status-badge badge-${badge.color}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td>
                        <div className="crm-confidence-bar">
                          <div className="conf-bar-bg">
                            <div className="conf-bar-fill" style={{ width: `${Math.round(lead.qualification.confidence)}%` }}></div>
                          </div>
                          <span>{Math.round(lead.qualification.confidence)}%</span>
                        </div>
                      </td>
                      <td>
                        <button className="crm-link-action" onClick={() => setExpandedLeadId(expanded ? null : lead.id)}>
                          {expanded ? "Hide" : "View Profile"}
                        </button>
                      </td>
                    </tr>
                    {expanded && (
                      <tr key={`${lead.id}-detail`}>
                        <td colSpan={5}>
                          <LeadDetailPanel lead={lead} onRefresh={refresh} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="crm-pagination">
          <button className={`page-btn ${currentPage <= 1 ? "disabled" : ""}`} onClick={() => handlePageChange(currentPage - 1)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
            Previous
          </button>
          <div className="page-numbers">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
              <button key={p} className={`page-num ${currentPage === p ? "active" : ""}`} onClick={() => handlePageChange(p)}>{p}</button>
            ))}
          </div>
          <button className={`page-btn ${currentPage >= totalPages ? "disabled" : ""}`} onClick={() => handlePageChange(currentPage + 1)}>
            Next
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>

      {/* ── Bottom Metrics ── */}
      <div className="crm-leads-bottom-metrics">
        <div className="crm-metric-card">
          <div className="crm-metric-head">
            <span className="tracker-header">CONVERSION RATE</span>
            <div className="mini-icon orange">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
            </div>
          </div>
          <div className="crm-metric-value-col">
            <strong className="huge-text">{stats.conversionRate}%</strong>
            <span className="trend-up small-font">Qualified ÷ Total</span>
          </div>
        </div>

        <div className="crm-metric-card">
          <div className="crm-metric-head">
            <span className="tracker-header">BOOKED</span>
            <div className="mini-icon orange">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
          </div>
          <div className="crm-metric-value-col">
            <strong className="huge-text">{stats.bookedLeads}</strong>
            <span className="trend-up small-font">Appointments scheduled</span>
          </div>
        </div>

        <div className="crm-metric-card">
          <div className="crm-metric-head">
            <span className="tracker-header">HIGH INTENT LEADS</span>
            <div className="mini-icon orange">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
            </div>
          </div>
          <div className="crm-metric-value-col">
            <strong className="huge-text">{stats.hotLeads}</strong>
            <span className="tracker-sub">Confidence ≥ 70%</span>
          </div>
        </div>
      </div>

      {/* ── Add Lead Modal ── */}
      {showAddModal && <AddLeadModal onClose={() => setShowAddModal(false)} onSuccess={() => { setShowAddModal(false); refresh(); }} />}
    </div>
  );
}

/* ── Lead Detail Panel ── */
function LeadDetailPanel({ lead, onRefresh }: { lead: LeadRecord, onRefresh?: () => void }) {
  const [chatInput, setChatInput] = useState("");
  const [sendingChat, setSendingChat] = useState(false);
  const [agents, setAgents] = useState<{id: string, name: string, email: string, role: string}[]>([]);
  const [showAssignSelect, setShowAssignSelect] = useState(false);

  useEffect(() => {
    if (showAssignSelect && agents.length === 0) {
      fetch("/api/agents")
        .then(res => res.json())
        .then(data => setAgents(data.agents || []))
        .catch(console.error);
    }
  }, [showAssignSelect, agents.length]);

  async function handleAssign(agentId: string) {
    if (!agentId) return;
    try {
      await fetch(`/api/leads/${lead.id}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId })
      });
      setShowAssignSelect(false);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Assignment failed", err);
    }
  }

  async function handleSendChatMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setSendingChat(true);
    try {
      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: lead.id, content: chatInput.trim(), sender: "agent" })
      });
      if (res.ok) {
        setChatInput("");
        if (onRefresh) onRefresh();
      }
    } finally {
      setSendingChat(false);
    }
  }

  return (
    <div className="crm-lead-detail-panel">
      <div className="detail-grid">
        <div className="detail-col">
          <h4>Contact & Assignment</h4>
          <p><strong>Name:</strong> {lead.name || "N/A"}</p>
          <p><strong>Email:</strong> {lead.email || "N/A"}</p>
          <p><strong>Phone:</strong> {lead.phone || "N/A"}</p>
          <p><strong>Source:</strong> {getSourceLabel(lead.source)}</p>
          <div style={{ marginTop: "12px", padding: "8px", background: "var(--bg-layer)", borderRadius: "6px" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Assigned Specialist</span>
            <p style={{ margin: "4px 0 0 0", fontWeight: 600 }}>{lead.agentName || "System Pool"}</p>
          </div>
        </div>
        <div className="detail-col">
          <h4>Qualification</h4>
          <p><strong>Budget:</strong> {lead.qualification.budget || "N/A"}</p>
          <p><strong>Timeline:</strong> {lead.qualification.timeline || "N/A"}</p>
          <p><strong>Location:</strong> {lead.qualification.location || "N/A"}</p>
          <p><strong>Property:</strong> {lead.qualification.propertyType || "N/A"}</p>
        </div>
        <div className="detail-col">
          <h4>Tags</h4>
          <div className="crm-tags-row">
            {lead.tags.length > 0 ? lead.tags.map((tag) => (
              <span key={tag} className="crm-tag-pill">{tag}</span>
            )) : <span style={{ color: "var(--text-muted)" }}>No tags</span>}
          </div>
          {lead.appointment && (
            <>
              <h4 style={{ marginTop: "12px" }}>Appointment</h4>
              <p><strong>Slot:</strong> {new Date(lead.appointment.slot).toLocaleString()}</p>
              <a href={lead.appointment.calendarLink} target="_blank" rel="noreferrer" className="crm-link-action">
                Open Calendar →
              </a>
            </>
          )}
        </div>
      </div>
      {lead.conversation.length > 0 && (
        <div className="detail-conversation">
          <h4>Conversation ({lead.conversation.length} messages)</h4>
          <div className="conv-messages">
            {lead.conversation.slice(-5).map((msg) => (
              <div key={msg.id} className={`conv-msg conv-${msg.role}`}>
                <strong>{msg.role === "user" ? "Lead" : "AI"}</strong>
                <p>{msg.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2-Way Chat with Client */}
      <div className="detail-conversation" style={{ marginTop: "24px" }}>
        <h4>Direct Messages with Client</h4>
        <div className="conv-messages" style={{ maxHeight: "250px", overflowY: "auto", border: "1px solid var(--border-color)", padding: "16px", borderRadius: "8px", background: "var(--bg-card)" }}>
          {(!lead.agentMessages || lead.agentMessages.length === 0) ? (
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>No messages sent yet. Start the conversation!</p>
          ) : (
            lead.agentMessages.map((msg) => (
              <div key={msg.id} className={`conv-msg conv-${msg.sender === "agent" ? "assistant" : "user"}`} style={{ 
                alignSelf: msg.sender === "agent" ? "flex-end" : "flex-start",
                background: msg.sender === "agent" ? "var(--primary-color)" : "var(--bg-layer)",
                color: msg.sender === "agent" ? "#FFF" : "var(--text-main)",
                maxWidth: "80%", borderRadius: "8px", padding: "10px", marginBottom: "8px"
              }}>
                <strong>{msg.sender === "agent" ? "You" : (lead.name || "Client")}</strong>
                <p>{msg.content}</p>
                <small style={{ fontSize: "0.7rem", opacity: 0.7, display: "block", marginTop: "4px" }}>{new Date(msg.timestamp).toLocaleTimeString()}</small>
              </div>
            ))
          )}
        </div>
        
        <form onSubmit={handleSendChatMessage} style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
          <input 
            type="text" 
            placeholder="Type a message to the client..." 
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            style={{ flex: 1, padding: "10px 14px", borderRadius: "6px", border: "1px solid var(--border-color)", fontSize: "0.95rem" }}
            disabled={sendingChat}
          />
          <button type="submit" disabled={sendingChat || !chatInput.trim()} style={{ background: "var(--brand-blue, #2563EB)", color: "#FFFFFF", padding: "10px 20px", borderRadius: "6px", fontWeight: "600", border: "none", cursor: "pointer", opacity: (!chatInput.trim() || sendingChat) ? 0.6 : 1 }}>
            {sendingChat ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
      
      {/* Action Buttons for Agent */}
      <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid var(--border-color)", display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <button onClick={() => alert("Initiating SMS/Email to " + (lead.name || "Lead"))} style={{ display: "flex", alignItems: "center", gap: "6px", background: "var(--primary-color)", color: "#FFFFFF", border: "none", padding: "10px 16px", borderRadius: "6px", fontWeight: "600", cursor: "pointer" }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          Message Lead
        </button>
        <button onClick={() => alert("Updating status for " + lead.id)} style={{ display: "flex", alignItems: "center", gap: "6px", background: "var(--bg-card)", color: "var(--text-main)", border: "1px solid var(--border-color)", padding: "10px 16px", borderRadius: "6px", fontWeight: "600", cursor: "pointer" }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          Change Status
        </button>
        {showAssignSelect ? (
          <select 
            onChange={(e) => handleAssign(e.target.value)} 
            defaultValue=""
            style={{ padding: "10px", borderRadius: "6px", border: "1px solid var(--border-color)", fontWeight: "600" }}
          >
            <option value="" disabled>Select agent to assign...</option>
            {agents.map(a => (
              <option key={a.id} value={a.id}>{a.name} ({a.role})</option>
            ))}
          </select>
        ) : (
          <button onClick={() => setShowAssignSelect(true)} style={{ display: "flex", alignItems: "center", gap: "6px", background: "var(--bg-card)", color: "var(--text-main)", border: "1px solid var(--border-color)", padding: "10px 16px", borderRadius: "6px", fontWeight: "600", cursor: "pointer" }}>
            Reassign Agent
          </button>
        )}
        <button onClick={() => { if(confirm("Disqualify this lead permanently?")) alert("Lead Disqualified."); }} style={{ display: "flex", alignItems: "center", gap: "6px", background: "#FEF2F2", color: "#B91C1C", border: "1px solid #FECACA", padding: "10px 16px", borderRadius: "6px", fontWeight: "600", cursor: "pointer", marginLeft: "auto" }}>
          Disqualify
        </button>
      </div>
    </div>
  );
}

/* ── Add Lead Modal ── */
function AddLeadModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [source, setSource] = useState("website-form");
  const [message, setMessage] = useState("New lead added manually");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/leads/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, source, message })
      });
      onSuccess();
    } catch {
      alert("Failed to add lead. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add New Lead</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="crm-settings-form">
          <div className="crm-form-group">
            <label>Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. John Doe" required />
          </div>
          <div className="crm-form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. john@example.com" />
          </div>
          <div className="crm-form-group">
            <label>Source</label>
            <select value={source} onChange={(e) => setSource(e.target.value)}>
              <option value="website-form">Website Form</option>
              <option value="chatbot">Chatbot</option>
              <option value="zillow">Zillow</option>
              <option value="facebook">Facebook</option>
              <option value="referral">Referral</option>
              <option value="direct">Direct</option>
            </select>
          </div>
          <div className="crm-form-group">
            <label>Initial Message / Notes</label>
            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Any initial note..." />
          </div>
          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            <button type="button" className="crm-btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="crm-btn-primary" disabled={submitting}>
              {submitting ? "Adding..." : "Add Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
