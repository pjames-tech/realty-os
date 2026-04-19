"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function ClientLogin() {
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
      const response = await fetch("/api/client/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Client login failed");
      }

      router.push("/portal");
      router.refresh();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Client login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="login-shell">
      <section className="login-panel">
        <div className="login-copy">
          <span className="section-kicker">Client access</span>
          <h1>Check your lead status and booking link.</h1>
          <p>
            Sign in with the email address and password you used when you submitted
            your property request.
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            autoComplete="email"
            placeholder="Email address"
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
            {submitting ? "Opening..." : "Open client portal"}
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
