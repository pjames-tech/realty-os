"use client";

import Link from "next/link";
import type { Route } from "next";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

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
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Login failed");
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
          <span className="section-kicker">Admin login</span>
          <h1>Access the RealtyOS operations dashboard.</h1>
          <p>
            This workspace is reserved for admin users managing lead flow,
            qualification, and booking.
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            autoComplete="email"
            placeholder="Admin email"
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
