import { useEffect } from "react";
import Footer from "../footer/footer";
import Navbar from "../navbar/navbar";
import Playground from "../playground/playground";
import "./landing.css";

export default function Landing() {
  useEffect(() => {
    // Ensure document does not have global dark-theme class
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("dark-theme");
    }
  }, []);

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

        {/* Beautiful Control Box powered by Playground */}
        <div className="landing-playground-wrapper" style={{ width: "100%", margin: "0 auto", paddingBottom: "100px", textAlign: "left" }}>
          <Playground hideHeader={true} isLanding={true} />
        </div>
      </main>
      <Footer />
    </div>
  );
}