"use client";

import { useState, SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { createClient } from "@/lib/supabase/client";

export default function SuperAdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    if (!email || !password) return;

    setError("");
    setLoading(true);

    try {
      // Sign in via Supabase Auth (sets auth cookies)
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw new Error(authError.message || "Invalid credentials");
      }

      // Verify super-admin role via API
      const res = await fetch("/api/super-admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (!res.ok) {
        // Not a super admin — sign out of Supabase
        await supabase.auth.signOut();
        throw new Error(data.error || "Login failed");
      }

      router.push("/super-admin" as Route);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="marketing-shell" style={{ alignItems: "center", justifyContent: "center", minHeight: "100vh", display: "flex" }}>
      <div className="login-panel" style={{ width: "100%", maxWidth: "420px", padding: "40px 32px" }}>
        <h1 style={{ fontSize: "1.5rem", marginBottom: "8px", textAlign: "center" }}>Super-Admin Access</h1>
        <p style={{ color: "var(--text-soft)", textAlign: "center", marginBottom: "32px", fontSize: "0.9rem" }}>
          System-level access. Restricted.
        </p>

        {error && <div className="form-error" style={{ marginBottom: "20px" }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "8px" }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div>
             <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "8px" }}>Password</label>
             <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="marketing-primary" style={{ marginTop: "12px", background: "indigo", boxShadow: "0 4px 14px rgba(75, 0, 130, 0.2)" }}>
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}
