import { useState } from "react";
import { toast } from "react-hot-toast";
import { FiCopy, FiDownload, FiLink, FiCode } from "react-icons/fi";
import "./map.css";
import type { ScrapedPage } from "../usePlayground";

interface MapUIProps {
  scrapedPages: ScrapedPage[];
  isLoading: boolean;
  getActivePage: () => ScrapedPage | null;
  getHostname: (url: string) => string;
  submittedUrl: string;
}

export default function MapUI({
  scrapedPages,
  isLoading,
  getActivePage,
  getHostname,
  submittedUrl
}: MapUIProps) {
  const activePage = getActivePage();
  const linksData = activePage?.links;
  const [activeTab, setActiveTab] = useState<"links" | "json">("links");

  if (scrapedPages.length === 0 || isLoading || !linksData) {
    return null;
  }

  // Extract URLs list
  const getUrlsList = (): string[] => {
    if (!linksData) return [];

    // If it's already an array
    if (Array.isArray(linksData)) {
      return linksData;
    }

    // If it's a string, try to parse it
    if (typeof linksData === "string") {
      try {
        const parsed = JSON.parse(linksData);
        if (Array.isArray(parsed)) {
          return parsed;
        }
        if (parsed && typeof parsed === "object") {
          if (Array.isArray(parsed.links)) {
            return parsed.links;
          }
          if (Array.isArray(parsed.urls)) {
            return parsed.urls;
          }
          if (Array.isArray(parsed.data)) {
            return parsed.data;
          }
        }
      } catch (e) {
        // Not a JSON string or failed parsing
      }

      // Fallback: split by newlines
      return linksData
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => {
          return line.length > 0 && !line.startsWith("[") && !line.startsWith("]") && !line.startsWith("{") && !line.startsWith("}");
        });
    }

    // If it is an object
    if (typeof linksData === "object") {
      const obj = linksData as any;
      if (Array.isArray(obj.links)) return obj.links;
      if (Array.isArray(obj.urls)) return obj.urls;
      if (Array.isArray(obj.data)) return obj.data;
    }

    return [];
  };

  const urls = getUrlsList();
  const urlCount = urls.length;
  const hostname = getHostname(submittedUrl);
  const displayDomain = hostname ? `${hostname}/` : "gramosoft.tech/";

  const jsonContent = typeof linksData === "object" 
    ? JSON.stringify(linksData, null, 2) 
    : (() => {
        try {
          return JSON.stringify(JSON.parse(linksData), null, 2);
        } catch {
          return linksData;
        }
      })();

  const handleDownload = () => {
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${hostname}_map.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Map JSON downloaded!");
  };

  const handleCopy = () => {
    if (activeTab === "links") {
      const linksString = urls.join("\n");
      navigator.clipboard.writeText(linksString);
      toast.success("URLs copied as a plain text string!");
    } else {
      navigator.clipboard.writeText(jsonContent);
      toast.success("JSON copied to clipboard!");
    }
  };
  return (
    <div className="map-results-wrapper animate-slide-up">
      {/* Top Header Bar */}
      <div className="map-top-bar">

          <img 
            src={`https://www.google.com/s2/favicons?domain=${getHostname(submittedUrl || "")}&sz=32`} 
            alt="favicon" 
            className="search-item-favicon"
            style={{ opacity: submittedUrl ? 1 : 0 }} 
          />
          <span className="map-brand-domain">{displayDomain}</span>
    
      </div>

      {/* Main Info Section */}
      <div className="map-info-section">
        <div className="map-info-left">
          <h2 className="map-display-domain">{displayDomain}</h2>
          <span className="map-url-count">{urlCount} URLs</span>
        </div>
        <div className="map-info-actions">      
          <button className="map-action-btn primary" onClick={handleDownload}>
            <FiDownload /> JSON
          </button>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="map-tabs-container">
        <button 
          className={`map-tab-btn ${activeTab === "links" ? "active" : ""}`}
          onClick={() => setActiveTab("links")}
        >
          <FiLink className="tab-icon-orange" /> Links
        </button>
        <button 
          className={`map-tab-btn ${activeTab === "json" ? "active" : ""}`}
          onClick={() => setActiveTab("json")}
        >
          <FiCode /> JSON
        </button>
      </div>

      {/* Content Area */}
      <div className="map-content-container">
        {activeTab === "links" ? (
          <div className="map-editor-view">
            {urls.map((url, idx) => (
              <div key={idx} className="map-editor-row">
                <span className="map-row-number">{idx + 1}</span>
                <span className="map-row-content">{url}</span>
              </div>
            ))}
            {urls.length === 0 && (
              <div className="map-empty-state">No links found.</div>
            )}
          </div>
        ) : (
          <pre className="map-json-view">
            <code>{jsonContent}</code>
          </pre>
        )}
      </div>

      {/* Footer bar */}
      <div className="map-footer-bar">
        <button className="map-copy-string-btn" onClick={handleCopy}>
          <FiCopy /> {activeTab === "links" ? "Copy as string" : "Copy JSON"}
        </button>
      </div>
    </div>
  );
}
