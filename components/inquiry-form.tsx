"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const TOTAL_STEPS = 6;
const budgetOptions = ["Under $500k", "$500k - $1M", "$1M - $3M", "Above $3M"];
const propertyOptions = [
  { label: "Single Family", icon: "🏡" },
  { label: "Condo", icon: "🏢" },
  { label: "Townhouse", icon: "🏘️" },
  { label: "Apartment", icon: "🏙️" },
];
const timelineOptions = ["ASAP", "1-3 Months", "3-6 Months", "Just Browsing"];

export function InquiryForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [timeline, setTimeline] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function canAdvance(): boolean {
    switch (step) {
      case 1: return true; // welcome
      case 2: return fullName.trim().length > 0 && email.trim().length > 0;
      case 3: return budget.length > 0;
      case 4: return location.trim().length > 0;
      case 5: return propertyType.length > 0;
      case 6: return timeline.length > 0;
      default: return false;
    }
  }

  async function handleNext() {
    setError("");
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
      return;
    }

    // Final step → submit
    setSubmitting(true);
    try {
      const res = await fetch("/api/client/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email,
          budget,
          location,
          propertyType,
          timeline,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sign up failed");

      // Auto-logged in by the API → go to dashboard
      router.push("/portal");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  function handleBack() {
    if (step > 1) setStep(step - 1);
  }

  return (
    <main className="inquiry-shell">
      <div className="inquiry-wrapper">
        {/* Top bar */}
        <div className="inquiry-top">
          {step > 1 ? (
            <button className="back-link" onClick={handleBack} type="button">
              ← Back
            </button>
          ) : (
            <Link className="back-link" href="/">
              ← Home
            </Link>
          )}
          <h1>RealtyOS</h1>
          <div />
        </div>

        {/* Progress */}
        <div className="inquiry-progress-head">
          <strong>Step {step} of {TOTAL_STEPS}</strong>
          <span>{Math.round((step / TOTAL_STEPS) * 100)}%</span>
        </div>
        <div className="inquiry-progress">
          <div style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
        </div>

        {/* Steps */}
        <div className="inquiry-form">
          {step === 1 && (
            <section className="inquiry-copy">
              <span className="marketing-kicker">Get Started</span>
              <h2>Let&apos;s find your dream home</h2>
              <p>
                Answer a few quick questions and our AI will curate a
                personalized list of properties just for you. It only takes
                2 minutes.
              </p>
            </section>
          )}

          {step === 2 && (
            <>
              <section className="inquiry-copy">
                <h2>Tell us about yourself</h2>
                <p>We&apos;ll use this to set up your account.</p>
              </section>
              <label className="inquiry-label">
                <span>Full Name</span>
                <input
                  placeholder="e.g. Alex Thompson"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoFocus
                />
              </label>
              <label className="inquiry-label">
                <span>Email Address</span>
                <input
                  type="email"
                  placeholder="alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
            </>
          )}

          {step === 3 && (
            <>
              <section className="inquiry-copy">
                <h2>What&apos;s your budget?</h2>
                <p>This helps us filter properties in your range.</p>
              </section>
              <div className="option-stack">
                {budgetOptions.map((opt) => (
                  <button
                    key={opt}
                    className={`select-card ${budget === opt ? "select-card-active" : ""}`}
                    onClick={() => setBudget(opt)}
                    type="button"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <section className="inquiry-copy">
                <h2>Where are you looking?</h2>
                <p>Enter your preferred city, neighborhood, or zip code.</p>
              </section>
              <label className="inquiry-label">
                <span>Preferred Location</span>
                <input
                  placeholder="e.g. Austin, TX or 90210"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  autoFocus
                />
              </label>
            </>
          )}

          {step === 5 && (
            <>
              <section className="inquiry-copy">
                <h2>What type of property?</h2>
                <p>Pick the property type that fits your lifestyle.</p>
              </section>
              <div className="property-grid">
                {propertyOptions.map((opt) => (
                  <button
                    key={opt.label}
                    className={`property-card ${propertyType === opt.label ? "property-card-active" : ""}`}
                    onClick={() => setPropertyType(opt.label)}
                    type="button"
                  >
                    <span style={{ fontSize: "1.8rem" }}>{opt.icon}</span>
                    <strong>{opt.label}</strong>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 6 && (
            <>
              <section className="inquiry-copy">
                <h2>When do you want to move?</h2>
                <p>This helps us prioritize the best matches for you.</p>
              </section>
              <div className="option-stack">
                {timelineOptions.map((opt) => (
                  <button
                    key={opt}
                    className={`select-card ${timeline === opt ? "select-card-active" : ""}`}
                    onClick={() => setTimeline(opt)}
                    type="button"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Action */}
          <button
            className="inquiry-submit"
            disabled={!canAdvance() || submitting}
            onClick={handleNext}
            type="button"
          >
            {submitting
              ? "Setting up your account..."
              : step === TOTAL_STEPS
              ? "Create My Account →"
              : "Continue →"}
          </button>

          {error && <p className="form-error">{error}</p>}

          {step === 1 && (
            <p className="inquiry-login-link">
              Already have an account?{" "}
              <Link href="/portal/login">Log in</Link>
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
