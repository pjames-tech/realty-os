"use client";

import Link from "next/link";
import type { Route } from "next";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AdminLogin({ nextUrl = "/admin" }: { nextUrl?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      // Sign in via Supabase Auth (sets auth cookies automatically)
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw new Error(authError.message || "Invalid credentials");
      }

      // Fetch agent details from our API
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data: Record<string, unknown> = {};
      try {
        data = await response.json();
      } catch {
        // Server returned empty or non-JSON body
      }
      if (response.ok && data.name) {
        localStorage.setItem("realtyos-admin-name", data.name as string);
        localStorage.setItem("realtyos-admin-role", data.role as string);
      }

      router.push(nextUrl as Route);
      router.refresh();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="login-shell">
      <section className="login-panel">
        <div className="login-copy">
          <span className="section-kicker">Workspace Login</span>
          <h1>Access your RealtyOS dashboard.</h1>
          <p>
            Sign in to manage your real estate pipeline, respond to clients, and oversee your lead flow.
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            autoComplete="email"
            placeholder="Agent or admin email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            autoComplete="current-password"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button className="header-button" disabled={submitting} type="submit">
            {submitting ? "Signing in..." : "Sign in"}
          </button>
          {error ? <p className="form-error">{error}</p> : null}
        </form>

        <Link className="back-link" href="/">
          Back to website
        </Link>
      </section>
    </main>
  );
}
