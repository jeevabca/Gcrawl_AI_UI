import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTE } from "../../../routes/const";
import Footer from "../footer/footer";
import Navbar from "../navbar/navbar";
import "../landing/landing.css";
import "./pricing.css";
import { GiCheckMark } from "react-icons/gi";

export default function PricingPage() {
  const navigate = useNavigate();
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

          <button className="pricing-action-btn dark-action-btn" onClick={() => navigate(`${ROUTE.CONTACT}?plan=Starter`)} style={{ marginTop: "24px" }}>
            Contact sales
          </button>
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

          <button className="pricing-action-btn dark-action-btn" onClick={() => navigate(`${ROUTE.CONTACT}?plan=Growth`)} style={{ marginTop: "24px" }}>
            Contact sales
          </button>
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

          <button className="pricing-action-btn dark-action-btn" onClick={() => navigate(`${ROUTE.CONTACT}?plan=Pro`)} style={{ marginTop: "24px" }}>
            Contact sales
          </button>
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

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}
