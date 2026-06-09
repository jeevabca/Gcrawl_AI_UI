import { useState, useEffect } from "react";
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

import MapPopup from "./map/mappopup";
import MapUI from "./map/map";
import ImageGallery from "./images/image";
import SeoViewer from "./seo/seo";
import SearchPopup from "./search/searchpopup";
import SearchUI from "./search/search";
import CrawlPopup from "./crawl/crawlpopup";
import FormatPopup from "./formatpopup";
import ProxyPopup, { getCountryInfo } from "./proxypopup";
import usePlayground from "./usePlayground";
import type { PlaygroundProps } from "./usePlayground";
import { getHostname } from "../../../utils/helper";
import Loader from "../../../components/loader/playground_loader";

interface PageResultCardProps {
  page: any;
  index: number;
  submittedUrl: string;
  getHostname: (url: string) => string;
}

function PageResultCard({ page, index, submittedUrl, getHostname }: PageResultCardProps) {
  // Determine available tabs
  const availableTabs: string[] = [];
  if (page.markdown_content || page.markdown) availableTabs.push("Markdown");
  if (page.html_content || page.html) availableTabs.push("HTML");
  if (page.screenshot_s3_url || page.screenshot) availableTabs.push("Screenshot");
  if (page.links) availableTabs.push("Links");
  if (page.images_json || page.images) availableTabs.push("Images");
  if (page.seo_json || page.seo || page.seo_md || page.seo_xlsx_s3_url) availableTabs.push("SEO");
  availableTabs.push("JSON"); // JSON is always available

  const [activeTab, setActiveTab] = useState<string>(availableTabs[0] || "JSON");
  const [hasManuallySelected, setHasManuallySelected] = useState(false);

  useEffect(() => {
    if (!hasManuallySelected && availableTabs.length > 0) {
      const preferredTab = availableTabs.find(tab => tab !== "JSON") || "JSON";
      if (activeTab !== preferredTab) {
        setActiveTab(preferredTab);
      }
    }
  }, [availableTabs.join(","), hasManuallySelected]);

  // Get active content
  const getTabContent = () => {
    switch (activeTab) {
      case "Markdown":
        return page.markdown_content || page.markdown || "";
      case "HTML":
        return page.html_content || page.html || "";
      case "Screenshot":
        return page.screenshot_s3_url || page.screenshot || "";
      case "Links":
        return typeof page.links === "object" ? JSON.stringify(page.links, null, 2) : (page.links || "");
      case "Images":
        return typeof page.images_json === "object" ? JSON.stringify(page.images_json, null, 2) : (page.images || "");
      case "SEO":
        return typeof page.seo_json === "object" ? JSON.stringify(page.seo_json, null, 2) : (page.seo || "");
      case "JSON":
      default:
        return JSON.stringify(page, null, 2);
    }
  };

  const handleCopy = () => {
    const content = getTabContent();
    if (content) {
      navigator.clipboard.writeText(content);
      toast.success(`Copied ${activeTab} to clipboard!`);
    }
  };

  const handleDownloadMarkdown = () => {
    const md = page.markdown_content || page.markdown;
    if (!md) {
      toast.error("No markdown content available to download.");
      return;
    }
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${getHostname(submittedUrl)}_page_${index}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Markdown file downloaded!");
  };

  // Check if SEO is the only real content (no markdown, html, screenshot, images, links)
  const hasSeoData = page.seo_json || page.seo || page.seo_md || page.seo_xlsx_s3_url;
  const hasOtherContent = (page.markdown_content || page.markdown) ||
    (page.html_content || page.html) ||
    (page.screenshot_s3_url || page.screenshot) ||
    page.links ||
    (page.images_json || page.images);
  const isSeoOnly = hasSeoData && !hasOtherContent;

  // If SEO is the only content, render SeoViewer directly without outer tabs
  if (isSeoOnly) {
    return (
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #f0f0f0',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        marginBottom: '24px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f9fafb' }}>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 600, color: '#111827', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#f97316', fontWeight: 700 }}>#{index}</span>
            <span>{page.title || page.start_url || `Page ${index}`}</span>
          </h3>
          <div style={{ fontSize: '13px', color: '#9ca3af', fontFamily: 'monospace' }}>
            {page.url || page.start_url || submittedUrl}
          </div>
        </div>

        {/* SEO Viewer directly */}
        <div style={{ padding: '20px 24px', backgroundColor: '#ffffff' }}>
          <SeoViewer page={page} />
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #f0f0f0',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      marginBottom: '24px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #f9fafb' }}>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 600, color: '#111827', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: '#f97316', fontWeight: 700 }}>#{index}</span>
          <span>{page.title || page.start_url || `Page ${index}`}</span>
        </h3>
        <div style={{ fontSize: '13px', color: '#9ca3af', fontFamily: 'monospace' }}>
          {page.url || page.start_url || submittedUrl}
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        padding: '0 24px',
        backgroundColor: '#fafafa',
        borderBottom: '1px solid #e5e7eb',
        gap: '16px'
      }}>
        {availableTabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setHasManuallySelected(true);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '12px 4px',
                border: 'none',
                borderBottom: isActive ? '2px solid var(--primary)' : '2px solid transparent',
                backgroundColor: 'transparent',
                fontSize: '14px',
                fontWeight: 600,
                color: isActive ? 'var(--primary)' : '#4b5563',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab === "Markdown" && <FaCode size={14} />}
              {tab === "HTML" && <FaRegFileCode size={14} />}
              {tab === "JSON" && <FiFile size={14} />}
              <span>{tab}</span>
            </button>
          );
        })}
      </div>

      {/* Content Display */}
      <div style={{ padding: '20px 24px', backgroundColor: '#ffffff', minHeight: '150px' }}>
        <div style={{
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          backgroundColor: '#ffffff',
          padding: '16px',
          maxHeight: '400px',
          overflowY: 'auto'
        }}>
          {activeTab === "Screenshot" ? (
            getTabContent() ? (
              <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <div style={{ maxWidth: '100%', maxHeight: '500px', overflow: 'auto', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  <img 
                    src={getTabContent()} 
                    alt="Screenshot" 
                    style={{ display: 'block', maxWidth: '100%', height: 'auto' }} 
                  />
                </div>
              </div>
            ) : (
              <div style={{ color: '#6b7280', fontSize: '13px' }}>No screenshot available</div>
            )
          ) : activeTab === "Images" ? (
            <ImageGallery page={page} />
          ) : activeTab === "SEO" ? (
            <SeoViewer page={page} />
          ) : (
            <pre style={{
              margin: 0,
              padding: 0,
              backgroundColor: 'transparent',
              color: '#374151',
              fontSize: '13px',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              overflowX: 'auto',
              whiteSpace: 'pre-wrap'
            }}>
              <code>{getTabContent()}</code>
            </pre>
          )}
        </div>
      </div>

      {/* Footer / Copy Button */}
      <div style={{
        padding: '12px 24px',
        borderTop: '1px solid #f3f4f6',
        backgroundColor: '#fafafa',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px'
      }}>
        {activeTab === "Markdown" && (
          <button
            onClick={handleDownloadMarkdown}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              padding: "6px 14px",
              fontSize: "13px",
              fontWeight: 600,
              color: "#374151",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
          >
            <FiDownload />
            <span>Download Markdown</span>
          </button>
        )}
        <button
          onClick={handleCopy}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "6px",
            padding: "6px 14px",
            fontSize: "13px",
            fontWeight: 600,
            color: "#374151",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
        >
          <FiCopy />
          <span>Copy as {activeTab}</span>
        </button>
      </div>
    </div>
  );
}

export default function Playground(props: PlaygroundProps = {}) {
  const {
    // Tab state
    activeTab,
    setActiveTab,
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
    showSearchPopup,
    setShowSearchPopup,

    // Search params
    searchLimit,
    setSearchLimit,

    // Map params
    mapLimit,
    setMapLimit,
    mapSameDomainOnly,
    setMapSameDomainOnly,
    mapIncludeSubdomains,
    setMapIncludeSubdomains,
    setMapProxyGeo,

    // Crawl params
    crawlMaxPages,
    setCrawlMaxPages,
    crawlSameDomainOnly,
    setCrawlSameDomainOnly,
    crawlIncludeSubdomains,
    setCrawlIncludeSubdomains,
    showCrawlPopup,
    setShowCrawlPopup,

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
    isLoading,

    // Derived helpers
    getActivePage,
    getButtonText,

    // Actions
    handleRunAction,

    // Props
    hideHeader,
    isLanding,
    submittedUrl,
  } = usePlayground(props);



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
        {!isLanding && (
          <div className="pill-labels-container">
            <span className="pill-label pill-group-discover">DISCOVER</span>
            <span className="pill-label pill-group-extract">EXTRACT</span>
            <span className="pill-label pill-group-crawl">CRAWL</span>
          </div>
        )}

        {/* Custom Dashboard Header when in Dashboard */}
        {hideHeader && !isLanding && (
          <div className="dashboard-heading-section" style={{ marginBottom: "20px" }}>
            <h1 className="dashboard-title" style={{ textTransform: "capitalize" }}>
              {activeTab === "search" ? "Search the web" :
                activeTab === "scrape" ? "Scrape a web page" :
                    activeTab === "map" ? "Map website links" :
                      "Crawl entire website"}
            </h1>
            <p className="dashboard-subtitle">
              {activeTab === "search" ? "Search the web using a text query." :
                activeTab === "scrape" ? "Scrape and convert any URL into clean structured LLM-ready data." :
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
              {activeTab !== "scrape" && (
                <button
                  className={`control-square-btn ${activeTab === "map" ? (showMapPopup ? "active" : "") : activeTab === "search" ? (showSearchPopup ? "active" : "") : activeTab === "crawl" ? (showCrawlPopup ? "active" : "") : (showSettings ? "active" : "")}`}
                  onClick={() => {
                    if (activeTab === "map") {
                      setShowMapPopup(!showMapPopup);
                    } else if (activeTab === "search") {
                      setShowSearchPopup(!showSearchPopup);
                    } else if (activeTab === "crawl") {
                      setShowCrawlPopup(!showCrawlPopup);
                    } else {
                      setShowSettings(!showSettings);
                    }
                  }}
                  title="Advanced Settings"
                  disabled={isLoading}
                >
                  <FiSliders /> {/* filter */}
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
                setProxyGeo={setMapProxyGeo}
              />

              <SearchPopup
                isOpen={showSearchPopup}
                onClose={() => setShowSearchPopup(false)}
                limit={searchLimit}
                setLimit={setSearchLimit}
              />

              <CrawlPopup
                isOpen={showCrawlPopup}
                onClose={() => setShowCrawlPopup(false)}
                maxPages={crawlMaxPages}
                setMaxPages={setCrawlMaxPages}
                sameDomainOnly={crawlSameDomainOnly}
                setSameDomainOnly={setCrawlSameDomainOnly}
                includeSubdomains={crawlIncludeSubdomains}
                setIncludeSubdomains={setCrawlIncludeSubdomains}
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
          <div className="extraction-loading-indicator" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%" }}>
            <Loader />
            <div className="loading-details" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
              <div className="loading-main-label" style={{ fontSize: "16px", fontWeight: 700 }}>
                {activeTab === "crawl" ? "Crawling Site..." : 
                 activeTab === "search" ? "Searching the Web..." :
                 activeTab === "map" ? "Mapping Site Links..." : "Scraping URL..."}
              </div>
              <div className="loading-sub-log">Connecting to agent and running requested extraction formats...</div>
            </div>
          </div>
        )}

        {/* RESULTS CARD FEED */}
        {scrapedPages.length > 0 && !getActivePage()?.searchData && !getActivePage()?.links && (
          <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '160%', marginTop: '24px' }}>
            {scrapedPages.map((page, idx) => (
              <PageResultCard
                key={page.pageIndex ?? idx}
                page={page}
                index={idx + 1}
                submittedUrl={submittedUrl}
                getHostname={getHostname}
              />
            ))}
          </div>
        )}

        {/* MAP UI */}
        <MapUI
          scrapedPages={scrapedPages}
          isLoading={isLoading}
          getActivePage={getActivePage}
          getHostname={getHostname}
          submittedUrl={submittedUrl}
          isLanding={isLanding}
        />

        {/* SEARCH RESULTS UI */}
        <SearchUI
          scrapedPages={scrapedPages}
          isLoading={isLoading}
          getActivePage={getActivePage}
          getHostname={getHostname}
          setUrlInput={setUrlInput}
          setActiveTab={setActiveTab}
          isLanding={isLanding}
        />

      </div>
    </div>
  );
}
