/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import useAxios from "../../../services";
import { useWebSocket } from "./websocket";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

export type TabType = "search" | "scrape" | "map" | "crawl";
export type FormatType = "Markdown" | "HTML" | "Screenshot" | "Images" | "SEO";

export interface ScrapedPage {
  pageIndex: number;
  title?: string;
  markdown?: string;
  html?: string;
  screenshot?: string;
  seo?: string;
  seo_md?: string;
  seo_json?: any;
  seo_xlsx_s3_url?: string;
  images?: string;
  links?: string;
  searchData?: any;
  [key: string]: any;
}

export interface PlaygroundProps {
  initialTab?: TabType;
  hideHeader?: boolean;
  isLanding?: boolean;
  onTabChange?: (tab: TabType) => void;
}

/* -------------------------------------------------------------------------- */
/*                              HELPER UTILITIES                              */
/* -------------------------------------------------------------------------- */



/* -------------------------------------------------------------------------- */
/*                               CUSTOM HOOK                                  */
/* -------------------------------------------------------------------------- */

export default function usePlayground({
  initialTab,
  hideHeader = false,
  isLanding = false,
  onTabChange,
}: PlaygroundProps = {}) {
  const location = useLocation();
  const stateTab = location.state?.tab as TabType;
  const stateUrl = location.state?.url as string;

  /* ---- Tab & URL state ---- */
  const [activeTab, setActiveTab] = useState<TabType>(
    stateTab || initialTab || "scrape"
  );
  const [urlInput, setUrlInput] = useState(
    stateUrl ? stateUrl.replace(/^(https?:\/\/)/i, "") : ""
  );

  /* ---- Format & popup state ---- */
  const [selectedFormats, setSelectedFormats] = useState<FormatType[]>([
    "Markdown",
  ]);
  const [showFormatModal, setShowFormatModal] = useState(false);
  const [showProxyModal, setShowProxyModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMapPopup, setShowMapPopup] = useState(false);
  const [showSearchPopup, setShowSearchPopup] = useState(false);

  /* ---- Search params ---- */
  const [searchLimit, setSearchLimit] = useState(10);

  /* ---- Map params ---- */
  const [mapLimit, setMapLimit] = useState(70);
  const [mapSameDomainOnly, setMapSameDomainOnly] = useState(false);
  const [mapIncludeSubdomains, setMapIncludeSubdomains] = useState(false);
  const [mapProxyGeo, setMapProxyGeo] = useState("IN");

  /* ---- Crawl params ---- */
  const [crawlMaxPages, setCrawlMaxPages] = useState(10);
  const [crawlSameDomainOnly, setCrawlSameDomainOnly] = useState(true);
  const [crawlIncludeSubdomains, setCrawlIncludeSubdomains] = useState(false);
  const [showCrawlPopup, setShowCrawlPopup] = useState(false);

  /* ---- Scrape / Crawl params ---- */
  const [proxyGeo, setProxyGeo] = useState("default");
  const [jsRender, setJsRender] = useState(false);
  const [renderTimeout, setRenderTimeout] = useState(20000);
  const [autoScroll, setAutoScroll] = useState(true);
  const [scrollDelay, setScrollDelay] = useState(500);
  const [maxScrolls, setMaxScrolls] = useState(3);

  const [markdownClean, setMarkdownClean] = useState(true);

  const [htmlClean, setHtmlClean] = useState(true);
  const [removeExternalLinks, setRemoveExternalLinks] = useState(false);
  const [relativeToAbsoluteLinks, setRelativeToAbsoluteLinks] = useState(true);
  const [removeDataImages, setRemoveDataImages] = useState(false);
  const [ignoreTags, setIgnoreTags] = useState<string[]>([
    "header",
    "footer",
    "nav",
    "form",
    "iframe",
    ".hidden",
  ]);

  const [screenshotFullPage, setScreenshotFullPage] = useState(true);
  const [screenshotFormat, setScreenshotFormat] = useState<"jpg" | "png">(
    "jpg"
  );
  const [screenshotQuality, setScreenshotQuality] = useState(90);

  /* ---- Result state ---- */
  const [scrapedPages, setScrapedPages] = useState<ScrapedPage[]>([]);
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [activeResultTab, setActiveResultTab] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [submittedUrl, setSubmittedUrl] = useState<string>("");

  /* ---- Refs ---- */
  const pollingActiveRef = useRef(false);

  /* ---- API hooks ---- */
  const [scrapeRequest] = useAxios<any, any>({
    endpoint: "SCRAPE",
    successMsg: "Scraped successfully!",
    showSuccessMsg: false,
  });

  const [crawlRequest] = useAxios<any, any>({
    endpoint: "CRAWL",
    successMsg: "Crawling job registered!",
    showSuccessMsg: true,
  });

   const [MapRequest] = useAxios<any, any>({
    endpoint: "MAP",
    successMsg: "Map registered!",
    showSuccessMsg: true,
  });

  const [searchRequest] = useAxios<any, any>({
    endpoint: "SEARCH",
    successMsg: "Search registered!",
    showSuccessMsg: true,
  });

  // const [getContent] = useAxios<any, any>({
  //   endpoint: "GET_CRAWL_CONTENT",
  //   hideErrorMsg: true,
  // });


  const ChooseUrl = (name : string) =>{
   switch(name){
    case "scrape":
      return scrapeRequest;
    case "crawl":
      return crawlRequest;
    case "map":
      return MapRequest;
    case "search":
      return searchRequest;
   }
  }

  /* -------------------------------------------------------------------------- */
  /*                                  LOGGING                                   */
  /* -------------------------------------------------------------------------- */

  const addLog = useCallback((msg: string) => {
    console.log(`[LOG] ${msg}`);
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                             DERIVED GETTERS                                */
  /* -------------------------------------------------------------------------- */

  const getActivePage = (): ScrapedPage | null => {
    if (scrapedPages.length === 0) return null;
    return (
      scrapedPages.find((p) => p.pageIndex === activePageIndex) ||
      scrapedPages[0]
    );
  };

  const getActiveTabContent = () => {
    const page = getActivePage();
    if (!page) return "";
    const key = activeResultTab.toLowerCase();
    if (activeResultTab === "Links") return page.links || "";
    if (activeResultTab === "Search") return page.search || "";
    if (activeResultTab === "SEO") return page.seo || "";
    if (activeResultTab === "Images") return page.images || "";

    const val = page[key];
    if (typeof val === "object") return JSON.stringify(val, null, 2);
    return val || "";
  };

  const getButtonText = () => {
    if (isLoading) return "Scraping...";
    switch (activeTab) {
      case "search":
        return "Start search";
      case "scrape":
        return "Start scraping";
      case "map":
        return "Generate map";
      case "crawl":
        return "Start crawling";
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                             SYNC EFFECTS                                   */
  /* -------------------------------------------------------------------------- */

  // Sync tab with initialTab prop or router state when they change
  useEffect(() => {
    if (stateTab) {
      setActiveTab(stateTab);
    } else if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [stateTab, initialTab]);

  // Sync URL with router state when it changes
  useEffect(() => {
    if (stateUrl) {
      setUrlInput(stateUrl.replace(/^(https?:\/\/)/i, ""));
    }
  }, [stateUrl]);

  // Close formats and map popup on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".format-dropdown-wrapper")) {
        setShowFormatModal(false);
      }
      if (!target.closest(".proxy-dropdown-wrapper")) {
        setShowProxyModal(false);
      }
      if (
        !target.closest(".control-square-btn") &&
        !target.closest(".map-popup-card") &&
        !target.closest(".search-popup-card")
      ) {
        setShowMapPopup(false);
        setShowSearchPopup(false);
      }
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                             EVENT HANDLERS                                 */
  /* -------------------------------------------------------------------------- */

  const handleTabClick = (tab: TabType) => {
    if (activeTab !== tab) {
      setUrlInput("");
    }
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  const handleFormatClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowFormatModal(!showFormatModal);
  };

  const handleProxyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowProxyModal(!showProxyModal);
  };

  const handleToggleFormat = (fmt: FormatType) => {
    setSelectedFormats((prev) => {
      if (prev.includes(fmt)) {
        return prev.filter((f) => f !== fmt);
      } else {
        return [...prev, fmt];
      }
    });
  };

  /* -------------------------------------------------------------------------- */
  /*                         DATA FETCHING / WEBSOCKET                          */
  /* -------------------------------------------------------------------------- */

  /** Store inline content directly into scrapedPages state. */
  const storeInlineContent = (
    content: string,
    type: string,
    pageIndex: number
  ) => {
    setScrapedPages((prev) => {
      return prev
        .map((p) => {
          if (p.pageIndex === pageIndex) {
            return { ...p, [type]: content };
          }
          return p;
        })
        .concat(
          prev.some((p) => p.pageIndex === pageIndex)
            ? []
            : [{ pageIndex, title: `Page ${pageIndex + 1}`, [type]: content }]
        )
        .sort((a, b) => a.pageIndex - b.pageIndex);
    });

    // Auto-select the result tab
    setActiveResultTab((prev) => {
      if (prev) return prev;
      if (type === "links") return "Links";
      const match = selectedFormats.find(
        (fmt) =>
          fmt.toLowerCase() === type ||
          (fmt === "SEO" && type === "seo") ||
          (fmt === "Images" && type === "images")
      );
      return match || prev;
    });
  };

  /* ---- WEBSOCKET HOOK ---- */
  const { startWebSocket } = useWebSocket({
    addLog,
    setScrapedPages,
    storeInlineContent,
    setIsLoading,
  });

  /* -------------------------------------------------------------------------- */
  /*                             MAIN RUN ACTION                                */
  /* -------------------------------------------------------------------------- */

  const links = ["map"]
  const proxy =["map","crawl", "scrape"]
  const All = ["scrape","crawl"]
  const handleRunAction = () => {
    if (!urlInput.trim()) {
      toast("Please enter a URL to analyze!", { icon: "⚠️" });
      return;
    }
    setIsLoading(true);
    setScrapedPages([]);
    setActiveResultTab("");
    pollingActiveRef.current = false; 
    const finalUrl = urlInput.startsWith("http") ? urlInput : `https://${urlInput}`;
    setSubmittedUrl(finalUrl);
    addLog(`Initiating request: ${urlInput}...`);

    if (activeTab === "search") {
      searchRequest({
        data: {
          query: urlInput,
          limit: searchLimit
        }
      })
        .then((res) => {
          const data = res?.data || res;
          const searchResultPage: ScrapedPage = {
            pageIndex: 0,
            title: `Search Results for "${urlInput}"`,
            markdown: typeof data === "object" ? JSON.stringify(data, null, 2) : String(data),
            searchData: Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : data?.results || []),
          };
          setScrapedPages([searchResultPage]);
          setActiveResultTab(selectedFormats.includes("Markdown") ? "Markdown" : selectedFormats[0] || "Markdown");
          setIsLoading(false);
          addLog("Search completed successfully.");
        })
        .catch((err) => {
          console.error("Search failed", err);
          toast.error("Search failed");
          setIsLoading(false);
        });
      return;
    }

    const payload : any = {
      url: urlInput.startsWith("http") ? urlInput : `https://${urlInput}`,
    }
    if (activeTab == "crawl"){
      payload.crawl= {
        max_pages: crawlMaxPages,
        same_domain_only: crawlSameDomainOnly,
        include_subdomains: crawlIncludeSubdomains
      }
    }
    if (proxy.includes(activeTab)) {
     payload.proxy= {
        geo: proxyGeo 
      }
    }
    if(links.includes(activeTab))
      {
        payload.links={
          limit: mapLimit,
          same_domain_only: mapSameDomainOnly,
          include_subdomains: mapIncludeSubdomains
        }
      }
    if(All.includes(activeTab))
    {

      payload.markdown= {
        enabled: selectedFormats.includes("Markdown"),
        clean: markdownClean,
      },
      payload.html= {
        enabled: selectedFormats.includes("HTML"),
        clean: htmlClean,
        remove_external_links: removeExternalLinks,
        relative_to_absolute_links: relativeToAbsoluteLinks,
        remove_data_images: removeDataImages,
        ignore_tags: ignoreTags,
      },
      payload.screenshot= {
        enabled: selectedFormats.includes("Screenshot"),
        full_page: screenshotFullPage,
        format: screenshotFormat,
        quality: screenshotQuality,
        js_render: jsRender,
        render_timeout: renderTimeout,
        auto_scroll: autoScroll,
        scroll_delay: scrollDelay,
        max_scrolls: maxScrolls,
      },
      payload.seo= {
        enabled: selectedFormats.includes("SEO"),
      },
      payload.images= {
        enabled: selectedFormats.includes("Images"),
      }
    }

    console.log("Payload", JSON.stringify(payload, null, 2));
    const requestHook : any= ChooseUrl(activeTab)

    addLog(`Posting extraction request to backend...`);
    requestHook({
      data: payload,
    })
      .then((res: any) => {
        if (res) {
          const actualData = res.data || res;

          const jobId =
            actualData.crawl_id ||
            actualData.id ||
            actualData.job_id ||
            res.crawl_id;
          if (jobId) {
            addLog(`Asynchronous task registered. Job ID: ${jobId}`);
            if (activeTab === "crawl" || activeTab === "scrape" || activeTab === "map") {
              startWebSocket(jobId);
            } else {
              // fetchResultsFromPaths(jobId);
            }
          } else {
            addLog("Direct response received. Parsing results...");
            const singlePage: ScrapedPage = {
              pageIndex: 0,
              title: "Scraped Page",
              markdown: actualData.markdown,
              html: actualData.html,
              screenshot: actualData.screenshot,
              seo:
                typeof actualData.seo === "object"
                  ? JSON.stringify(actualData.seo, null, 2)
                  : actualData.seo,
              seo_md: actualData.seo_md,
              seo_json: actualData.seo_json,
              seo_xlsx_s3_url: actualData.seo_xlsx_s3_url,
              images:
                typeof actualData.images === "object"
                  ? JSON.stringify(actualData.images, null, 2)
                  : actualData.images,
              links:
                activeTab === "map" && !actualData.links
                  ? JSON.stringify(actualData, null, 2)
                  : typeof actualData.links === "object"
                  ? JSON.stringify(actualData.links, null, 2)
                  : actualData.links,
            };
            setScrapedPages([singlePage]);
            setActivePageIndex(0);
            setIsLoading(false);

            if (activeTab === "map") {
              setActiveResultTab("Links");
            } else if (selectedFormats.length > 0) {
              const availableFormats = selectedFormats.filter((fmt) => {
                const key = fmt.toLowerCase();
                return (
                  actualData[key] !== undefined ||
                  (fmt === "SEO" && actualData.seo) ||
                  (fmt === "Images" && actualData.images)
                );
              });
              if (availableFormats.length > 0) {
                setActiveResultTab(availableFormats[0]);
              } else {
                setActiveResultTab(selectedFormats[0]);
              }
            }
          }
        }
      })
      .catch((err: any) => {
        console.error("Operation error:", err);
        addLog(
          `Error occurred: ${err?.message || "Something went wrong"}`
        );
        setIsLoading(false);
      });
  };

  /* -------------------------------------------------------------------------- */
  /*                                   RETURN                                   */
  /* -------------------------------------------------------------------------- */

  return {
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
    mapProxyGeo,
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
    activePageIndex,
    setActivePageIndex,
    activeResultTab,
    setActiveResultTab,
    isLoading,

    // Derived helpers
    getActivePage,
    getActiveTabContent,
    getButtonText,

    // Actions
    handleRunAction,

    // Props pass-through for the UI
    hideHeader,
    isLanding,
    submittedUrl,
  };
}
