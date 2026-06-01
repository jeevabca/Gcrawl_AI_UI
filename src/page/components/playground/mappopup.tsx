import React, { useState } from "react";
import { FiGlobe, FiHash, FiCompass } from "react-icons/fi";
import { LiaLinkSolid } from "react-icons/lia";
import emojiFlags from "emoji-flags";
import { countries as countryData } from "country-data-list";

const allCountries = [
  { code: "ALL", name: "Worldwide" },
  ...Object.keys(countryData)
    .filter((key) => key.length === 2 && (((countryData as any)[key]?.status === "assigned") || ((countryData as any)[key]?.status === "user assigned")))
    .map((key) => ({
      code: key,
      name: (countryData as any)[key]?.name || key
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
];

const getCountryInfo = (code: string) => {
  if (code === "ALL") {
    return { code: "ALL", name: "Worldwide", emoji: "🌐" };
  }
  const countryObj = emojiFlags.countryCode(code);
  const dataObj = (countryData as any)[code];
  return {
    code: code,
    name: dataObj ? dataObj.name : code,
    emoji: countryObj ? countryObj.emoji : "🌐"
  };
};



interface MapPopupProps {
  isOpen: boolean;
  onClose: () => void;
  limit: number;
  setLimit: (val: number) => void;
  sameDomainOnly: boolean;
  setSameDomainOnly: (val: boolean) => void;
  includeSubdomains: boolean;
  setIncludeSubdomains: (val: boolean) => void;
  proxyGeo: string;
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
  proxyGeo,
  setProxyGeo,
}: MapPopupProps) {
  const [showGeoDropdown, setShowGeoDropdown] = useState(false);
  const [geoSearch, setGeoSearch] = useState("");
  
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
    setGeoSearch("");
  };

  const filteredCountries = allCountries.filter((c) =>
    c.name.toLowerCase().includes(geoSearch.toLowerCase()) ||
    c.code.toLowerCase().includes(geoSearch.toLowerCase())
  );

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
                color: "var(--primary)",
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
              backgroundColor: sameDomainOnly ? "var(--primary)" : "rgba(120, 120, 128, 0.2)",
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
                color: "var(--primary)",
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
              backgroundColor: includeSubdomains ? "var(--primary)" : "rgba(120, 120, 128, 0.2)",
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

        {/* Proxy Geo */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", position: "relative" }}>
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
                  color: "var(--primary)",
                }}
              >
                <FiGlobe style={{ fontSize: "18px" }} />
              </div>
              <span style={{ fontSize: "14px", fontWeight: "500", color: "var(--text-primary)" }}>
                Proxy Geo
              </span>
            </div>
            {/* Custom Dropdown Trigger */}
            <button
              onClick={() => setShowGeoDropdown(!showGeoDropdown)}
              className="geo-dropdown-trigger-btn"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                backgroundColor: "var(--bg-page)",
                color: "var(--text-primary)",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                minWidth: "160px",
                justifyContent: "space-between",
                outline: "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "16px", lineHeight: "1" }}>
                  {getCountryInfo(proxyGeo).emoji}
                </span>
                <span style={{ fontSize: "14px", fontWeight: "600" }}>
                  {getCountryInfo(proxyGeo).name}
                </span>
              </div>
              <span style={{ fontSize: "10px", opacity: 0.7 }}>▼</span>
            </button>
          </div>

          {/* Dropdown Menu */}
          {showGeoDropdown && (
            <div
              className="geo-dropdown-list"
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                width: "100%",
                maxHeight: "220px",
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                borderRadius: "12px",
                boxShadow: "0 12px 30px rgba(0, 0, 0, 0.25)",
                zIndex: 1100,
                marginTop: "4px",
                padding: "8px",
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
                animation: "popoverFadeInUp 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              {/* Search Box */}
              <div style={{ position: "relative", display: "flex", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ position: "absolute", left: "10px", color: "var(--text-secondary)", fontSize: "13px" }}>🔍</span>
                <input
                  type="text"
                  placeholder="Search country..."
                  value={geoSearch}
                  onChange={(e) => setGeoSearch(e.target.value)}
                  onClick={(e) => e.stopPropagation()} // Prevent close on search click
                  style={{
                    width: "100%",
                    height: "32px",
                    padding: "6px 10px 6px 30px",
                    borderRadius: "6px",
                    border: "1px solid var(--border-color)",
                    backgroundColor: "var(--bg-page)",
                    color: "var(--text-primary)",
                    fontSize: "13px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Scrollable list */}
              <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "2px" }}>
                {filteredCountries.map((c) => {
                  const info = getCountryInfo(c.code);
                  return (
                    <div
                      key={c.code}
                      onClick={() => {
                        setProxyGeo(c.code);
                        setShowGeoDropdown(false);
                        setGeoSearch("");
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "8px 10px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: "500",
                        color: proxyGeo === c.code ? "var(--primary)" : "var(--text-primary)",
                        backgroundColor: proxyGeo === c.code ? "rgba(78, 165, 255, 0.08)" : "transparent",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        if (proxyGeo !== c.code) {
                          e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.04)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (proxyGeo !== c.code) {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }
                      }}
                    >
                      <span style={{ fontSize: "16px", lineHeight: "1" }}>{info.emoji}</span>
                      <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {info.name}
                      </span>
                      <span style={{ fontSize: "11px", color: "var(--text-secondary)", marginRight: "4px" }}>
                        {c.code}
                      </span>
                      {proxyGeo === c.code && <span style={{ fontSize: "11px", fontWeight: "bold" }}>✓</span>}
                    </div>
                  );
                })}
                {filteredCountries.length === 0 && (
                  <div style={{ padding: "12px", textAlign: "center", color: "var(--text-secondary)", fontSize: "12px" }}>
                    No countries found
                  </div>
                )}
              </div>
            </div>
          )}
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
                color: "var(--primary)",
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
