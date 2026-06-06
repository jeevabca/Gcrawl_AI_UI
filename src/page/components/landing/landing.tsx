import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ROUTE } from "../../../routes/const";
import Footer from "../footer/footer";
import Navbar from "../navbar/navbar";
import "./landing.css";

export default function Landing() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"scrape" | "search" | "crawl" | "links">("scrape");
  const [url, setUrl] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    // Ensure document does not have global dark-theme class
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("dark-theme");
    }
  }, []);



  const handleRun = () => {
    if (!url.trim()) {
      toast("Please enter a valid URL to extract data!", { icon: "⚠️" });
      return;
    }

    setIsRunning(true);

    const runPromise = new Promise((resolve) => setTimeout(resolve, 2000));

    const formatTabName = (tab: string) => {
      if (tab === "scrape") return "scraping";
      if (tab === "links") return "mapping";
      return `${tab}ing`;
    };

    const targetTab = activeTab === "links" ? "map" : activeTab;

    toast.promise(
      runPromise,
      {
        loading: `Initiating ${formatTabName(activeTab)} process...`,
        success: `Successfully generated LLM-ready data from your ${targetTab} job!`,
        error: "Failed to run job",
      }
    ).then(() => {
      setIsRunning(false);
      navigate(ROUTE.PLAYGROUND, {
        state: {
          tab: targetTab,
          url: url,
        },
      });
    });
  };

  return (
    <div className="landing-container">
      <Navbar activePage="home" />

      <main className="landing-hero-section">
        {/* Credit System Pill */}
        <div className="landing-credit-pill">
          <span className="landing-credit-dot"></span>
          500 Requests Free
        </div>

        {/* Big Bold Headline */}
        <h1 className="landing-headline">
          Transform any website into
          <span className="landing-headline-accent">structured LLM-ready data</span>
        </h1>

        {/* Descriptive Subtext */}
        <p className="landing-subheadline">
          Get clean web data from any website and <br />  power your AI. <span style={{ color: "var(--primary)", backgroundColor: "var(--bg-light)", borderRadius: "8px", padding: "2px 4px", cursor: "pointer" }} onClick={() => window.open("https://github.com/GramosoftAI/GcrawlAI", "_blank")}>It's also open source.</span>
        </p>

        {/* Beautiful Control Box */}
        <div className="landing-control-card">
          {/* Main search bar */}
          <div className="landing-search-bar">
            <input
              type="text"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="landing-search-input"
              onKeyDown={(e) => e.key === "Enter" && handleRun()}
            />
            <button className="landing-run-btn" onClick={handleRun} disabled={isRunning}>
              {isRunning ? "Running..." : "Run"}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="landing-tab-bar">
            <button
              onClick={() => setActiveTab("scrape")}
              className={`landing-tab ${activeTab === "scrape" ? "active" : ""}`}
            >
              Scrape
            </button>
            <button
              onClick={() => setActiveTab("search")}
              className={`landing-tab ${activeTab === "search" ? "active" : ""}`}
            >
              Search
            </button>
            <button
              onClick={() => setActiveTab("crawl")}
              className={`landing-tab ${activeTab === "crawl" ? "active" : ""}`}
            >
              Crawl
            </button>
            <button
              onClick={() => setActiveTab("links")}
              className={`landing-tab ${activeTab === "links" ? "active" : ""}`}
            >
              Links
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}