import { useState, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import {
  FiCopy,
  FiDownload,
  FiFileText,
  FiCode,
  FiGrid,
} from "react-icons/fi";
import * as XLSX from "xlsx";
import "./seo.css";

interface SeoViewerProps {
  page: any;
}

type SeoTab = "markdown" | "json" | "excel";

export default function SeoViewer({ page }: SeoViewerProps) {
  const [activeTab, setActiveTab] = useState<SeoTab>("markdown");
  const [excelData, setExcelData] = useState<any[][] | null>(null);
  const [excelLoading, setExcelLoading] = useState(false);
  const [excelError, setExcelError] = useState<string | null>(null);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [activeSheet, setActiveSheet] = useState<string>("");
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);

  // Extract SEO data from page
  const seoMarkdown = page.seo_md || "";
  const seoJsonRaw = page.seo_json || page.seo || "";
  const excelUrl = page.seo_xlsx_s3_url || "";

  // Parse JSON for display
  const seoJsonContent = useMemo(() => {
    if (!seoJsonRaw) return "";
    if (typeof seoJsonRaw === "object") return JSON.stringify(seoJsonRaw, null, 2);
    try {
      return JSON.stringify(JSON.parse(seoJsonRaw), null, 2);
    } catch {
      return seoJsonRaw;
    }
  }, [seoJsonRaw]);

  // Auto-select the best available tab
  useEffect(() => {
    if (seoMarkdown) {
      setActiveTab("markdown");
    } else if (seoJsonContent) {
      setActiveTab("json");
    } else if (excelUrl) {
      setActiveTab("excel");
    }
  }, [seoMarkdown, seoJsonContent, excelUrl]);

  // Fetch and parse Excel when the Excel tab is selected
  useEffect(() => {
    if (activeTab !== "excel" || !excelUrl || workbook) return;

    setExcelLoading(true);
    setExcelError(null);

    // Use the download proxy to bypass CORS
    const proxyUrl = `/api/download-image?url=${encodeURIComponent(excelUrl)}`;

    fetch(proxyUrl)
      .then((resp) => {
        if (!resp.ok) throw new Error(`Failed to fetch Excel file: ${resp.statusText}`);
        return resp.arrayBuffer();
      })
      .then((buffer) => {
        const wb = XLSX.read(new Uint8Array(buffer), { type: "array" });
        setWorkbook(wb);
        setSheetNames(wb.SheetNames);
        setActiveSheet(wb.SheetNames[0] || "");

        // Parse first sheet
        const firstSheet = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json<any[]>(firstSheet, { header: 1 });
        setExcelData(data as any[][]);
        setExcelLoading(false);
      })
      .catch((err) => {
        setExcelError(err.message || "Failed to load Excel file");
        setExcelLoading(false);
      });
  }, [activeTab, excelUrl, workbook]);

  // Switch active Excel sheet
  const handleSheetChange = (sheetName: string) => {
    setActiveSheet(sheetName);
    if (workbook) {
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1 });
      setExcelData(data as any[][]);
    }
  };

  // Copy handlers
  const handleCopy = () => {
    let content = "";
    if (activeTab === "markdown") {
      content = seoMarkdown;
    } else if (activeTab === "json") {
      content = seoJsonContent;
    } else if (activeTab === "excel" && excelData) {
      content = excelData.map((row) => row.join("\t")).join("\n");
    }
    if (content) {
      navigator.clipboard.writeText(content);
      toast.success(`SEO ${activeTab} copied to clipboard!`);
    }
  };

  // Download Excel from S3
  const handleDownloadExcel = () => {
    if (!excelUrl) return;
    const proxyUrl = `/api/download-image?url=${encodeURIComponent(excelUrl)}`;
    const link = document.createElement("a");
    link.href = proxyUrl;
    link.download = "seo_report.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Check what tabs are available
  const availableTabs: { key: SeoTab; label: string; icon: React.ReactNode }[] = [];
  if (seoMarkdown) {
    availableTabs.push({ key: "markdown", label: "Markdown", icon: <FiFileText size={14} /> });
  }
  if (seoJsonContent) {
    availableTabs.push({ key: "json", label: "JSON", icon: <FiCode size={14} /> });
  }
  if (excelUrl) {
    availableTabs.push({ key: "excel", label: "Excel", icon: <FiGrid size={14} /> });
  }

  if (availableTabs.length === 0) {
    return <div className="seo-empty">No SEO data available.</div>;
  }

  return (
    <div className="seo-viewer-wrapper">
      {/* Tab Bar */}
      <div className="seo-tabs-bar">
        <div className="seo-tabs-left">
          {availableTabs.map((tab) => (
            <button
              key={tab.key}
              className={`seo-tab-btn ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
        <div className="seo-tabs-actions">
          <button className="seo-action-btn" onClick={handleCopy} title="Copy">
            <FiCopy size={14} />
          </button>
          {excelUrl && (
            <button className="seo-action-btn" onClick={handleDownloadExcel} title="Download Excel">
              <FiDownload size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="seo-content-area">
        {activeTab === "markdown" && (
          <div className="seo-markdown-view">
            <pre className="seo-markdown-pre">{seoMarkdown}</pre>
          </div>
        )}

        {activeTab === "json" && (
          <div className="seo-json-view">
            <pre className="seo-json-pre">
              <code>{seoJsonContent}</code>
            </pre>
          </div>
        )}

        {activeTab === "excel" && (
          <div className="seo-excel-view">
            {excelLoading && (
              <div className="seo-excel-loading">
                <div className="seo-spinner" />
                <span>Loading Excel spreadsheet...</span>
              </div>
            )}

            {excelError && (
              <div className="seo-excel-error">
                <span>⚠️ {excelError}</span>
              </div>
            )}

            {!excelLoading && !excelError && excelData && (
              <>
                {/* Sheet Tabs (if multiple sheets) */}
                {sheetNames.length > 1 && (
                  <div className="seo-sheet-tabs">
                    {sheetNames.map((name) => (
                      <button
                        key={name}
                        className={`seo-sheet-btn ${activeSheet === name ? "active" : ""}`}
                        onClick={() => handleSheetChange(name)}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                )}

                {/* Spreadsheet Table */}
                <div className="seo-excel-table-wrapper">
                  <table className="seo-excel-table">
                    <tbody>
                      {excelData.map((row, rowIdx) => (
                        <tr key={rowIdx} className={rowIdx === 0 ? "seo-excel-header-row" : ""}>
                          <td className="seo-excel-row-num">{rowIdx + 1}</td>
                          {(row as any[]).map((cell: any, colIdx: number) => (
                            <td key={colIdx} className="seo-excel-cell">
                              {cell !== null && cell !== undefined ? String(cell) : ""}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

