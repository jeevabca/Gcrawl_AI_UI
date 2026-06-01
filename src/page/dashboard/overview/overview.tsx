import { useState } from "react";
import { toast } from "react-hot-toast";
import { FiSearch, } from "react-icons/fi";
import { FaRegFileCode, FaBug } from "react-icons/fa6";
import { LiaLinkSolid } from "react-icons/lia";
import { useLocation, useNavigate } from "react-router-dom";
import Playground from "../../components/playground/playground";
import Activitylogs from "../activitylog/activitylogs";
import Apikey from "../apikey/apikey";
import Settings from "../settings/settings";
import "./overview.css";
import { IoMdEye, IoIosEyeOff } from "react-icons/io";
import { MdOutlineContentCopy } from "react-icons/md";

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const view = location.pathname === "/dashboard" ? "overview" : location.pathname.replace("/dashboard/", "");

  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const fullApiKey = "gc-c7a11a84f3e69fbdc80126aef65d8639";
  const maskedApiKey = "gc-c7a11••••••••••••••••••••••••8639";

  const handleCopyApiKey = () => {
    try {
      navigator.clipboard.writeText(fullApiKey);
    } catch (err) {
      console.warn("Clipboard access denied:", err);
    }
    toast.success("API key copied to clipboard!");
  };

  const setView = (newView: string) => {
    if (newView === "overview") {
      navigate("/dashboard");
    } else {
      navigate(`/dashboard/${newView}`);
    }
  };

  // Dynamically render Playground active tabs inside Dashboard
  if (view === "search" || view === "scrape" || view === "parse" || view === "map" || view === "crawl") {
    let tab: "search" | "scrape" | "parse" | "map" | "crawl" = "scrape";
    if (view === "search") tab = "search";
    else if (view === "scrape") tab = "scrape";
    else if (view === "parse") tab = "parse";
    else if (view === "map") tab = "map";
    else if (view === "crawl") tab = "crawl";

    return (
      <div className="dashboard-view-container">
        <Playground initialTab={tab} hideHeader={true} onTabChange={(newTab) => setView(newTab)} />
      </div>
    );
  }

  // Render first-class high-fidelity sub-views inside Dashboard
  if (view === "activity") {
    return <Activitylogs />;
  }

  if (view === "usage") {
    return (
      <div className="dashboard-view-container">
        <div className="dashboard-heading-section">
          <h1 className="dashboard-title">Usage & Analytics</h1>
          <p className="dashboard-subtitle">Track resource usage, scraping statistics, and remaining credits</p>
        </div>
        <div className="endpoints-grid" style={{ marginBottom: "24px" }}>
          <div className="dashboard-card" style={{ padding: "20px" }}>
            <h3 className="card-title" style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Credits Remaining</h3>
            <div style={{ fontSize: "28px", fontWeight: "700", margin: "10px 0", color: "var(--primary)" }}>984 / 1,000</div>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: 0 }}>Renews on June 20, 2026</p>
          </div>
          <div className="dashboard-card" style={{ padding: "20px" }}>
            <h3 className="card-title" style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Total Scraped Pages</h3>
            <div style={{ fontSize: "28px", fontWeight: "700", margin: "10px 0", color: "var(--text-primary)" }}>1,168</div>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: 0 }}>All-time successful endpoints calls</p>
          </div>
        </div>
      </div>
    );
  }

  if (view === "apikeys") {
    return <Apikey />;
  }

  if (view === "settings") {
    return <Settings />;
  }

  return (
    <div className="dashboard-view-container">
      {/* Title Header */}
      <div className="dashboard-heading-section">
        <h1 className="dashboard-title">Explore our endpoints</h1>
        <p className="dashboard-subtitle">Power your applications with our comprehensive scraping API</p>
      </div>

      {/* Grid of Endpoints */}
      <div className="endpoints-grid">
        {/* Search */}
        <div className="endpoint-card" onClick={() => setView("search")}>
          <div className="endpoint-icon-wrapper">
            <FiSearch />
          </div>
          <h3 className="endpoint-card-title">Search</h3>
          <p className="endpoint-card-desc">Search the web and get full content from results.</p>
        </div>

        {/* Scrape */}
        <div className="endpoint-card" onClick={() => setView("scrape")}>
          <div className="endpoint-icon-wrapper">
            <FaRegFileCode />
          </div>
          <h3 className="endpoint-card-title">Scrape</h3>
          <p className="endpoint-card-desc">Get LLM-ready data from websites. Markdown, JSON, screenshot, etc.</p>
        </div>

        {/* Links */}
        <div className="endpoint-card" onClick={() => setView("map")}>
          <div className="endpoint-icon-wrapper">
            <LiaLinkSolid />
          </div>
          <h3 className="endpoint-card-title">Links</h3>
          <p className="endpoint-card-desc">Extract all links from a website.</p>
        </div>

        {/* Crawl */}
        <div className="endpoint-card" onClick={() => setView("crawl")}>
          <div className="endpoint-icon-wrapper">
            <FaBug />
          </div>
          <h3 className="endpoint-card-title">Crawl</h3>
          <p className="endpoint-card-desc">Crawl all the pages on a website and get data for each page.</p>
        </div>
      </div>

      {/* Two Column Layout (Chart and Right sidecards) */}
      <div className="dashboard-columns">
        {/* Left Side: Spline Wave Chart */}
        <div className="dashboard-card">
          <div className="chart-header">
            <div>
              <h3 className="card-title">Scraped pages — Last 7 days</h3>
              <p className="card-subtitle">Credit usage differs</p>
            </div>
            <div className="chart-stats-badge">
              <div className="chart-stats-count">1,168</div>
              <div className="chart-stats-label">Pages</div>
            </div>
          </div>

          {/* SVG Spline Chart */}
          <div className="chart-svg-container">
            <svg viewBox="0 0 600 280" width="100%" height="100%">
              <defs>
                <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#064a91" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#064a91" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <line x1="50" y1="50" x2="560" y2="50" className="chart-grid-line" />
              <line x1="50" y1="100" x2="560" y2="100" className="chart-grid-line" />
              <line x1="50" y1="150" x2="560" y2="150" className="chart-grid-line" />
              <line x1="50" y1="200" x2="560" y2="200" className="chart-grid-line" />
              <line x1="50" y1="250" x2="560" y2="250" className="chart-axis-line" />
              <text x="25" y="54" className="chart-label-text">240</text>
              <text x="25" y="104" className="chart-label-text">180</text>
              <text x="25" y="154" className="chart-label-text">120</text>
              <text x="25" y="204" className="chart-label-text">60</text>
              <text x="32" y="254" className="chart-label-text">0</text>
              <path
                d="M 50,87 C 91.5,87 91.5,142 133,142 C 174.5,142 174.5,101 216,101 C 257.5,101 257.5,188 299,188 C 340.5,188 340.5,96 382,96 C 423.5,96 423.5,211 465,211 C 506.5,211 508.5,69 550,69 L 550,250 L 50,250 Z"
                className="chart-fill-gradient"
              />
              <path
                d="M 50,87 C 91.5,87 91.5,142 133,142 C 174.5,142 174.5,101 216,101 C 257.5,101 257.5,188 299,188 C 340.5,188 340.5,96 382,96 C 423.5,96 423.5,211 465,211 C 506.5,211 508.5,69 550,69"
                className="chart-line-spline"
              />
              <circle cx="50" cy="87" r="5.5" className="chart-glow-dot" onClick={() => toast("Mon: 210 pages", { icon: "📊" })} />
              <circle cx="133" cy="142" r="5.5" className="chart-glow-dot" onClick={() => toast("Tue: 150 pages", { icon: "📊" })} />
              <circle cx="216" cy="101" r="5.5" className="chart-glow-dot" onClick={() => toast("Wed: 195 pages", { icon: "📊" })} />
              <circle cx="299" cy="188" r="5.5" className="chart-glow-dot" onClick={() => toast("Thu: 100 pages", { icon: "📊" })} />
              <circle cx="382" cy="96" r="5.5" className="chart-glow-dot" onClick={() => toast("Fri: 200 pages", { icon: "📊" })} />
              <circle cx="465" cy="211" r="5.5" className="chart-glow-dot" onClick={() => toast("Sat: 75 pages", { icon: "📊" })} />
              <circle cx="550" cy="69" r="5.5" className="chart-glow-dot" onClick={() => toast("Sun: 230 pages", { icon: "📊" })} />
              <text x="50" y="272" textAnchor="middle" className="chart-label-text">Mon</text>
              <text x="133" y="272" textAnchor="middle" className="chart-label-text">Tue</text>
              <text x="216" y="272" textAnchor="middle" className="chart-label-text">Wed</text>
              <text x="299" y="272" textAnchor="middle" className="chart-label-text">Thu</text>
              <text x="382" y="272" textAnchor="middle" className="chart-label-text">Fri</text>
              <text x="465" y="272" textAnchor="middle" className="chart-label-text">Sat</text>
              <text x="550" y="272" textAnchor="middle" className="chart-label-text">Sun</text>
            </svg>
          </div>
        </div>

        {/* Right Column: API Keys and Agent Integrations */}
        <div className="dashboard-right-column">
          {/* API Key Card */}
          <div className="dashboard-card">
            <h3 className="card-title">API Key</h3>
            <p className="card-subtitle">Start scraping right away</p>
            <div className="key-box-container">
              <span>{apiKeyVisible ? fullApiKey : maskedApiKey}</span>
              <div className="key-actions-wrapper">
                <button className="key-action-btn" onClick={() => setApiKeyVisible(!apiKeyVisible)}>
                  {apiKeyVisible ? (
                    <IoIosEyeOff style={{ width: "16px", height: "16px" }} />
                  ) : (
                    <IoMdEye style={{ width: "16px", height: "16px" }} />
                  )}
                </button>
                <button className="key-action-btn" onClick={handleCopyApiKey}>
                  <MdOutlineContentCopy style={{ width: "16px", height: "16px" }} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
