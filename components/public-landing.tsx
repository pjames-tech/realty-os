"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/* ── Counting animation hook ── */
function useCountUp(end: number, suffix: string, duration: number = 1800) {
  const [display, setDisplay] = useState("0" + suffix);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(Math.round(eased * end) + suffix);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, end, suffix, duration]);

  return { ref, display };
}

/* ── Scroll-reveal hook ── */
function useReveal() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    el.style.opacity = "0";
    el.style.transform = "translateY(32px)";
    el.style.transition = "opacity 0.7s ease, transform 0.7s ease";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

const STATS = [
  { value: "40%", label: "LEAD CONVERSION VS AVERAGE", sub: "Avg. Portfolio Growth" },
  { value: "3s", label: "RESPONSE TIME", sub: "● 300x Faster Than Human" },
  { value: "10k+", label: "LEADS QUALIFYING MONTHLY", sub: "Trusted By Top Agencies" },
  { value: "24/7", label: "OPERATION TIME", sub: "Never Miss A Lead" },
];

const FEATURES = [
  {
    icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>),
    title: "Instant Lead Ingest",
    desc: "Connect your lead sources and ingest prospects in under 3 seconds automatically.",
  },
  {
    icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>),
    title: "AI Qualification",
    desc: "Automatically capture Budget, Timeline, Location, and Property Type with natural dialogue.",
  },
  {
    icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>),
    title: "Auto-Tagging",
    desc: "Leads are instantly categorized and scored for your CRM with smart priority tags.",
  },
  {
    icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>),
    title: "24/7 Availability",
    desc: "Never miss a midnight lead again with our always-on AI receptionist assistant.",
  },
];

const BENEFITS = [
  { icon: "🔗", title: "Seamless CRM Integration", desc: "Pushes data directly to Follow Up Boss, Salesforce, and HubSpot." },
  { icon: "📱", title: "Mobile Intake Forms", desc: "Clean, mobile-first lead forms that convert at 2x the industry average." },
  { icon: "📅", title: "Automatic Calendar Booking", desc: "Leads book directly onto your agent's calendars post-qualification." },
];

const PRICING_PLANS = [
  { name: "Starter", price: "Free", period: "", desc: "For solo agents just getting started.", features: ["50 leads/month", "AI qualification", "Basic analytics", "Email support"], cta: "Get Started", highlight: false },
  { name: "Professional", price: "$49", period: "/mo", desc: "For growing teams that need more power.", features: ["Unlimited leads", "CRM integrations", "Auto-tagging & scoring", "Priority support", "Team management"], cta: "Start Free Trial", highlight: true },
  { name: "Enterprise", price: "Custom", period: "", desc: "For brokerages with advanced needs.", features: ["Everything in Pro", "Custom AI training", "Dedicated account manager", "SLA guarantees", "White-label options"], cta: "Contact Sales", highlight: false },
];

const RESOURCES = [
  { icon: "📖", title: "Documentation", desc: "Explore the full RealtyOS platform architecture and API reference.", link: "/docs" },
  { icon: "🎓", title: "Getting Started Guide", desc: "A step-by-step walkthrough for new agents setting up their first pipeline.", link: "/getting-started" },
  { icon: "💬", title: "Community Forum", desc: "Connect with other real estate professionals using RealtyOS.", link: "/community" },
  { icon: "📹", title: "Video Tutorials", desc: "Watch short demos of key features like lead qualification and booking.", link: "/tutorials" },
];

export function PublicLanding() {
  // Smooth scroll for all anchor links
  useEffect(() => {
    function handleAnchorClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest('a[href^="#"]');
      if (!target) return;
      e.preventDefault();
      const id = (target as HTMLAnchorElement).getAttribute('href')!.slice(1);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  // Counting stats
  const stat1 = useCountUp(40, "%");
  const stat2 = useCountUp(3, "s");
  const stat3 = useCountUp(10, "k+");
  const statRefs = [stat1, stat2, stat3];

  // Section reveal refs
  const featuresRef = useReveal();
  const solutionsRef = useReveal();
  const pricingRef = useReveal();
  const resourcesRef = useReveal();
  const ctaRef = useReveal();
  return (
    <main className="lp-shell" style={{ background: "#FFFFFF", color: "#1E293B" }}>
      {/* ── Header ── */}
      <header className="b2b-header">
        <Link className="b2b-logo" href="/">
          <span className="b2b-logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="9" rx="1" fill="#F25C05"/><rect x="14" y="3" width="7" height="5" rx="1" fill="#F25C05"/><rect x="14" y="12" width="7" height="9" rx="1" fill="#F25C05"/><rect x="3" y="16" width="7" height="5" rx="1" fill="#F25C05"/></svg>
          </span>
          <strong>RealtyOS</strong>
        </Link>
        <nav className="b2b-nav">
          <a href="#features">Features</a>
          <a href="#solutions">Solutions</a>
          <a href="#pricing">Pricing</a>
          <a href="#resources">Resources</a>
        </nav>
        <div className="b2b-header-actions">
          <Link className="b2b-btn-ghost" href="/admin/login">Login</Link>
          <Link className="b2b-btn-primary" href="/admin/register">Get Started</Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="b2b-hero">
        <div className="b2b-hero-left">
          <span className="b2b-kicker">Now Powered By Advanced AI</span>
          <h1>Zero-Latency<br />Lead<br />Engagement.</h1>
          <p>Qualify, tag, and book appointments without human intervention. RealtyOS bridges the gap between lead generation and closed deals.</p>
          <div className="b2b-hero-cta">
            <Link href="/admin/register" className="b2b-btn-primary-lg">Get Started for Free →</Link>
            <Link href={"/demo" as any} className="b2b-btn-outline-lg">
              <span className="b2b-play-icon">▶</span> Watch Demo
            </Link>
          </div>
        </div>
        <div className="b2b-hero-right">
          <div className="b2b-hero-screenshot">
            <Image src="/hero-bg.png" alt="RealtyOS Dashboard Preview" width={540} height={360} priority
              style={{ borderRadius: "12px", objectFit: "cover", width: "100%", height: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }} />
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="b2b-stats">
        {STATS.map((s, i) => (
          <div key={s.label} className="b2b-stat-item">
            <strong ref={i < 3 ? statRefs[i].ref as any : undefined}>{i < 3 ? statRefs[i].display : s.value}</strong>
            <span className="b2b-stat-label">{s.label}</span>
            <span className="b2b-stat-sub">{s.sub}</span>
          </div>
        ))}
      </section>

      {/* ── Features ── */}
      <section className="b2b-features" id="features" ref={featuresRef as any}>
        <div className="b2b-section-header">
          <span className="b2b-kicker">POWERFUL FEATURES</span>
          <h2>Real-Time Intelligence for<br />Modern Real Estate</h2>
          <p>Our AI-driven engine handles the heavy-lifting of lead qualification so your team can focus on closing deals.</p>
        </div>
        <div className="b2b-features-grid">
          {FEATURES.map((f) => (
            <article key={f.title} className="b2b-feature-card">
              <div className="b2b-feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Solutions / Benefits ── */}
      <section className="b2b-solutions" id="solutions" ref={solutionsRef as any}>
        <div className="b2b-solutions-content">
          <div className="b2b-solutions-text">
            <h2>Designed for high-growth real estate teams</h2>
            <div className="b2b-benefits-list">
              {BENEFITS.map((b) => (
                <div key={b.title} className="b2b-benefit-item">
                  <span className="b2b-benefit-icon">{b.icon}</span>
                  <div>
                    <h4>{b.title}</h4>
                    <p>{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="b2b-solutions-img">
            <div className="b2b-phone-mockup">
              <Image src="/property-1.png" alt="Mobile Intake Form Preview" width={320} height={500}
                style={{ borderRadius: "24px", objectFit: "cover", width: "100%", height: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.12)" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="b2b-pricing" id="pricing" ref={pricingRef as any}>
        <div className="b2b-section-header">
          <span className="b2b-kicker">SIMPLE PRICING</span>
          <h2>Plans that scale with your business</h2>
          <p>Start free. Upgrade when you need more power. No hidden fees.</p>
        </div>
        <div className="b2b-pricing-grid">
          {PRICING_PLANS.map((plan) => (
            <div key={plan.name} className={`b2b-pricing-card ${plan.highlight ? "b2b-pricing-highlight" : ""}`}>
              <h3>{plan.name}</h3>
              <div className="b2b-pricing-price">
                <strong>{plan.price}</strong>{plan.period && <span>{plan.period}</span>}
              </div>
              <p className="b2b-pricing-desc">{plan.desc}</p>
              <ul className="b2b-pricing-features">
                {plan.features.map((f) => (<li key={f}>✓ {f}</li>))}
              </ul>
              <Link href="/admin/register" className={plan.highlight ? "b2b-btn-primary-lg" : "b2b-btn-outline-lg"} style={{ width: "100%", justifyContent: "center", textDecoration: "none" }}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Resources ── */}
      <section className="b2b-resources" id="resources" ref={resourcesRef as any}>
        <div className="b2b-section-header">
          <span className="b2b-kicker">RESOURCES</span>
          <h2>Everything you need to succeed</h2>
          <p>Guides, documentation, and community support to help you get the most out of RealtyOS.</p>
        </div>
        <div className="b2b-resources-grid">
          {RESOURCES.map((r) => (
            <Link key={r.title} href={r.link as any} className="b2b-resource-card">
              <span className="b2b-resource-icon">{r.icon}</span>
              <h4>{r.title}</h4>
              <p>{r.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="b2b-cta" ref={ctaRef as any}>
        <div className="b2b-cta-inner">
          <div className="b2b-cta-text">
            <h2>Ready to stop losing leads?</h2>
            <p>Join 500+ top-producing teams automating their lead qualification today.</p>
          </div>
          <div className="b2b-cta-actions">
            <Link href="/admin/register" className="b2b-cta-btn-primary">Start Free Trial</Link>
            <Link href={"/demo" as any} className="b2b-cta-btn-outline">Book a Demo</Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="b2b-footer">
        <div className="b2b-footer-grid">
          <div className="b2b-footer-brand">
            <div className="b2b-footer-logo">
              <span className="b2b-logo-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="9" rx="1" fill="#F25C05"/><rect x="14" y="3" width="7" height="5" rx="1" fill="#F25C05"/><rect x="14" y="12" width="7" height="9" rx="1" fill="#F25C05"/><rect x="3" y="16" width="7" height="5" rx="1" fill="#F25C05"/></svg>
              </span>
              <strong>RealtyOS</strong>
            </div>
            <p>The intelligent layer for real estate professionals. Scale your business without scaling your overhead.</p>
            <div className="b2b-social-links">
              <a href="#" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="#" aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
              </a>
            </div>
          </div>

          <div className="b2b-footer-col">
            <h5>Product</h5>
            <Link href={"/automations" as any}>Automations</Link>
            <a href="#features">Lead Scoring</a>
            <a href="#features">Integrations</a>
            <a href="#pricing">Pricing</a>
          </div>

          <div className="b2b-footer-col">
            <h5>Company</h5>
            <Link href={"/about" as any}>About Us</Link>
            <Link href={"/careers" as any}>Careers</Link>
            <Link href={"/privacy" as any}>Privacy Policy</Link>
            <Link href={"/terms" as any}>Terms of Service</Link>
          </div>

          <div className="b2b-footer-col">
            <h5>Support</h5>
            <Link href={"/help" as any}>Help Center</Link>
            <Link href="/docs">API Docs</Link>
            <Link href={"/contact" as any}>Contact</Link>
          </div>
        </div>

        <div className="b2b-footer-bottom">
          <span>&copy; {new Date().getFullYear()} RealtyOS, Inc. All rights reserved.</span>
        </div>
      </footer>
    </main>
  );
}
