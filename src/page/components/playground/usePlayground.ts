/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import useAxios from "../../../services";
import Cookies from "js-cookie";
import axios from "axios";
import { useWebSocket } from "./websocket";
import { performSearch } from "./searchapi";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

export type TabType = "search" | "scrape" | "parse" | "map" | "crawl";
export type FormatType = "Markdown" | "HTML" | "Screenshot" | "Images" | "SEO";

export interface ScrapedPage {
  pageIndex: number;
  title?: string;
  markdown?: string;
  html?: string;
  screenshot?: string;
  seo?: string;
  images?: string;
  links?: string;
  [key: string]: any;
}

export interface PlaygroundProps {
  initialTab?: TabType;
  hideHeader?: boolean;
  onTabChange?: (tab: TabType) => void;
}

/* -------------------------------------------------------------------------- */
/*                              HELPER UTILITIES                              */
/* -------------------------------------------------------------------------- */

/** Detect if a value is inline image / data content rather than a file path. */
const isInlineData = (value: string): boolean => {
  if (!value || typeof value !== "string") return false;
  if (value.startsWith("data:")) return true; // data URI
  if (value.startsWith("/9j/")) return true; // JPEG base64 header
  if (value.startsWith("iVBOR")) return true; // PNG base64 header
  if (value.startsWith("R0lGOD")) return true; // GIF base64 header
  if (value.startsWith("UklGR")) return true; // WebP base64 header
  // If it's longer than 500 chars and doesn't look like a path, treat as inline
  if (value.length > 500 && !value.startsWith("/") && !value.startsWith("http"))
    return true;
  return false;
};

/** Extract content from a server response based on the requested type. */
const parseFileContent = (res: any, type: string): string => {
  if (!res) return "";
  const payload = res.data ? res.data : res;

  // --- Screenshot: extract the raw base64 / data-URI and return early ---
  // Handled separately because the generic extraction below checks
  // `payload.markdown` first, which can grab the wrong field.
  if (type === "screenshot") {
    let shot: any =
      (typeof payload === "string" ? payload : null) ||
      payload.screenshot ||
      payload.image ||
      payload.content ||
      payload;

    // Unwrap one more level if it's still an object
    if (typeof shot === "object" && shot !== null) {
      shot = shot.screenshot || shot.image || shot.content || shot;
    }
    // If still an object, try to JSON-stringify as last resort
    if (typeof shot === "object" && shot !== null) {
      try {
        shot = JSON.stringify(shot);
      } catch (_) {
        shot = "";
      }
    }
    // Return raw string — renderResultTabContent will add the data-URI prefix
    return typeof shot === "string" ? shot : "";
  }

  // --- All other types use the generic extraction pipeline ---
  let content =
    payload.markdown ||
    payload.image ||
    payload.screenshot ||
    payload.content ||
    payload.json ||
    payload.xlsx ||
    payload.seo_md ||
    payload.markdown_content ||
    payload.seo_xlsx ||
    payload;

  if (typeof content === "object" && content !== null) {
    if (type === "seo")
      content = content.json || content.seo_json || content.content || content;
    if (type === "markdown")
      content = content.markdown || content.content || content;
    if (type === "html")
      content = content.html || content.engineHtml || content.content || content;
    if (type === "images")
      content = content.json || content.content || content;
  }

  if (typeof content === "object" && content !== null) {
    try {
      content =
        content.content || content.markdown || JSON.stringify(content, null, 2);
    } catch (e) {
      /* empty */
    }
  }

  if (type === "seo" && typeof content === "object") {
    content = JSON.stringify(content, null, 2);
  }

  return content;
};

/* -------------------------------------------------------------------------- */
/*                               CUSTOM HOOK                                  */
/* -------------------------------------------------------------------------- */

export default function usePlayground({
  initialTab,
  hideHeader = false,
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

  /* ---- Map params ---- */
  const [mapLimit, setMapLimit] = useState(70);
  const [mapSameDomainOnly, setMapSameDomainOnly] = useState(false);
  const [mapIncludeSubdomains, setMapIncludeSubdomains] = useState(false);
  const [mapProxyGeo, setMapProxyGeo] = useState("IN");

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

  const [getPathRequest] = useAxios<any, any>({
    endpoint: "GET_PATH",
    hideErrorMsg: true,
  });

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
      case "parse":
        return "Start parsing";
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
        !target.closest(".map-popup-card")
      ) {
        setShowMapPopup(false);
      }
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                             EVENT HANDLERS                                 */
  /* -------------------------------------------------------------------------- */

  const handleTabClick = (tab: TabType) => {
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
      const match = selectedFormats.find(
        (fmt) =>
          fmt.toLowerCase() === type ||
          (fmt === "SEO" && type === "seo") ||
          (fmt === "Images" && type === "images")
      );
      return match || prev;
    });
  };

  /** Fetch a single format's content from the server using a standalone axios call. */
  const fetchFormat = useCallback(
    async (filePath: string, type: string, pageIndex: number) => {
      try {
        const token = Cookies.get("token");
        const baseUrl =
          import.meta.env.VITE_BASE_URL;
        const res = await axios.get(
          `${baseUrl}/crawl/get/content?file_path=${encodeURIComponent(
            filePath
          )}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
            timeout: 5 * 60000,
          }
        );

        const resData = res?.data;
        if (resData) {
          const content = parseFileContent(resData, type);
           console.log("CONTENT", content)
          if (type === "markdown") {
            setActivePageIndex(pageIndex);
            setActiveResultTab("Markdown");
          }
          if (type === "links") {
            setActivePageIndex(pageIndex);
            setActiveResultTab("Links");
          }
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
                  : [
                      {
                        pageIndex,
                        title: `Page ${pageIndex + 1}`,
                        [type]: content,
                      },
                    ]
              )
              .sort((a, b) => a.pageIndex - b.pageIndex);
          });

          // Auto-select initial result tab if nothing is selected
          setActiveResultTab((prev) => {
            if (prev) return prev;
            const match = selectedFormats.find(
              (fmt) =>
                fmt.toLowerCase() === type ||
                (fmt === "SEO" && type === "seo") ||
                (fmt === "Images" && type === "images")
            );
            return match || prev;
          });

          addLog(`Successfully loaded ${type} for Page ${pageIndex + 1}.`);
        }
      } catch (err) {
        console.error(`Failed to fetch ${type} at path ${filePath}:`, err);
        addLog(`Failed to load ${type} for Page ${pageIndex + 1}.`);
      }
    },
    [selectedFormats, addLog]
  );

  /** Process page data — dispatch fetchFormat or storeInlineContent for each format. */
  const processPageFormats = useCallback(
    (page: any, idx: number) => {
      if (page.markdown_file)
        fetchFormat(page.markdown_file, "markdown", idx);

      if (page.screenshot) {
        if (isInlineData(page.screenshot)) {
          storeInlineContent(page.screenshot, "screenshot", idx);
          addLog(`Screenshot for Page ${idx + 1} received as inline data.`);
        } else {
          fetchFormat(page.screenshot, "screenshot", idx);
        }
      }

      if (page.html_file) fetchFormat(page.html_file, "html", idx);
      if (page.links_file_path || page.links)
        fetchFormat(page.links_file_path || page.links, "links", idx);
      if (page.seo_json) fetchFormat(page.seo_json, "seo", idx);
      if (page.images) fetchFormat(page.images, "images", idx);
    },
    [fetchFormat, addLog]
  );

  /** Poll the REST API for crawl results until pages are available. */
  const fetchResultsFromPaths = useCallback(
    async (jobId: string, retryCount = 0) => {
      // Guard: only allow one polling chain at a time to prevent the useAxios
      // abort-controller from cancelling a competing chain's in-flight request.
      if (retryCount === 0) {
        if (pollingActiveRef.current) {
          console.log(
            "[fetchResultsFromPaths] Polling already active, skipping duplicate chain."
          );
          return;
        }
        pollingActiveRef.current = true;
      }

      try {
        addLog(
          `Retrieving discovered page paths from server (attempt ${
            retryCount + 1
          })...`
        );
        const res = await getPathRequest({
          path: `/${jobId}`,
        });

        const actualData = res?.data || res;
        if (
          actualData &&
          actualData.pages &&
          actualData.pages.length > 0
        ) {
          addLog(
            `Found ${actualData.pages.length} crawled pages. Loading content...`
          );

          actualData.pages.forEach((page: any, idx: number) => {
            const newPage: ScrapedPage = {
              pageIndex: idx,
              title: page.title || `Page ${idx + 1}`,
            };

            setScrapedPages((prev) => {
              const existing = [...prev];
              const foundIdx = existing.findIndex(
                (p) => p.pageIndex === idx
              );
              if (foundIdx === -1) {
                existing.push(newPage);
              }
              return existing.sort((a, b) => a.pageIndex - b.pageIndex);
            });

            processPageFormats(page, idx);
          });

          pollingActiveRef.current = false;
          setIsLoading(false);
        } else {
          if (retryCount < 20) {
            addLog(
              `Job is still processing on the server. Checking again in 5 seconds...`
            );
            setTimeout(() => {
              fetchResultsFromPaths(jobId, retryCount + 1);
            }, 5000);
          } else {
            addLog(
              `Extraction timed out on the server. Please try again.`
            );
            pollingActiveRef.current = false;
            setIsLoading(false);
          }
        }
      } catch (err) {
        console.error(
          `Failed to fetch paths for Job ID ${jobId}:`,
          err
        );
        if (retryCount < 20) {
          setTimeout(() => {
            fetchResultsFromPaths(jobId, retryCount + 1);
          }, 5000);
        } else {
          addLog(`Error loading paths from server.`);
          pollingActiveRef.current = false;
          setIsLoading(false);
        }
      }
    },
    [getPathRequest, processPageFormats, addLog]
  );

  /* ---- WEBSOCKET HOOK ---- */
  const { startWebSocket } = useWebSocket({
    addLog,
    setScrapedPages,
    processPageFormats,
    setIsLoading,
    fetchResultsFromPaths,
    fetchFormat
  });

  /* -------------------------------------------------------------------------- */
  /*                             MAIN RUN ACTION                                */
  /* -------------------------------------------------------------------------- */

  const links = ["map"]
  const proxy =["map","crawl", "scrape"]
  const All = ["search","scrape","parse","crawl"]
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
      performSearch(urlInput)
        .then((data) => {
          const searchResultPage: ScrapedPage = {
            pageIndex: 0,
            title: `Search Results for "${urlInput}"`,
            markdown: typeof data === "object" ? JSON.stringify(data, null, 2) : String(data),
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
      .then((res) => {
        if (res) {
          const actualData = res.data || res;

          const jobId =
            actualData.crawl_id ||
            actualData.id ||
            actualData.job_id ||
            res.crawl_id;
          if (jobId) {
            addLog(`Asynchronous task registered. Job ID: ${jobId}`);
            startWebSocket(jobId);
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
              images:
                typeof actualData.images === "object"
                  ? JSON.stringify(actualData.images, null, 2)
                  : actualData.images,
            };
            setScrapedPages([singlePage]);
            setActivePageIndex(0);
            setIsLoading(false);

            if (selectedFormats.length > 0) {
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
      .catch((err) => {
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
    submittedUrl,
  };
}
