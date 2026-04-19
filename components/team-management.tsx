"use client";

import React, { useState } from "react";

export function TeamManagement() {
  const [email, setEmail] = useState("");
  const [generating, setGenerating] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [error, setError] = useState("");

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;

    setGenerating(true);
    setError("");
    setInviteLink("");

    try {
      const res = await fetch("/api/agents/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to generate invite");
      
      setInviteLink(data.inviteLink);
      setEmail("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(window.location.origin + inviteLink);
    alert("Invitation link copied to clipboard!");
  }

  return (
    <div style={{ background: "var(--bg-card)", padding: "24px", borderRadius: "12px", border: "1px solid var(--border-color)", marginTop: "24px" }}>
      <h3 style={{ margin: "0 0 16px 0" }}>Team Management</h3>
      <p style={{ margin: "0 0 24px 0", color: "var(--text-muted)", fontSize: "0.95rem" }}>
        Expand your brokerage by inviting new agents. Generated links will automatically bind registering agents tightly to your organization.
      </p>

      <form onSubmit={handleInvite} style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)" }}>Agent Email</label>
          <input 
            type="email" 
            placeholder="agent@brokerage.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: "10px", borderRadius: "6px", border: "1px solid var(--border-color)" }}
            disabled={generating}
          />
        </div>
        <button 
          type="submit" 
          disabled={!email.trim() || generating}
          style={{ background: "var(--brand-blue, #2563EB)", color: "white", padding: "10px 20px", borderRadius: "6px", fontWeight: 600, border: "none", cursor: "pointer", opacity: (!email.trim() || generating) ? 0.5 : 1 }}
        >
          {generating ? "Generating..." : "Create Invite"}
        </button>
      </form>

      {error && <p style={{ color: "#DC2626", fontSize: "0.9rem", marginTop: "12px" }}>{error}</p>}

      {inviteLink && (
        <div style={{ marginTop: "24px", background: "#F0FDF4", border: "1px solid #BBF7D0", padding: "16px", borderRadius: "8px" }}>
          <h4 style={{ margin: "0 0 8px 0", color: "#166534" }}>Invitation Generated Successfully</h4>
          <p style={{ margin: "0 0 12px 0", fontSize: "0.85rem", color: "#15803D" }}>Share this unique link with your new agent to complete their onboarding.</p>
          <div style={{ display: "flex", gap: "8px" }}>
            <input 
              readOnly 
              value={window.location.origin + inviteLink} 
              style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "1px solid #86EFAC", background: "white", color: "#166534", fontSize: "0.85rem" }}
            />
            <button onClick={copyToClipboard} style={{ background: "#22C55E", color: "white", border: "none", padding: "8px 16px", borderRadius: "4px", fontWeight: 600, cursor: "pointer" }}>
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
