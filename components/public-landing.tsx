"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";

const LISTINGS = [
  {
    img: "/property-1.png",
    badge: "For Sale",
    price: "$1,250,000",
    name: "Sunset Valley Estate",
    location: "Austin, TX 78701",
    beds: 4,
    baths: 3,
    sqft: "3,200",
  },
  {
    img: "/property-2.png",
    badge: "New Listing",
    price: "$875,000",
    name: "Oak Ridge Manor",
    location: "Denver, CO 80203",
    beds: 3,
    baths: 2,
    sqft: "2,800",
  },
  {
    img: "/property-3.png",
    badge: "For Rent",
    price: "$5,400/mo",
    name: "Skyline Loft",
    location: "Seattle, WA 98107",
    beds: 2,
    baths: 2,
    sqft: "1,500",
  },
  {
    img: "/property-4.png",
    badge: "For Sale",
    price: "$2,900,000",
    name: "The Heights Villa",
    location: "Scottsdale, AZ 85251",
    beds: 5,
    baths: 4,
    sqft: "4,800",
  },
];

export function PublicLanding() {
  return (
    <main className="lp-shell">
      {/* ── Header ── */}
      <header className="lp-header">
        <Link className="lp-logo" href="/">
          <span className="lp-logo-mark">
            <span />
            <span />
            <span />
          </span>
          <strong>RealtyOS</strong>
        </Link>

        <nav className="lp-nav">
          <a href="#features">Buy</a>
          <a href="#listings">Rent</a>
          <a href="#features">Sell</a>
          <a href="#features">Agents</a>
        </nav>

        <div className="lp-header-actions">
          <Link className="lp-btn-primary-sm" href="/inquiry">
            Sign Up
          </Link>
          <Link className="lp-btn-outline-sm" href="/portal/login">
            Log In
          </Link>
          <ThemeToggle className="lp-theme-toggle" />
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="lp-hero">
        <Image
          src="/hero-bg.png"
          alt="Luxury home at sunset"
          fill
          priority
          className="lp-hero-img"
        />
        <div className="lp-hero-overlay" />
        <div className="lp-hero-content">
          <h1>Find Your Dream Home</h1>
          <p>
            Experience the future of real estate with RealtyOS. AI-driven speed
            meets hyper-personalized curation for buyers and renters.
          </p>

          <div className="lp-search-bar">
            <span className="lp-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Enter neighborhood, city, or zip code"
              className="lp-search-input"
            />
            <Link href="/inquiry" className="lp-search-btn">
              Search Now →
            </Link>
          </div>

          <div className="lp-trust-row">
            <span>✓ 10k+ Users</span>
            <span>✓ AI-Backed</span>
            <span>✓ Smart Matching</span>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="lp-features" id="features">
        <div className="lp-features-head">
          <div>
            <span className="marketing-kicker">The RealtyOS advantage</span>
            <h2>
              Why choose us for your
              <br />
              property search?
            </h2>
          </div>
          <p>
            We&apos;ve re-engineered the real estate experience from the ground
            up using advanced machine learning.
          </p>
        </div>

        <div className="lp-features-grid">
          <article className="lp-feature-card">
            <div className="lp-feature-icon">⚡</div>
            <h3>AI-Driven Speed</h3>
            <p>
              Our proprietary algorithm scans thousands of market and MLS
              listings in milliseconds to find matches before they hit
              mainstream sites.
            </p>
          </article>
          <article className="lp-feature-card">
            <div className="lp-feature-icon">♥</div>
            <h3>Personalized Curation</h3>
            <p>
              Receive a hand-picked daily selection of properties that actually
              fit your lifestyle and financial goals.
            </p>
          </article>
          <article className="lp-feature-card">
            <div className="lp-feature-icon">📊</div>
            <h3>Real-Time Insights</h3>
            <p>
              Access deep neighborhood data, school ratings, and predictive
              value trends to make informed investment decisions.
            </p>
          </article>
        </div>
      </section>

      {/* ── Listings ── */}
      <section className="lp-listings" id="listings">
        <div className="lp-listings-head">
          <h2>Newest Listings</h2>
          <Link href="/inquiry" className="lp-view-all">
            View All →
          </Link>
        </div>

        <div className="lp-listings-grid">
          {LISTINGS.map((l) => (
            <article key={l.name} className="lp-listing-card">
              <div className="lp-listing-img-wrap">
                <Image
                  src={l.img}
                  alt={l.name}
                  fill
                  className="lp-listing-img"
                />
                <span className="lp-listing-badge">{l.badge}</span>
                <button className="lp-listing-fav" aria-label="Favorite">
                  ♡
                </button>
              </div>
              <div className="lp-listing-info">
                <strong className="lp-listing-price">{l.price}</strong>
                <h4>{l.name}</h4>
                <p>{l.location}</p>
                <div className="lp-listing-meta">
                  <span>🛏 {l.beds} Beds</span>
                  <span>🚿 {l.baths} Baths</span>
                  <span>📐 {l.sqft} sqft</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="lp-cta">
        <div className="lp-cta-content">
          <h2>
            Ready to find your
            <br />
            forever home?
          </h2>
          <p>
            Take our 2-minute lifestyle quiz and let RealtyOS find properties
            that match your soul, not just your filters.
          </p>
          <Link href="/inquiry" className="lp-btn-primary-lg">
            Find My Dream Home
          </Link>
        </div>
        <div className="lp-cta-images">
          <Image
            src="/property-1.png"
            alt="Property preview"
            width={200}
            height={150}
            className="lp-cta-img"
          />
          <Image
            src="/property-4.png"
            alt="Property preview"
            width={200}
            height={150}
            className="lp-cta-img"
          />
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="lp-footer">
        <div className="lp-footer-grid">
          <div className="lp-footer-brand">
            <span className="lp-logo-mark lp-logo-mark-sm">
              <span />
              <span />
              <span />
            </span>
            <strong>RealtyOS</strong>
            <p>
              Redefining the property search experience with AI-powered
              intelligence and human-centric design.
            </p>
          </div>

          <div className="lp-footer-col">
            <h5>Company</h5>
            <a href="#">About Us</a>
            <a href="#">Our Team</a>
            <a href="#">Careers</a>
            <a href="#">Contact</a>
          </div>

          <div className="lp-footer-col">
            <h5>Resources</h5>
            <a href="#">Buyer&apos;s Guide</a>
            <a href="#">Seller&apos;s Guide</a>
            <a href="#">Market Trends</a>
            <a href="#">Mortgage Calculator</a>
          </div>

          <div className="lp-footer-col">
            <h5>Newsletter</h5>
            <p>Get the latest market insights delivered to your inbox.</p>
            <div className="lp-newsletter">
              <input type="email" placeholder="Email address" />
              <button className="lp-newsletter-btn" aria-label="Subscribe">
                →
              </button>
            </div>
          </div>
        </div>

        <div className="lp-footer-bottom">
          <span>
            &copy; {new Date().getFullYear()} RealtyOS. All rights reserved.
          </span>
          <div className="lp-footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Settings</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
