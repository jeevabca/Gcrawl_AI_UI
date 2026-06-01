import { toast } from "react-hot-toast";
import "./playground.css";
import {
  FiSearch,
  FiFile,
  FiSliders,
  FiChevronDown,
  FiGlobe,
  FiCopy,
  FiDownload,
} from "react-icons/fi";
import { FaRegFileCode, FaBug, FaCode } from "react-icons/fa6";
import { LiaLinkSolid } from "react-icons/lia";

import MapPopup from "./mappopup";
import FormatPopup from "./formatpopup";
import ProxyPopup, { getCountryInfo } from "./proxypopup";
import usePlayground from "./usePlayground";
import type { PlaygroundProps } from "./usePlayground";

export default function Playground(props: PlaygroundProps = {}) {
  const {
    // Tab state
    activeTab,
    handleTabClick,

    // URL input
    urlInput,
    setUrlInput,

    // Format state
    selectedFormats,
    showFormatModal,
    setShowFormatModal,
    handleFormatClick,
    handleToggleFormat,

    // Proxy state
    showProxyModal,
    setShowProxyModal,
    handleProxyClick,
    proxyGeo,
    setProxyGeo,

    // Settings / popup state
    showSettings,
    setShowSettings,
    showMapPopup,
    setShowMapPopup,

    // Map params
    mapLimit,
    setMapLimit,
    mapSameDomainOnly,
    setMapSameDomainOnly,
    mapIncludeSubdomains,
    setMapIncludeSubdomains,
    mapProxyGeo,
    setMapProxyGeo,

    // Rendering params
    jsRender,
    setJsRender,
    renderTimeout,
    setRenderTimeout,
    autoScroll,
    setAutoScroll,
    scrollDelay,
    setScrollDelay,
    maxScrolls,
    setMaxScrolls,

    // Markdown params
    markdownClean,
    setMarkdownClean,

    // HTML params
    htmlClean,
    setHtmlClean,
    removeExternalLinks,
    setRemoveExternalLinks,
    relativeToAbsoluteLinks,
    setRelativeToAbsoluteLinks,
    removeDataImages,
    setRemoveDataImages,
    ignoreTags,
    setIgnoreTags,

    // Screenshot params
    screenshotFullPage,
    setScreenshotFullPage,
    screenshotFormat,
    setScreenshotFormat,
    screenshotQuality,
    setScreenshotQuality,

    // Result state
    scrapedPages,
    activeResultTab,
    setActiveResultTab,
    isLoading,

    // Derived helpers
    getActivePage,
    getActiveTabContent,
    getButtonText,

    // Actions
    handleRunAction,

    // Props
    hideHeader,
    submittedUrl,
  } = usePlayground(props);

  // Helper to extract hostname for favicon
  const getHostname = (url: string) => {
    try {
      const u = url.startsWith("http") ? url : `https://${url}`;
      return new URL(u).hostname;
    } catch (e) {
      return "example.com";
    }
  };

  const handleDownloadMarkdown = () => {
    const page = getActivePage();
    if (!page || !page.markdown) {
      toast.error("No markdown content available to download.");
      return;
    }
    const blob = new Blob([page.markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${getHostname(submittedUrl)}_page_${page.pageIndex + 1}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Markdown file downloaded!");
  };

  /* -------------------------------------------------------------------------- */
  /*                          RENDER RESULT CONTENT                             */
  /* -------------------------------------------------------------------------- */

  const renderResultTabContent = () => {
    const page = getActivePage();
    if (!page) return null;

    if (activeResultTab === "Screenshot") {
      const screenshotVal = page.screenshot;
      if (screenshotVal && typeof screenshotVal === "string") {
        let imgSrc = screenshotVal;

        // Already a valid data URI — use as-is
        if (!imgSrc.startsWith("data:")) {
          // If it's a URL (http/https), use directly
          if (imgSrc.startsWith("http")) {
            // imgSrc stays as URL
          } else {
            // Raw base64 — detect JPEG vs PNG from data header and build data URI
            const mime = imgSrc.startsWith("/9j/")
              ? "image/jpeg"
              : `image/${screenshotFormat === "jpg" ? "jpeg" : screenshotFormat}`;
            imgSrc = `data:${mime};base64,${imgSrc}`;
          }
        }

        return (
          <div style={{ display: "flex", justifyContent: "center", padding: "10px" }}>
            <img
              src={imgSrc}
              alt="Page Screenshot"
              onError={(e) => {
                console.error("Screenshot image failed to load", e);
                (e.target as HTMLImageElement).style.display = "none";
              }}
              style={{
                maxWidth: "100%",
                borderRadius: "8px",
                border: "1px solid #374151",
                boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
              }}
            />
          </div>
        );
      }
      return (
        <pre className="results-code-block">
          <code>Screenshot data not available.</code>
        </pre>
      );
    }

    const content = getActiveTabContent();
    return (
      <pre className="results-code-block">
        <code>{content}</code>
      </pre>
    );
  };

  /* -------------------------------------------------------------------------- */
  /*                                   JSX                                      */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="playground-container" style={hideHeader ? { padding: 0, minHeight: "auto", background: "transparent" } : {}}>
      {/* Decorative Grid Lines Background */}
      {!hideHeader && (
        <div className="grid-layer">
          <div className="grid-h"></div>
          <div className="grid-v grid-v-left"></div>
          <div className="grid-v grid-v-right"></div>
        </div>
      )}

      {/* Background Subtle Art Graphic */}
      {!hideHeader && (
        <>
          <div className="decor-art left-art">
            <pre>{`
      .           .
     .::.       .::.
    .::::.     .::::.
      ::         ::
      ::         ::
      ::         ::
    `}</pre>
          </div>
          <div className="decor-art right-art">
            <pre>{`
          *
         ***
        *****
       *******
         ***
         ***
    `}</pre>
          </div>
        </>
      )}

      {/* Main Header / Banner Section */}
      {!hideHeader && (
        <div className="playground-banner">
          <div className="banner-grid-cell left-cell"></div>
          <div className="banner-grid-cell center-cell">
            <h1 className="playground-main-title">Playground</h1>
            <p className="playground-subtitle">API, Docs and Playground - all in one place</p>
          </div>
          <div className="banner-grid-cell right-cell"></div>
        </div>
      )}

      <div className="playground-content-section" style={hideHeader ? { marginTop: 0, paddingTop: 0 } : {}}>
        {/* Category Pill Labels */}
        <div className="pill-labels-container">
          <span className="pill-label pill-group-discover">DISCOVER</span>
          <span className="pill-label pill-group-extract">EXTRACT</span>
          <span className="pill-label pill-group-crawl">CRAWL</span>
        </div>

        {/* Custom Dashboard Header when in Dashboard */}
        {hideHeader && (
          <div className="dashboard-heading-section" style={{ marginBottom: "20px" }}>
            <h1 className="dashboard-title" style={{ textTransform: "capitalize" }}>
              {activeTab === "search" ? "Search the web" :
                activeTab === "scrape" ? "Scrape a web page" :
                  activeTab === "parse" ? "Parse a file" :
                    activeTab === "map" ? "Map website links" :
                      "Crawl entire website"}
            </h1>
            <p className="dashboard-subtitle">
              {activeTab === "search" ? "Search the web using a text query." :
                activeTab === "scrape" ? "Scrape and convert any URL into clean structured LLM-ready data." :
                  activeTab === "parse" ? "Parse PDFs, documents, spreadsheet data, and static files securely." :
                    activeTab === "map" ? "Map out and index all accessible links in a site in seconds." :
                      "Recursively crawl all pages in a domain and extract clean structured datasets."}
            </p>
          </div>
        )}

        {/* Dynamic Nav Tabs Pill */}
        <div className="tab-pill-bar">
          <div className="tab-wrapper">
            <button
              className={`pill-tab ${activeTab === "search" ? "active" : ""}`}
              onClick={() => handleTabClick("search")}
            >
              <FiSearch className={`tab-icon ${activeTab === "search" ? "active" : ""}`} />
              Search
            </button>
            <div className="tab-tooltip">
              Search the web using a text query.
            </div>
          </div>

          <div className="pill-divider" />

          <div className="tab-wrapper">
            <button
              className={`pill-tab ${activeTab === "scrape" ? "active" : ""}`}
              onClick={() => handleTabClick("scrape")}
            >
              <FaRegFileCode className={`tab-icon ${activeTab === "scrape" ? "active" : ""}`} />
              Scrape
            </button>
            <div className="tab-tooltip">
              Scrapes only the specified URL without scrapping subpages. Outputs the content from the page.
            </div>
          </div>

          <div className="tab-wrapper">
            <button
              className={`pill-tab ${activeTab === "parse" ? "active" : ""}`}
              onClick={() => handleTabClick("parse")}
            >
              <FaCode className={`tab-icon ${activeTab === "parse" ? "active" : ""}`} />
              Parse

            </button>
            <div className="tab-tooltip">
              Upload a PDF, DOCX, XLSX, or HTML file and get clean markdown. Powered by /parse.
            </div>
          </div>

          <div className="pill-divider" />

          <div className="tab-wrapper">
            <button
              className={`pill-tab ${activeTab === "map" ? "active" : ""}`}
              onClick={() => handleTabClick("map")}
            >
              <LiaLinkSolid className={`tab-icon ${activeTab === "map" ? "active" : ""}`} />
              Map
            </button>
            <div className="tab-tooltip">
              Attempts to output all websites URLs in a few seconds.
            </div>
          </div>

          <div className="tab-wrapper">
            <button
              className={`pill-tab ${activeTab === "crawl" ? "active" : ""}`}
              onClick={() => handleTabClick("crawl")}
            >
              <FaBug className={`tab-icon ${activeTab === "crawl" ? "active" : ""}`} />
              Crawl
            </button>
            <div className="tab-tooltip">
              Crawls a URL and all its accessible subpages, outputting the content from each page.
            </div>
          </div>
        </div>

        {/* Premium Control Card Panel */}
        <div className="playground-card" style={hideHeader ? { border: "1px solid var(--border)", background: "var(--bg-card)", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)" } : {}}>
          {/* Top Row: Input URL */}
          <div className="card-input-row">
            {activeTab !== "search" && <span className="protocol-pill">https://</span>}
            <input
              type="text"
              className="url-text-input"
              placeholder={activeTab === "search" ? "Enter the search query" : "example.com"}
              value={urlInput}
              onChange={(e) => {
                let val = e.target.value;
                if (activeTab !== "search") {
                  val = val.replace(/^(https?:\/\/)/i, "");
                }
                setUrlInput(val);
              }}
              onKeyDown={(e) => e.key === "Enter" && !isLoading && handleRunAction()}
              disabled={isLoading}
            />
          </div>

          {/* Bottom Control Row */}

          
          <div className="card-controls-row">
            <div className="controls-left-group" style={{ position: "relative" }}>
              {/* Settings Toggle Sliders */}
              {activeTab !== "scrape" && activeTab !== "crawl" && (
                <button
                  className={`control-square-btn ${activeTab === "map" ? (showMapPopup ? "active" : "") : (showSettings ? "active" : "")}`}
                  onClick={() => {
                    if (activeTab === "map") {
                      setShowMapPopup(!showMapPopup);
                    } else {
                      setShowSettings(!showSettings);
                    }
                  }}
                  title="Advanced Settings"
                  disabled={isLoading}
                >
                  <FiSliders />
                </button>
              )}

              <MapPopup
                isOpen={showMapPopup}
                onClose={() => setShowMapPopup(false)}
                limit={mapLimit}
                setLimit={setMapLimit}
                sameDomainOnly={mapSameDomainOnly}
                setSameDomainOnly={setMapSameDomainOnly}
                includeSubdomains={mapIncludeSubdomains}
                setIncludeSubdomains={setMapIncludeSubdomains}
                proxyGeo={mapProxyGeo}
                setProxyGeo={setMapProxyGeo}
              />

              {/* Format Dropdown Selector */}
              
              <div className="format-dropdown-wrapper">
                {activeTab !== "search" && activeTab !== "map" && (
                  <button
                    className={`format-picker-btn ${showFormatModal ? "focused" : ""}`}
                    onClick={handleFormatClick}
                    disabled={isLoading}
                  >
                    <FiFile style={{ marginRight: "6px" }} />
                    <span className="format-label-text">Format:</span>
                    <span className="format-value-text">
                      {selectedFormats.length === 0 ? selectedFormats[0] : selectedFormats.length}
                    </span>
                    <FiChevronDown />
                  </button>
                )}

                <FormatPopup
                  isOpen={showFormatModal}
                  onClose={() => setShowFormatModal(false)}
                  selectedFormats={selectedFormats}
                  onToggleFormat={handleToggleFormat}
                  jsRender={jsRender}
                  setJsRender={setJsRender}
                  renderTimeout={renderTimeout}
                  setRenderTimeout={setRenderTimeout}
                  autoScroll={autoScroll}
                  setAutoScroll={setAutoScroll}
                  scrollDelay={scrollDelay}
                  setScrollDelay={setScrollDelay}
                  maxScrolls={maxScrolls}
                  setMaxScrolls={setMaxScrolls}
                  markdownClean={markdownClean}
                  setMarkdownClean={setMarkdownClean}
                  htmlClean={htmlClean}
                  setHtmlClean={setHtmlClean}
                  removeExternalLinks={removeExternalLinks}
                  setRemoveExternalLinks={setRemoveExternalLinks}
                  relativeToAbsoluteLinks={relativeToAbsoluteLinks}
                  setRelativeToAbsoluteLinks={setRelativeToAbsoluteLinks}
                  removeDataImages={removeDataImages}
                  setRemoveDataImages={setRemoveDataImages}
                  ignoreTags={ignoreTags}
                  setIgnoreTags={setIgnoreTags}
                  screenshotFullPage={screenshotFullPage}
                  setScreenshotFullPage={setScreenshotFullPage}
                  screenshotFormat={screenshotFormat}
                  setScreenshotFormat={setScreenshotFormat}
                  screenshotQuality={screenshotQuality}
                  setScreenshotQuality={setScreenshotQuality}
                />
              </div>

              {/* Proxy Dropdown Selector */}
              {(activeTab === "scrape" || activeTab === "crawl" || activeTab === "map") && (
                <div className="proxy-dropdown-wrapper">
                  <button
                    className={`proxy-picker-btn ${showProxyModal ? "focused" : ""}`}
                    onClick={handleProxyClick}
                    disabled={isLoading}
                  >
                    <FiGlobe style={{ marginRight: "6px" }} />
                    <span className="format-label-text">Country:</span>
                    <span className="format-value-text" style={{ marginLeft: "4px" }}>
                      {getCountryInfo(proxyGeo).emoji} {getCountryInfo(proxyGeo).name}
                    </span>
                    <FiChevronDown style={{ marginLeft: "4px" }} />
                  </button>

                  <ProxyPopup
                    isOpen={showProxyModal}
                    onClose={() => setShowProxyModal(false)}
                    proxyGeo={proxyGeo}
                    setProxyGeo={setProxyGeo}
                  />
                </div>
              )}
            </div>

            <div className="controls-right-group">
              <button
                className="action-trigger-btn"
                onClick={handleRunAction}
                disabled={isLoading}
                style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}
              >
                {getButtonText()}
              </button>
            </div>
          </div>

        </div>

        {/* LOADING INDICATOR */}
        {isLoading && (
          <div className="extraction-loading-indicator" style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div className="loading-spinner-circle"></div>
              <div className="loading-details">
                <div className="loading-main-label">
                  {activeTab === "crawl" ? "Crawling Site..." : "Scraping URL..."}
                </div>
                <div className="loading-sub-log">Connecting to agent and running requested extraction formats...</div>
              </div>
            </div>
            
          </div>
        )}

        {/* RESULTS CARD PANEL */}
        {scrapedPages.length > 0 && !isLoading && (
          <div className="extraction-results-wrapper animate-slide-up">
            
            {/* New Firecrawl-like Header Design */}
            <div className="results-header-container" style={{ padding: '24px 24px 16px', borderBottom: '1px solid #f0f0f0', backgroundColor: '#ffffff', borderRadius: '16px 16px 0 0' }}>
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: 600, color: '#111827', display: 'flex', alignItems: 'center' }}>
                  {getActivePage()?.title || "Scraped Page Result"}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '14px' }}>
                  <img 
                    src={`https://www.google.com/s2/favicons?domain=${getHostname(submittedUrl)}&sz=32`} 
                    alt="favicon" 
                    style={{ width: 16, height: 16, borderRadius: '2px' }} 
                  />
                  <span>{submittedUrl}</span>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {/* Result Tabs for switching between formats */}
                  {selectedFormats.map(fmt => (
                    <button
                      key={fmt}
                      onClick={() => setActiveResultTab(fmt)}
                      style={{
                        padding: "6px 16px",
                        borderRadius: "20px",
                        border: activeResultTab === fmt ? "1px solid var(--primary)" : "1px solid #e5e7eb",
                        fontSize: "13px",
                        fontWeight: 600,
                        cursor: "pointer",
                        backgroundColor: activeResultTab === fmt ? "#fff5f0" : "#ffffff",
                        color: activeResultTab === fmt ? "var(--primary)" : "#4b5563",
                        transition: "all 0.2s ease"
                      }}
                    >
                      {fmt}
                    </button>
                  ))}
                  
                </div>
                
                <div style={{ display: 'flex', gap: '12px' }}>
                  {/* Download Markdown Button */}
                  {selectedFormats.includes("Markdown") && activeResultTab === "Markdown" && (
                    <button
                      onClick={handleDownloadMarkdown}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        background: "#f9fafb",
                        border: "1px solid #e5e7eb",
                        borderRadius: "6px",
                        padding: "6px 14px",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#374151",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
                    >
                      <FiDownload />
                      <span>Download Markdown</span>
                    </button>
                  )}

                  {/* Copy Button */}
                  <button
                    onClick={() => {
                      const content = getActiveTabContent();
                      if (content) {
                        navigator.clipboard.writeText(content);
                        toast.success("Copied to clipboard!");
                      }
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      background: "#f9fafb",
                      border: "1px solid #e5e7eb",
                      borderRadius: "6px",
                      padding: "6px 14px",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#374151",
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
                  >
                    <FiCopy />
                    <span>Copy</span>
                  </button>
                </div>
              </div>
            </div>
        

            <div className="results-viewer-container">
              {renderResultTabContent()}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
