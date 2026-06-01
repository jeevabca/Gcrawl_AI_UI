import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";
import { ROUTE } from "../../../routes/const";
import { FiSearch, FiFile } from "react-icons/fi";
import { FaBug, FaCode } from "react-icons/fa6";
import { LiaLinkSolid } from "react-icons/lia";
import { IoLogoGithub } from "react-icons/io";
import { useGithubStars } from "../../../context/GithubStarsContext";

interface NavbarProps {
  activePage?: "home" | "playground" | "docs" | "pricing";
}

export default function Navbar({ activePage }: NavbarProps) {
  const navigate = useNavigate();
  const [showProductsDropdown, setShowProductsDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get("token"));
  const stars = useGithubStars();

  const handleLogout = () => {
    Cookies.remove("token");
    setIsLoggedIn(false);
    toast.success("Logged out successfully");
    navigate(ROUTE.LOGIN || "/login");
  };

  return (
    <nav className="landing-navbar">
      <div className="landing-logo-group" onClick={() => navigate(ROUTE.LANDING)}>
        <img src="/src/assets/Logo.svg" alt="GcrawlAI" style={{ width: "100px", height: "auto", cursor: "pointer" }} />
      </div>

      <div className="landing-nav-links">
        <div
          style={{
            position: "relative",
            display: "inline-block"
          }}
          onMouseEnter={() => setShowProductsDropdown(true)}
          onMouseLeave={() => setShowProductsDropdown(false)}
        >
          <a
            className={`landing-nav-link landing-nav-link-dropdown ${activePage === "home" ? "active" : ""}`}
            style={{ cursor: "pointer", padding: "8px 0" }}
          >
            Products
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transition: "transform 0.25s ease",
                transform: showProductsDropdown ? "rotate(180deg)" : "rotate(0)",
                marginLeft: "4px"
              }}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </a>

          {showProductsDropdown && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 4px)",
                left: "50%",
                transform: "translateX(-50%)",
                width: "320px",
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.02)",
                padding: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                zIndex: 9999
              }}
            >
              {/* Search Item */}
              <div
                className="products-dropdown-item"
                onClick={() => { navigate(ROUTE.PLAYGROUND, { state: { tab: "search" } }); setShowProductsDropdown(false); }}
              >
                <div className="products-dropdown-icon">
                  <FiSearch style={{ color: "var(--primary)", fontSize: "16px" }} />
                </div>
                <div className="products-dropdown-content">
                  <span className="products-dropdown-title" style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "2px" }}>Search</span>
                  <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 400 }}>Discover web content & details</span>
                </div>
              </div>

              {/* Scrape Item */}
              <div
                className="products-dropdown-item"
                onClick={() => { navigate(ROUTE.PLAYGROUND, { state: { tab: "scrape" } }); setShowProductsDropdown(false); }}
              >
                <div className="products-dropdown-icon">
                  <FiFile style={{ color: "#10b981", fontSize: "16px" }} />
                </div>
                <div className="products-dropdown-content">
                  <span className="products-dropdown-title" style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "2px" }}>Scrape</span>
                  <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 400 }}>Vibrant high-speed page scraper</span>
                </div>
              </div>

              {/* Map Item */}
              <div
                className="products-dropdown-item"
                onClick={() => { navigate(ROUTE.PLAYGROUND, { state: { tab: "map" } }); setShowProductsDropdown(false); }}
              >
                <div className="products-dropdown-icon">
                  <LiaLinkSolid style={{ color: "#3b82f6", fontSize: "16px" }} />
                </div>
                <div className="products-dropdown-content">
                  <span className="products-dropdown-title" style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "2px" }}>Map</span>
                  <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 400 }}>Generate interactive sitemaps</span>
                </div>
              </div>

              {/* Crawl Item */}
              <div
                className="products-dropdown-item"
                onClick={() => { navigate(ROUTE.PLAYGROUND, { state: { tab: "crawl" } }); setShowProductsDropdown(false); }}
              >
                <div className="products-dropdown-icon">
                  <FaBug style={{ color: "#ef4444", fontSize: "16px" }} />
                </div>
                <div className="products-dropdown-content">
                  <span className="products-dropdown-title" style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "2px" }}>Crawl</span>
                  <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 400 }}>Automated stealth web crawling</span>
                </div>
              </div>

              {/* Parse Item */}
              <div
                className="products-dropdown-item"
                onClick={() => { navigate(ROUTE.PLAYGROUND, { state: { tab: "parse" } }); setShowProductsDropdown(false); }}
              >
                <div className="products-dropdown-icon">
                  <FaCode style={{ color: "#f59e0b", fontSize: "16px" }} />
                </div>
                <div className="products-dropdown-content">
                  <span className="products-dropdown-title" style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "2px" }}>Parse</span>
                  <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 400 }}>Clean & structure extracted tags</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <a
          className={`landing-nav-link ${activePage === "playground" ? "active" : ""}`}
          onClick={() => navigate(ROUTE.PLAYGROUND, { state: { tab: "scrape" } })}
        >
          Playground
        </a>
        <a className={`landing-nav-link ${activePage === "docs" ? "active" : ""}`}>Docs</a>
        <a
          className={`landing-nav-link ${activePage === "pricing" ? "active" : ""}`}
          onClick={() => navigate(ROUTE.PRICING)}
        >
          Pricing
        </a>
      </div>

      <div className="landing-right-nav">
        <button
          className="landing-star-button"
          onClick={() => window.open("https://github.com/GramosoftAI/GcrawlAI", "_blank")}
        >
          <IoLogoGithub style={{ color: "var(--text-secondary)", marginRight: "4px", width: "16px", height: "16px" }} />
          <span>{stars}</span>
        </button>

        {isLoggedIn ? (
          <>
            <button className="landing-logout-btn" onClick={handleLogout}>
              Logout
            </button>
            <button className="landing-dashboard-btn" onClick={() => navigate(ROUTE.DASHBOARD || "/dashboard")}>
              Dashboard
            </button>
          </>
        ) : (
          <>
            <button className="landing-logout-btn" onClick={() => navigate(ROUTE.LOGIN || "/login")}>
              Sign In
            </button>
            <button className="landing-dashboard-btn" onClick={() => navigate(ROUTE.SIGNUP || "/signup")}>
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
