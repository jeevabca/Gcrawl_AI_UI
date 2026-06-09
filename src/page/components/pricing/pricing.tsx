import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ROUTE } from "../../../routes/const";
import Footer from "../footer/footer";
import Navbar from "../navbar/navbar";
import "../landing/landing.css";
import "./pricing.css";
import { GiCheckMark } from "react-icons/gi";

export default function PricingPage() {
  const navigate = useNavigate();
  const billingPeriod = "monthly";
  const ROTATING_WORDS = ["scraping", "crawling", "searching", "mapping"];

  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % ROTATING_WORDS.length);
        // Fade in
        setVisible(true);
      }, 300);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Pricing page does not support dark theme; force light mode on mount
    document.documentElement.classList.remove("dark-theme");

    // Restore saved theme on unmount so navigation back to dashboard works seamlessly
    return () => {
      const saved = localStorage.getItem("theme");
      if (saved === "dark") {
        document.documentElement.classList.add("dark-theme");
      }
    };
  }, []);

  const handlePurchase = (plan: string) => {
    toast.success(`Redirecting to checkout for ${plan} plan (${billingPeriod})...`);
  };

  return (
    <div className="landing-container">
      {/* Navigation Bar */}
      <Navbar activePage="pricing" />

      {/* Main Pricing Hero Section */}
      <section className="pricing-hero-section">
        <div className="pricing-badge-wrapper">
          <span className="pricing-pill-badge">
            Most cost-effective web data API on the market
          </span>
        </div>

        {/* Anti-Bot Bypass / Stealth Layer Highlights */}
        <div className="pricing-stealth-layer">
          <div className="pricing-stealth-badge">
            <span className="stealth-dot"></span>
            Advanced Stealth Bypass Engine
          </div>
          <h2 className="pricing-stealth-title">
            Every request. <br />
            <span className="gradient-highlight">JS rendered.</span> <br />
            Residential IP rotation.
          </h2>
          <p className="pricing-stealth-desc">
            No dynamic markup multipliers. No hidden stealth fees. Premium residential rotation,
            TLS fingerprint emulation, and JS challenge solver are bundled directly into every request.
            Built for enterprise-grade web data collection.
          </p>

          <div className="pricing-stealth-pills">
            <span className="stealth-pill active">✓ IP Reputation Check</span>
            <span className="stealth-pill active">✓ TLS Fingerprinting</span>
            <span className="stealth-pill active">✓ HTTP Header Validation</span>
            <span className="stealth-pill active">✓ Javascript / Sensor Challenger</span>
            <span className="stealth-pill active">✓ Behavioural & Session Analysis</span>
            <span className="stealth-pill info">No credit card to start</span>
          </div>
        </div>

        <h1 className="pricing-main-title">Pricing that Makes Sense</h1>
        
      </section>

      {/* Subscription Pricing Grid - Top 4 columns */}
      <section className="pricing-top-grid">

        {/* FREE PLAN Card */}
        <div className="pricing-card-wrapper">
          <div className="pricing-card-meta">FREE</div>
          <h2 className="pricing-card-title">Free</h2>
          
          <div className="pricing-spec-row">
            <span className="spec-label">Requests: </span>
            <span className="spec-val-blue">500/mo</span>
          </div>
          <div className="pricing-spec-row" style={{ marginBottom: "20px" }}>
            <span className="spec-label">Concurrency: </span>
            <span className="spec-val-bold">2</span>
          </div>

          <ul className="pricing-features-list">
            <li>
              <GiCheckMark className="pricing-check-icon" size={12} />
              <span>500 requests/month</span>
            </li>
            <li>
              <GiCheckMark className="pricing-check-icon" size={12} />
              <span>JS rendered + residential IP</span>
            </li>
            <li>
              <GiCheckMark className="pricing-check-icon" size={12} />
              <span>2 concurrent requests</span>
            </li>
          </ul>
        </div>

        {/* STARTER Card */}
        <div className="pricing-card-wrapper">
          <div className="pricing-card-meta">STARTER</div>
          <h2 className="pricing-card-title">Starter</h2>
          
          <div className="pricing-spec-row">
            <span className="spec-label">Requests: </span>
            <span className="spec-val-blue">3K/mo</span>
          </div>
          <div className="pricing-spec-row" style={{ marginBottom: "20px" }}>
            <span className="spec-label">Concurrency: </span>
            <span className="spec-val-bold">5</span>
          </div>

          <ul className="pricing-features-list">
            <li>
              <GiCheckMark className="pricing-check-icon" size={12} />
              <span>3,000 real requests/mo</span>
            </li>
            <li>
              <GiCheckMark className="pricing-check-icon" size={12} />
              <span>5 concurrent requests</span>
            </li>
          </ul>
        </div>

        {/* GROWTH Card (retains growth-highlighted blue theme, Top Badge: "Most popular") */}
        <div className="pricing-card-wrapper growth-highlighted">
          <div className="pricing-card-top-badge blue-badge">Most popular</div>
          <div className="pricing-card-meta">GROWTH</div>
          <h2 className="pricing-card-title">Growth</h2>
          
          <div className="pricing-spec-row">
            <span className="spec-label">Requests: </span>
            <span className="spec-val-blue">50K/mo</span>
          </div>
          <div className="pricing-spec-row" style={{ marginBottom: "20px" }}>
            <span className="spec-label">Concurrency: </span>
            <span className="spec-val-bold">15</span>
          </div>

          <ul className="pricing-features-list">
            <li>
              <GiCheckMark className="pricing-check-icon" size={12} />
              <span>50,000 real requests/mo</span>
            </li>
            <li>
              <GiCheckMark className="pricing-check-icon" size={12} />
              <span>15 concurrent requests</span>
            </li>
          </ul>
        </div>

        {/* PRO Card (retains pro-highlighted green theme, Top Badge: "Best value") */}
        <div className="pricing-card-wrapper pro-highlighted">
          <div className="pricing-card-top-badge green-badge">Best value</div>
          <div className="pricing-card-meta">PRO</div>
          <h2 className="pricing-card-title">Pro</h2>
          
          <div className="pricing-spec-row">
            <span className="spec-label">Requests: </span>
            <span className="spec-val-blue">150K/mo</span>
          </div>
          <div className="pricing-spec-row" style={{ marginBottom: "20px" }}>
            <span className="spec-label">Concurrency: </span>
            <span className="spec-val-bold">25</span>
          </div>

          <ul className="pricing-features-list">
            <li>
              <GiCheckMark className="pricing-check-icon" size={12} />
              <span>150,000 real requests/mo</span>
            </li>
            <li>
              <GiCheckMark className="pricing-check-icon" size={12} />
              <span>25 concurrent requests</span>
            </li>
          </ul>
        </div>

      </section>

      {/* Bottom Section - Scale Plans sidebar + 2 cards */}
      <section className="pricing-bottom-section">
        <div className="pricing-bottom-left">
          <h3>Scale Plans</h3>
          <p>High-volume plans for teams that need more power and dedicated support. Get access to higher rate limits, more concurrent browsers, and priority support.</p>
          <a href="#" className="contact-link" onClick={(e) => { e.preventDefault(); navigate(ROUTE.CONTACT); }}>
            Need more? Contact us <span style={{ marginLeft: "2px" }}>↗</span>
          </a>
        </div>

        <div className="pricing-bottom-right">
          
          {/* BUSINESS Card */}
          <div className="pricing-card-wrapper">
            <div className="pricing-card-meta">BUSINESS</div>
            <h2 className="pricing-card-title">Business</h2>
            
            <div className="pricing-spec-row">
              <span className="spec-label">Requests: </span>
              <span className="spec-val-blue">1M/mo</span>
            </div>
            <div className="pricing-spec-row" style={{ marginBottom: "20px" }}>
              <span className="spec-label">Concurrency: </span>
              <span className="spec-val-bold">200</span>
            </div>
            <ul className="pricing-features-list">
              <li>
                <GiCheckMark className="pricing-check-icon" size={12} />
                <span>1M real requests/mo</span>
              </li>
              <li>
                <GiCheckMark className="pricing-check-icon" size={12} />
                <span>200 concurrent requests</span>
              </li>
            </ul>

            <button className="pricing-action-btn dark-action-btn" onClick={() => handlePurchase("Business")}>
              Subscribe
            </button>
          </div>

          {/* ENTERPRISE Card */}
          <div className="pricing-card-wrapper">
            <div className="pricing-card-meta">ENTERPRISE</div>
            <h2 className="pricing-card-title">Enterprise</h2>
            
            <div className="pricing-spec-row">
              <span className="spec-label">Requests: </span>
              <span className="spec-val-blue">Custom</span>
            </div>
            <div className="pricing-spec-row" style={{ marginBottom: "20px" }}>
              <span className="spec-label">Concurrency: </span>
              <span className="spec-val-bold">Custom</span>
            </div>

            <ul className="pricing-features-list" style={{ marginTop: "40px" }}>
              <li>
                <GiCheckMark className="pricing-check-icon" size={12} />
                <span>Scrape unlimited pages</span>
              </li>
              <li>
                <GiCheckMark className="pricing-check-icon" size={12} />
                <span>Custom concurrent requests</span>
              </li>
              <li>
                <GiCheckMark className="pricing-check-icon" size={12} />
                <span>Dedicated support</span>
              </li>
            </ul>

            <button className="pricing-action-btn dark-action-btn" onClick={() => navigate(ROUTE.CONTACT)}>
              Contact sales
            </button>
          </div>

        </div>
      </section>

      {/* Intermediate Trial CTA Section */}
     <section className="trial-cta-section">
      <div className="trial-cta-card">
        <h2 className="trial-cta-title">
          Start{" "}
          <span className={`rotating-word ${visible ? "visible" : "hidden"}`}>
            {ROTATING_WORDS[index]}
          </span>{" "}
          in 60 seconds
        </h2>
        <p className="trial-cta-desc">
          500 free requests/month. No credit card required. JS rendered +
          residential IP from day one.
        </p>
        <div className="trial-cta-buttons">
          <button
            className="cta-btn-primary"
            onClick={() => navigate(ROUTE.SIGNUP)}
          >
            Get free API key →
          </button>
          <button
            className="cta-btn-secondary"
            onClick={() => window.open("https://docs.gcrawl.ai", "_blank")}
          >
            View documentation
          </button>
        </div>
      </div>
    </section>

      {/* Top-ups Section */}
      <section className="topups-section-wrapper">
        <span className="topups-category">TOP-UPS</span>
        <h2 className="topups-title">Need more requests?</h2>
        <p className="topups-subtitle">
          Top-up packs stack on your monthly plan. Buy manually or enable auto-recharge — never run out mid-scrape.
        </p>

        {/* Warning subscription banner */}
        <div className="topups-warning-banner">
          <div className="warning-banner-header">
            <svg className="warning-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "18px", height: "18px", color: "#d97706", marginRight: "8px" }}>
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <strong>Active subscription required.</strong>
            <span>Top-up packs are available only on paid plans. Free plan users must upgrade first.</span>
          </div>
          <div className="warning-banner-pills">
            <span className="banner-pill pill-red">✗ Free</span>
            <span className="banner-pill pill-green">✓ Starter</span>
            <span className="banner-pill pill-green">✓ Growth</span>
            <span className="banner-pill pill-green">✓ Pro</span>
            <span className="banner-pill pill-green">✓ Business</span>
          </div>
        </div>

        <div className="topups-grid-container">
          {/* Card 1: SMALL */}
          <div className="topup-card-wrapper">
            <span className="topup-meta">TOP-UP PACK — SMALL</span>
            <h3 className="topup-credits-label">5,000 requests</h3>
            <span className="topup-validity">Valid 6 months</span>

            <div className="topup-price-row">
              <span className="topup-price">$15</span>
              <span className="topup-rate">$3.00/1K req</span>
            </div>

            <div className="topup-info-rows">
              <div className="topup-info-row">
                <span className="info-label">Available on: </span>
                <span className="info-value-bold">Starter, Growth, Pro, Business</span>
              </div>
            </div>

            <button className="topup-action-btn">
              Purchase pack
            </button>
          </div>

          {/* Card 2: MEDIUM */}
          <div className="topup-card-wrapper">
            <span className="topup-meta">TOP-UP PACK — MEDIUM</span>
            <h3 className="topup-credits-label">20,000 requests</h3>
            <span className="topup-validity">Valid 6 months</span>

            <div className="topup-price-row">
              <span className="topup-price">$39</span>
              <span className="topup-rate">$1.95/1K req</span>
            </div>

            <div className="topup-info-rows">
              <div className="topup-info-row">
                <span className="info-label">Available on: </span>
                <span className="info-value-bold">Growth, Pro, Business</span>
              </div>
            </div>

            <button className="topup-action-btn">
              Purchase pack
            </button>
          </div>

          {/* Card 3: LARGE */}
          <div className="topup-card-wrapper">
            <span className="topup-meta">TOP-UP PACK — LARGE</span>
            <h3 className="topup-credits-label">75,000 requests</h3>
            <span className="topup-validity">Valid 6 months</span>

            <div className="topup-price-row">
              <span className="topup-price">$99</span>
              <span className="topup-rate">$1.32/1K req</span>
            </div>

            <div className="topup-info-rows">
              <div className="topup-info-row">
                <span className="info-label">Available on: </span>
                <span className="info-value-bold">Pro, Business</span>
              </div>
            </div>

            <button className="topup-action-btn">
              Purchase pack
            </button>
          </div>
        </div>
      </section>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}
