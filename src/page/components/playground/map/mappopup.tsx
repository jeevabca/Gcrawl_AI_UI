import React, { useState } from "react";
import { FiHash, FiCompass } from "react-icons/fi";
import { LiaLinkSolid } from "react-icons/lia";
import { useTheme } from "../../../../utils/theme";

interface MapPopupProps {
  isOpen: boolean;
  onClose: () => void;
  limit: number;
  setLimit: (val: number) => void;
  sameDomainOnly: boolean;
  setSameDomainOnly: (val: boolean) => void;
  includeSubdomains: boolean;
  setIncludeSubdomains: (val: boolean) => void;
  setProxyGeo: (val: string) => void;
}

export default function MapPopup({
  isOpen,
  onClose,
  limit,
  setLimit,
  sameDomainOnly,
  setSameDomainOnly,
  includeSubdomains,
  setIncludeSubdomains,
  setProxyGeo,
}: MapPopupProps) {
  const [showGeoDropdown, setShowGeoDropdown] = useState(false);
  const { isDarkMode } = useTheme();
  
  React.useEffect(() => {
    if (!showGeoDropdown) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".geo-dropdown-list") && !target.closest(".geo-dropdown-trigger-btn")) {
        setShowGeoDropdown(false);
      }
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [showGeoDropdown]);

  if (!isOpen) return null;

  const handleReset = () => {
    setLimit(70);
    setSameDomainOnly(false);
    setIncludeSubdomains(false);
    setProxyGeo("ALL");
  };

  return (
    <div
      className="map-popup-card"
      style={{
        position: "absolute",
        bottom: "auto",
        top: 0,
        right: "auto",
        left: "calc(100% + 10px)",
        width: "380px",
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-color)",
        borderRadius: "16px",
        boxShadow: "0 12px 35px -10px rgba(0, 0, 0, 0.12), 0 4px 12px -5px rgba(0, 0, 0, 0.05)",
        display: "flex",
        flexDirection: "column",
        zIndex: 1000,
        overflow: "visible",
        transformOrigin: "bottom right",
        animation: "popoverFadeInUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 20px",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        <span
          style={{
            fontSize: "15px",
            fontWeight: "600",
            color: "var(--text-primary)",
          }}
        >
          Options
        </span>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            fontSize: "20px",
            color: "var(--text-secondary)",
            cursor: "pointer",
            padding: "0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--border-color)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          &times;
        </button>
      </div>

      {/* Body */}
      <div
        style={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* Same Domain Only */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                backgroundColor: "rgba(78, 165, 255, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isDarkMode ? "var(--pill-text)" : "var(--primary)",
              }}
            >
              <LiaLinkSolid style={{ fontSize: "18px" }} />
            </div>
            <span style={{ fontSize: "14px", fontWeight: "500", color: "var(--text-primary)" }}>
              Same domain only
            </span>
          </div>
          {/* Toggle Switch */}
          <button
            onClick={() => setSameDomainOnly(!sameDomainOnly)}
            style={{
              width: "44px",
              height: "24px",
              borderRadius: "12px",
              backgroundColor: sameDomainOnly ? (isDarkMode ? "var(--pill-text)" : "var(--primary)") : "rgba(120, 120, 128, 0.2)",
              border: "none",
              cursor: "pointer",
              position: "relative",
              padding: "0",
              transition: "background-color 0.25s",
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: "#ffffff",
                position: "absolute",
                top: "2px",
                left: sameDomainOnly ? "22px" : "2px",
                transition: "left 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
              }}
            />
          </button>
        </div>

        {/* Include Subdomains */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                backgroundColor: "rgba(78, 165, 255, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isDarkMode ? "var(--pill-text)" : "var(--primary)",
              }}
            >
              <FiCompass style={{ fontSize: "18px" }} />
            </div>
            <span style={{ fontSize: "14px", fontWeight: "500", color: "var(--text-primary)" }}>
              Include subdomains
            </span>
          </div>
          {/* Toggle Switch */}
          <button
            onClick={() => setIncludeSubdomains(!includeSubdomains)}
            style={{
              width: "44px",
              height: "24px",
              borderRadius: "12px",
              backgroundColor: includeSubdomains ? (isDarkMode ? "var(--pill-text)" : "var(--primary)") : "rgba(120, 120, 128, 0.2)",
              border: "none",
              cursor: "pointer",
              position: "relative",
              padding: "0",
              transition: "background-color 0.25s",
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: "#ffffff",
                position: "absolute",
                top: "2px",
                left: includeSubdomains ? "22px" : "2px",
                transition: "left 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
              }}
            />
          </button>
        </div>

        {/* Limit */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                backgroundColor: "rgba(78, 165, 255, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isDarkMode ? "var(--pill-text)" : "var(--primary)",
              }}
            >
              <FiHash style={{ fontSize: "18px" }} />
            </div>
            <span style={{ fontSize: "14px", fontWeight: "500", color: "var(--text-primary)" }}>
              Limit
            </span>
          </div>
          <input
            type="number"
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value) || 0)}
            style={{
              width: "100px",
              height: "36px",
              borderRadius: "8px",
              border: "1px solid var(--border-color)",
              backgroundColor: "var(--bg-page)",
              color: "var(--text-primary)",
              textAlign: "center",
              fontSize: "14px",
              fontWeight: "600",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-color)")}
          />
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "16px 20px",
          borderTop: "1px solid var(--border-color)",
          display: "flex",
          justifyContent: "flex-end",
          backgroundColor: "rgba(0, 0, 0, 0.02)",
          borderBottomLeftRadius: "16px",
          borderBottomRightRadius: "16px",
        }}
      >
        <button
          onClick={handleReset}
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            backgroundColor: "var(--border-color)",
            border: "none",
            color: "var(--text-primary)",
            fontWeight: "600",
            fontSize: "13px",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Reset settings
        </button>
      </div>
    </div>
  );
}
