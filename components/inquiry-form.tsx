"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

const budgetOptions = ["Under $500k", "$500k - $1M", "Above $1M"];
const propertyOptions = ["Single Family", "Condo", "Townhouse", "Apartment"];
const timelineOptions = ["ASAP", "3-6 Months", "Just Browsing"];

export function InquiryForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [budget, setBudget] = useState("$500k - $1M");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("Single Family");
  const [timeline, setTimeline] = useState("ASAP");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const progress = Math.max(
    1,
    [
      fullName.trim(),
      email.trim(),
      budget,
      location.trim(),
      propertyType,
      timeline
    ].filter(Boolean).length
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!fullName.trim() || !email.trim() || !location.trim()) {
      setError("Full name, email, and preferred location are required.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const message = [
        `My name is ${fullName}.`,
        `My budget is ${budget}.`,
        `Preferred location is ${location}.`,
        `Property type is ${propertyType}.`,
        `My timeline is ${timeline}.`
      ].join(" ");

      const response = await fetch("/api/leads/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email,
          source: "website-inquiry",
          message
        })
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Could not submit inquiry");
      }

      setSuccess(
        payload.assistantReply ||
          "Your inquiry has been submitted. Continue in the client portal to track it."
      );
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Could not submit inquiry"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="inquiry-shell">
      <div className="inquiry-wrapper">
        <div className="inquiry-top">
          <Link className="back-link" href="/">
            Back
          </Link>
          <h1>RealtyOS Inquiry</h1>
          <div />
        </div>

        <div className="inquiry-progress-head">
          <div>
            <strong>Your Preferences</strong>
          </div>
          <span>
            {progress} of 6
          </span>
        </div>
        <div className="inquiry-progress">
          <div style={{ width: `${(progress / 6) * 100}%` }} />
        </div>

        <form className="inquiry-form" onSubmit={handleSubmit}>
          <section className="inquiry-copy">
            <h2>Let&apos;s find your perfect place</h2>
            <p>We&apos;ll use this to curate a custom list of homes for you.</p>
          </section>

          <label className="inquiry-label">
            <span>Full Name</span>
            <input
              placeholder="Sarah Johnson"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
            />
          </label>

          <label className="inquiry-label">
            <span>Email Address</span>
            <input
              placeholder="sarah@example.com"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <div className="inquiry-label">
            <span>What is your budget?</span>
            <div className="option-stack">
              {budgetOptions.map((option) => (
                <button
                  key={option}
                  className={`select-card ${budget === option ? "select-card-active" : ""}`}
                  onClick={() => setBudget(option)}
                  type="button"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <label className="inquiry-label">
            <span>Preferred Location</span>
            <input
              placeholder="e.g. Austin, TX"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            />
          </label>

          <div className="inquiry-label">
            <span>Property Type</span>
            <div className="property-grid">
              {propertyOptions.map((option) => (
                <button
                  key={option}
                  className={`property-card ${
                    propertyType === option ? "property-card-active" : ""
                  }`}
                  onClick={() => setPropertyType(option)}
                  type="button"
                >
                  <strong>{option}</strong>
                </button>
              ))}
            </div>
          </div>

          <div className="inquiry-label">
            <span>Desired Move-in Timeline</span>
            <div className="chip-row">
              {timelineOptions.map((option) => (
                <button
                  key={option}
                  className={`timeline-chip ${timeline === option ? "timeline-chip-active" : ""}`}
                  onClick={() => setTimeline(option)}
                  type="button"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <button className="inquiry-submit" disabled={submitting} type="submit">
            {submitting ? "Submitting..." : "Continue"}
          </button>

          {success ? <p className="form-success">{success}</p> : null}
          {error ? <p className="form-error">{error}</p> : null}
        </form>
      </div>
    </main>
  );
}
