import { useEffect } from "react";
import Footer from "../footer/footer";
import Playground from "./playground";
import Navbar from "../navbar/navbar";
import "../landing/landing.css";

export default function PlaygroundPage() {
  useEffect(() => {
    // Playground page does not support dark theme; force light mode on mount
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
      <Navbar activePage="playground" />

      {/* Main Playground Content */}
      <Playground />

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}
