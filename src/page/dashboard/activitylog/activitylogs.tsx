import { useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import {
  FiSearch,
  FiFilter,
  FiKey,
  FiCalendar,
  FiDownload,
  FiCopy,
  FiChevronDown,
  FiActivity
} from "react-icons/fi";
import "./activitylog.css";

interface ActivityLogItem {
  id: string;
  endpoint: string;
  url: string;
  status: "COMPLETED" | "FAILED" | "PENDING";
  credits: number;
  date: string;
  time: string;
}

const mockLogs: ActivityLogItem[] = [
  {
    id: "log_c7a11863901a",
    endpoint: "/SCRAPE",
    url: "https://www.meesho.com/",
    status: "COMPLETED",
    credits: 9,
    date: "May 19, 26",
    time: "2:31 PM",
  },
  {
    id: "log_c7a11863902b",
    endpoint: "/SCRAPE",
    url: "https://gcrawlai.com/app",
    status: "COMPLETED",
    credits: 5,
    date: "May 19, 26",
    time: "2:29 PM",
  },
  {
    id: "log_c7a11863903c",
    endpoint: "/SCRAPE",
    url: "https://gcrawlai.com/app",
    status: "COMPLETED",
    credits: 1,
    date: "May 19, 26",
    time: "2:23 PM",
  },
  {
    id: "log_c7a11863904d",
    endpoint: "/SCRAPE",
    url: "https://gcrawlai.com/app",
    status: "COMPLETED",
    credits: 1,
    date: "May 19, 26",
    time: "2:19 PM",
  },
  {
    id: "log_c7a11863905e",
    endpoint: "/SEARCH",
    url: "https://news.ycombinator.com/",
    status: "COMPLETED",
    credits: 12,
    date: "May 18, 26",
    time: "11:45 AM",
  },
  {
    id: "log_c7a11863906f",
    endpoint: "/CRAWL",
    url: "https://github.com/trending",
    status: "COMPLETED",
    credits: 15,
    date: "May 18, 26",
    time: "9:12 AM",
  },
  {
    id: "log_c7a11863907g",
    endpoint: "/MAP",
    url: "https://react.dev/",
    status: "COMPLETED",
    credits: 3,
    date: "May 17, 26",
    time: "4:30 PM",
  },
  {
    id: "log_c7a11863908h",
    endpoint: "/PARSE",
    url: "https://en.wikipedia.org/wiki/Web_scraping",
    status: "FAILED",
    credits: 0,
    date: "May 16, 26",
    time: "6:15 PM",
  }
];

export default function Activitylogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEndpoint, setSelectedEndpoint] = useState("All Endpoints");
  const [selectedApiKey, setSelectedApiKey] = useState("All API Keys (1)");
  const [selectedTimeframe, setSelectedTimeframe] = useState("Last 7 days");

  // Dropdown UI toggle states
  const [showEndpointDropdown, setShowEndpointDropdown] = useState(false);
  const [showApiKeyDropdown, setShowApiKeyDropdown] = useState(false);
  const [showTimeframeDropdown, setShowTimeframeDropdown] = useState(false);

  // Filter handlers
  const filteredLogs = useMemo(() => {
    return mockLogs.filter((log) => {
      // 1. Search Query Filter
      const matchSearch = log.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.endpoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.id.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Endpoint Filter
      const matchEndpoint = selectedEndpoint === "All Endpoints" ||
        log.endpoint.toUpperCase() === selectedEndpoint.toUpperCase();

      // 3. Timeframe Filter (Mock filter logic based on date strings)
      let matchTime = true;
      if (selectedTimeframe === "Last 24 hours") {
        matchTime = log.date.includes("May 19");
      }

      return matchSearch && matchEndpoint && matchTime;
    });
  }, [searchQuery, selectedEndpoint, selectedTimeframe]);

  const handleCopyLogId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      navigator.clipboard.writeText(id);
      toast.success("Log ID copied to clipboard!");
    } catch (err) {
      console.warn("Clipboard access denied:", err);
      toast.error("Failed to copy Log ID");
    }
  };

  const handleDownloadLog = (log: ActivityLogItem, e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success(`Downloading scrape report for ${log.id} (${log.endpoint})...`);
  };

  return (
    <div className="activity-logs-container">
      {/* Header Visual with Abstract SVG Overlay */}
      <div className="activity-logs-header">
        <div className="header-text-content">
          <h1>Activity Logs</h1>
          <p>Take a look at your requests activity</p>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="activity-logs-filters">
        {/* Search Field */}
        <div className="search-input-wrapper">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Dropdowns Actions */}
        <div className="filter-dropdowns-group">
          {/* Endpoint Filter */}
          <div className="custom-dropdown-container">
            <button
              className={`dropdown-trigger-btn ${selectedEndpoint !== "All Endpoints" ? "active-filter" : ""}`}
              onClick={() => {
                setShowEndpointDropdown(!showEndpointDropdown);
                setShowApiKeyDropdown(false);
                setShowTimeframeDropdown(false);
              }}
            >
              <FiFilter className="trigger-icon" />
              <span>{selectedEndpoint}</span>
              <FiChevronDown className="trigger-chevron" />
            </button>
            {showEndpointDropdown && (
              <div className="custom-dropdown-menu">
                {["All Endpoints", "/SCRAPE", "/SEARCH", "/CRAWL", "/MAP", "/PARSE"].map((opt) => (
                  <div
                    key={opt}
                    className={`dropdown-item ${selectedEndpoint === opt ? "selected" : ""}`}
                    onClick={() => {
                      setSelectedEndpoint(opt);
                      setShowEndpointDropdown(false);
                    }}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* API Key Filter */}
          <div className="custom-dropdown-container">
            <button
              className="dropdown-trigger-btn"
              onClick={() => {
                setShowApiKeyDropdown(!showApiKeyDropdown);
                setShowEndpointDropdown(false);
                setShowTimeframeDropdown(false);
              }}
            >
              <FiKey className="trigger-icon" />
              <span>{selectedApiKey}</span>
              <FiChevronDown className="trigger-chevron" />
            </button>
            {showApiKeyDropdown && (
              <div className="custom-dropdown-menu">
                {["All API Keys (1)", "Default API Key"].map((opt) => (
                  <div
                    key={opt}
                    className={`dropdown-item ${selectedApiKey === opt ? "selected" : ""}`}
                    onClick={() => {
                      setSelectedApiKey(opt);
                      setShowApiKeyDropdown(false);
                    }}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Calendar/Timeframe Filter */}
          <div className="custom-dropdown-container timeframe-container">
            <button
              className="dropdown-trigger-btn"
              onClick={() => {
                setShowTimeframeDropdown(!showTimeframeDropdown);
                setShowEndpointDropdown(false);
                setShowApiKeyDropdown(false);
              }}
            >
              <FiCalendar className="trigger-icon" />
              <span>{selectedTimeframe}</span>
              <FiChevronDown className="trigger-chevron" />
            </button>
            {showTimeframeDropdown && (
              <div className="custom-dropdown-menu right-aligned">
                {["Last 24 hours", "Last 7 days", "Last 30 days"].map((opt) => (
                  <div
                    key={opt}
                    className={`dropdown-item ${selectedTimeframe === opt ? "selected" : ""}`}
                    onClick={() => {
                      setSelectedTimeframe(opt);
                      setShowTimeframeDropdown(false);
                    }}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Logs Table Container */}
      <div className="logs-table-card">
        <div className="logs-table-scroll-wrapper">
          <table className="logs-data-table">
            <thead>
              <tr>
                <th>ENDPOINT</th>
                <th>URL</th>
                <th>STATUS</th>
                <th># CREDITS</th>
                <th>TIME</th>
                <th className="actions-header-cell">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="log-table-row">
                    {/* Endpoint Cell */}
                    <td className="endpoint-cell">
                      <span className={`endpoint-tag ${log.endpoint.toLowerCase().replace("/", "")}`}>
                        {log.endpoint}
                      </span>
                    </td>

                    {/* URL Cell with Copy ID trigger on row hover */}
                    <td className="url-cell">
                      <div className="url-content-wrapper">
                        <span className="url-text-value" title={log.url}>{log.url}</span>
                        <button
                          className="hover-copy-id-btn"
                          onClick={(e) => handleCopyLogId(log.id, e)}
                          title={`Copy Transaction ID: ${log.id}`}
                        >
                          <span className="copy-label">Copy ID</span>
                          <FiCopy className="copy-btn-icon" />
                        </button>
                      </div>
                    </td>

                    {/* Status Cell */}
                    <td className="status-cell">
                      <span className={`status-pill ${log.status.toLowerCase()}`}>
                        {log.status}
                      </span>
                    </td>

                    {/* Credits Cell */}
                    <td className="credits-cell">
                      <span className="credits-value">{log.credits}</span>
                    </td>

                    {/* Time Cell */}
                    <td className="time-cell">
                      <div className="time-content-wrapper">
                        <span className="time-date">{log.date}</span>
                        <span className="time-hour">{log.time}</span>
                      </div>
                    </td>

                    {/* Actions Cell */}
                    <td className="actions-cell">
                      <button
                        className="download-log-btn"
                        onClick={(e) => handleDownloadLog(log, e)}
                        title="Download JSON Report"
                      >
                        <FiDownload />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="logs-empty-state-cell">
                    <div className="empty-state-content">
                      <div className="empty-icon-circle">
                        <FiActivity className="empty-icon" />
                      </div>
                      <h3>No logs found</h3>
                      <p>Try adjusting your search queries or filter dropdown settings</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}