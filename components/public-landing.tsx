"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function PublicLanding() {
  return (
    <main className="landing-shell">
      <header className="landing-header">
        <Link className="landing-logo" href="/">
          <span className="landing-logo-mark">
            <span />
            <span />
            <span />
          </span>
          <span className="landing-logo-text">
            <strong>RealtyOS</strong>
            <small>Home Search Concierge</small>
          </span>
        </Link>

        <nav className="landing-nav">
          <a href="#how-it-works">
            <span className="nav-icon nav-icon-home" />
            How it works
          </a>
          <a href="#smart-tools">
            <span className="nav-icon nav-icon-chat" />
            Smart tools
          </a>
          <Link href="/portal/login">
            <span className="nav-icon nav-icon-user" />
            Client Access
          </Link>
        </nav>

        <ThemeToggle />
      </header>

      <section className="landing-hero">
        <div className="landing-copy">
          <span className="marketing-kicker">
            Personalized property guidance
          </span>
          <h1>Find a home that fits your area, budget, and timeline.</h1>
          <p>
            Whether you&apos;re buying, renting, or just exploring options, we
            help you start with the right information so your search feels
            focused from day one.
          </p>

          <div className="landing-actions">
            <Link className="marketing-primary" href="/inquiry">
              Get Started
            </Link>
            <Link className="marketing-secondary" href="/portal/login">
              Continue Inquiry
            </Link>
          </div>

          <div className="landing-pill-row">
            <span>Preferred Location</span>
            <span>Budget Fit</span>
            <span>Property Match</span>
          </div>
        </div>

        <div className="landing-showcase">
          <div className="landing-highlight-card">
            <span className="highlight-icon highlight-icon-blue" />
            <span>Smart guidance</span>
            <strong>
              Tell us what you want and we help shape the next step.
            </strong>
          </div>
          <div className="landing-highlight-card">
            <span className="highlight-icon highlight-icon-orange" />
            <span>Area-first search</span>
            <strong>
              Start from the vicinity you actually want to live in.
            </strong>
          </div>
          <div className="landing-highlight-card">
            <span className="highlight-icon highlight-icon-green" />
            <span>Ready when you are</span>
            <strong>
              When your request is complete, booking becomes straightforward.
            </strong>
          </div>
        </div>
      </section>

      <section className="landing-feature-grid" id="how-it-works">
        <article className="landing-feature-card">
          <span className="section-kicker">Step 1</span>
          <h2>Tell us what kind of home you want.</h2>
          <p>
            Share the basics: your preferred location, property type, budget
            range, and how soon you want to move.
          </p>
        </article>
        <article className="landing-feature-card">
          <span className="section-kicker">Step 2</span>
          <h2>Refine your search with a smart assistant.</h2>
          <p>
            The assistant helps you think through your preferences so your
            request is clearer before the next step.
          </p>
        </article>
        <article className="landing-feature-card">
          <span className="section-kicker">Step 3</span>
          <h2>Move toward the right property faster.</h2>
          <p>
            Once your inquiry is complete, you can continue through your client
            portal and book when there is a good fit.
          </p>
        </article>
      </section>

      <section className="landing-feature-grid" id="smart-tools">
        <article className="landing-feature-card">
          <span className="section-kicker">Sloane</span>
          <h2>Need help right now?</h2>
          <p>
            Use the floating assistant button on the left to ask questions,
            understand your options, and jump directly to the right page.
          </p>
        </article>
        <article className="landing-feature-card">
          <span className="section-kicker">Navigation help</span>
          <h2>Sloane can guide your clicks.</h2>
          <p>
            Ask where to go for inquiry, portal tracking, or booking and Sloane
            will give direct navigation actions.
          </p>
        </article>
        <article className="landing-feature-card">
          <span className="section-kicker">Fast answers</span>
          <h2>Get clear explanations before you submit.</h2>
          <p>
            Sloane explains what each step means so your inquiry details are
            complete and useful.
          </p>
        </article>
      </section>

      <footer className="landing-footer">
        <div className="landing-footer-brand">
          <strong>RealtyOS</strong>
          <span>
            &copy; {new Date().getFullYear()} &middot; Home Search Concierge
          </span>
        </div>
        <div className="landing-footer-links">
          <Link href="/inquiry">Get Started</Link>
          <Link href="/portal/login">Client Portal</Link>
          <a href="#how-it-works">How it works</a>
        </div>
      </footer>
    </main>
  );
}
