import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { useTheme } from "../../../utils/theme";

import { toast } from "react-hot-toast";
import { ROUTE } from "../../../routes/const";
import { FiHome } from "react-icons/fi";
import { FiSearch } from "react-icons/fi";
import { FaRegFileCode, FaBug, FaKey, FaGear } from "react-icons/fa6"
import { LiaLinkSolid } from "react-icons/lia";
import { RxActivityLog } from "react-icons/rx";
import { SiGoogleanalytics } from "react-icons/si";

import SidebarFooter from "../../components/sidebarfooter/sidebarfooter";
import "./sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const { isDarkMode } = useTheme();

  const currentView = location.pathname === "/dashboard" ? "overview" : location.pathname.replace("/dashboard/", "");

  const handleNavigation = (viewName: string) => {
    if (viewName === "overview") {
      navigate("/dashboard");
    } else {
      navigate(`/dashboard/${viewName}`);
    }
  };

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user_email");
    toast.success("Logged out successfully");
    navigate(ROUTE.LANDING);
  };

  // Helper to extract email securely from cookies or JWT token
  const getLoggedInUserEmail = (): string => {
    const savedEmail = Cookies.get("user_email");
    if (savedEmail) return savedEmail;

    const token = Cookies.get("token");
    if (token) {
      try {
        const base64Url = token.split(".")[1];
        if (base64Url) {
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = decodeURIComponent(
            window.atob(base64)
              .split("")
              .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
              .join("")
          );
          const parsed = JSON.parse(jsonPayload);
          const email = parsed.email || parsed.sub || parsed.username;
          if (email) return email;
        }
      } catch (e) {
        console.error("Error decoding token", e);
      }
    }
    return "demo@gcrawl.ai";
  };

  const email = getLoggedInUserEmail();
  const avatarInitials = email.slice(0, 2).toUpperCase();

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      {/* Brand Header */}
      <div className="brand" onClick={() => navigate(ROUTE.LANDING)}>
        {isCollapsed ? (
          <img src={isDarkMode ? "/GcrawlWhiteLogo.svg" : "/Logo.svg"} alt="GcrawlAI" style={{ width: "50px", height: "auto" }} />
        ) : (
          <img src={isDarkMode ? "/GcrawlWhiteLogo.svg" : "/Logo.svg"} alt="GcrawlAI" style={{ width: "100px", height: "auto" }} />
        )}
      </div>

      {/* Scrollable Navigation Links Container */}
      <div className="sidebar-links-wrapper">
        <div
          className={`nav-item ${currentView === "overview" ? "active" : ""}`}
          onClick={() => handleNavigation("overview")}
        >
          <div className="nav-item-left">
            <span className="nav-icon">
              <FiHome />
            </span>
            <span className="nav-label">Overview</span>
          </div>
        </div>


        {/* PLAYGROUND SECTION */}
        <div className="nav-group-title">Playground</div>

        {/* Search */}
        <div
          className={`nav-item ${currentView === "search" ? "active" : ""}`}
          onClick={() => handleNavigation("search")}
        >
          <div className="nav-item-left">
            <span className="nav-icon">
              <FiSearch />
            </span>
            <span className="nav-label">Search the web</span>
          </div>
        </div>

        {/* Scrape */}
        <div
          className={`nav-item ${currentView === "scrape" ? "active" : ""}`}
          onClick={() => handleNavigation("scrape")}
        >
          <div className="nav-item-left">
            <span className="nav-icon">
              <FaRegFileCode />
            </span>
            <span className="nav-label">Scrape a web page</span>
          </div>
        </div>

        {/* Map website links */}
        <div
          className={`nav-item ${currentView === "map" ? "active" : ""}`}
          onClick={() => handleNavigation("map")}
        >
          <div className="nav-item-left">
            <span className="nav-icon">
              <LiaLinkSolid />
            </span>
            <span className="nav-label">Map website links</span>
          </div>
        </div>

        {/* Crawl entire website */}
        <div
          className={`nav-item ${currentView === "crawl" ? "active" : ""}`}
          onClick={() => handleNavigation("crawl")}
        >
          <div className="nav-item-left">
            <span className="nav-icon">
              <FaBug />
            </span>
            <span className="nav-label">Crawl entire website</span>
          </div>
        </div>

        {/* ACCOUNT SECTION */}
        <div className="nav-group-title">Account</div>

        {/* Activity Logs */}
        <div
          className={`nav-item ${currentView === "activity" ? "active" : ""}`}
          onClick={() => handleNavigation("activity")}
        >
          <div className="nav-item-left">
            <span className="nav-icon">
              <RxActivityLog />
            </span>
            <span className="nav-label">Activity Logs</span>
          </div>
        </div>

        {/* Usage */}
        <div
          className={`nav-item ${currentView === "usage" ? "active" : ""}`}
          onClick={() => handleNavigation("usage")}
        >
          <div className="nav-item-left">
            <span className="nav-icon">
              <SiGoogleanalytics />
            </span>
            <span className="nav-label">Usage</span>
          </div>
        </div>

        {/* API Keys */}
        <div
          className={`nav-item ${currentView === "apikeys" ? "active" : ""}`}
          onClick={() => handleNavigation("apikeys")}
        >
          <div className="nav-item-left">
            <span className="nav-icon">
              <FaKey />
            </span>
            <span className="nav-label">API Keys</span>
          </div>
        </div>

        {/* Settings */}
        <div
          className={`nav-item ${currentView === "settings" ? "active" : ""}`}
          onClick={() => handleNavigation("settings")}
        >
          <div className="nav-item-left">
            <span className="nav-icon">
              <FaGear />
            </span>
            <span className="nav-label">Settings</span>
          </div>
        </div>
      </div> {/* Closing sidebar-links-wrapper */}

      <SidebarFooter
        isCollapsed={isCollapsed}
        showAccountModal={showAccountModal}
        setShowAccountModal={setShowAccountModal}
        avatarInitials={avatarInitials}
        email={email}
        handleLogout={handleLogout}
        navigate={navigate}
      />

      <button className="collapse-button" onClick={() => setIsCollapsed(!isCollapsed)}>
        <span>{isCollapsed ? ">>" : "<< "}</span>
        <span className="collapse-text">Collapse</span>
      </button>
    </div>
  );
}