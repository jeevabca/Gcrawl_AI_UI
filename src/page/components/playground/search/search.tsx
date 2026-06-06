import { toast } from "react-hot-toast";
import { FiDownload } from "react-icons/fi";
import { FaRegFileCode } from "react-icons/fa6";
import "./search.css";
import type { ScrapedPage } from "../usePlayground";

interface SearchUIProps {
  scrapedPages: ScrapedPage[];
  isLoading: boolean;
  getActivePage: () => ScrapedPage | null;
  getHostname: (url: string) => string;
  setUrlInput: (url: string) => void;
  setActiveTab: (tab: any) => void;
}

export default function SearchUI({
  scrapedPages,
  isLoading,
  getActivePage,
  getHostname,
  setUrlInput,
  setActiveTab,
}: SearchUIProps) {
  const activePage = getActivePage();
  const searchData = activePage?.searchData;

  if (scrapedPages.length === 0 || isLoading || !searchData) {
    return null;
  }

  return (
    <div className="search-results-wrapper animate-slide-up">
      <div className="search-header-container">
        <div>
          <h2 className="search-title">
            Results ({searchData.length})
          </h2>
          <p className="search-subtitle">
            This playground can only show {searchData.length || 10} results. Please see the JSON data on right for more.
          </p>
        </div>
        <div className="search-header-actions">
          <button
            className="json-btn"
            onClick={() => {
              if (searchData.length > 0) {
                const blob = new Blob([JSON.stringify(searchData, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "search_results.json";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                toast.success("JSON file downloaded!");
              }
            }}
          >
            <FiDownload /> JSON
          </button>
        </div>
      </div>

      <div className="search-list-container">
        {searchData.map((item: any, idx: number) => (
          <div key={idx} className="search-item-card">
            <div className="search-item-header">
              <div className="search-item-info">
                <img 
                  src={`https://www.google.com/s2/favicons?domain=${getHostname(item.url || "")}&sz=32`} 
                  alt="favicon" 
                  className="search-item-favicon"
                  style={{ opacity: item.url ? 1 : 0 }} 
                />
                <div>
                  <h3 className="search-item-title">
                    <span className="search-item-index">#{idx + 1}</span>
                    {item.title || "Untitled"}
                  </h3>
                  <a href={item.url} target="_blank" rel="noreferrer" className="search-item-url">
                    {item.url ? item.url.replace(/^https?:\/\//, '') : ""}
                  </a>
                </div>
              </div>
              <button
                className="scrape-btn"
                onClick={() => {
                  if (item.url) {
                    setUrlInput(item.url);
                    setActiveTab("scrape");
                  } else {
                    toast.error("No URL available to scrape");
                  }
                }}
              >
                <FaRegFileCode /> Scrape page
              </button>
            </div>
            <div className="search-item-json-container">
              <pre className="search-item-json-pre">
                {JSON.stringify(item, null, 2)}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
