"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "SOLO_AGENT",
    organizationName: ""
  });
  const [isInviteMode, setIsInviteMode] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      fetch(`/api/agents/invite/validate?token=${token}`)
        .then(res => res.json())
        .then(data => {
          if (data.invite) {
            setFormData(prev => ({
              ...prev,
              email: data.invite.email,
              role: "ORG_AGENT",
              organizationName: data.invite.organizationName
            }));
            setIsInviteMode(true);
          } else if (data.error) {
            setInviteError(data.error);
          }
        })
        .catch(() => setInviteError("Failed to validate invitation link."));
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }
      
      // Redirect to login or auto-login
      router.push("/admin/login?registered=true");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-shell">
      <section className="login-panel">
        <div className="login-copy">
          <span className="section-kicker">Create Account</span>
          <h1>Get started with RealtyOS.</h1>
          <p>Create your account to start managing leads, qualifying prospects, and closing deals faster.</p>
        </div>

        {error && <p className="form-error">{error}</p>}
        {inviteError && <p className="form-error" style={{ color: "#C2410C" }}>{inviteError}</p>}
        {isInviteMode && <p style={{ color: "#15803D", fontSize: "0.9rem" }}>Invitation accepted — registering under <strong>{formData.organizationName}</strong>.</p>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="reg-field">
            <label className="reg-label">Full Name</label>
            <input 
              type="text" 
              required 
              placeholder="e.g. Jane Smith"
              autoComplete="name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="reg-field">
            <label className="reg-label">Email Address</label>
            <input 
              type="email" 
              required 
              placeholder="e.g. jane@realty.com"
              autoComplete="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="reg-field">
            <label className="reg-label">Password</label>
            <input 
              type="password" 
              required 
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {!isInviteMode && (
            <div className="reg-field">
              <label className="reg-label">How do you operate?</label>
              <select 
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="SOLO_AGENT">Solo Agent — I work independently</option>
                <option value="ORG_ADMIN">Brokerage Admin — I manage a team</option>
                <option value="ORG_AGENT">Team Agent — I'm part of a brokerage</option>
              </select>
            </div>
          )}

          {(formData.role === "ORG_ADMIN" || formData.role === "ORG_AGENT") && (
            <div className="reg-field">
              <label className="reg-label">Organization Name</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. Vanguard Realty Group"
                value={formData.organizationName}
                onChange={e => setFormData({ ...formData, organizationName: e.target.value })}
                disabled={isInviteMode}
                style={isInviteMode ? { opacity: 0.7, cursor: "not-allowed" } : {}}
              />
            </div>
          )}

          <button className="header-button" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <Link className="back-link" href="/admin/login">
          Already have an account? Sign in
        </Link>
        <Link className="back-link" href="/">
          Back to website
        </Link>
      </section>
    </main>
  );
}
