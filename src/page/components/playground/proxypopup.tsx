import React, { useState } from "react";
import emojiFlags from "emoji-flags";
import { countries as countryData } from "country-data-list";

export const allCountries = [
  { code: "default", name: "Default" },
  ...Object.keys(countryData)
    .filter((key) => key.length === 2 && (((countryData as any)[key]?.status === "assigned") || ((countryData as any)[key]?.status === "user assigned")))
    .map((key) => ({
      code: key,
      name: (countryData as any)[key]?.name || key
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
];

export const getCountryInfo = (code: string) => {
  if (code === "default") {
    return { code: "default", name: "Default"};
  }
  try {
    const countryObj = emojiFlags.countryCode(code);
    const dataObj = (countryData as any)[code];
    return {
      code: code,
      name: dataObj ? dataObj.name : code,
      emoji: countryObj ? countryObj.emoji : "🌐"
    };
  } catch (e) {
    return { code: code, name: code, emoji: "🌐" };
  }
};

const styles = {
  proxyModalCard: {
    position: "absolute" as const,
    bottom: "auto",
    top: "calc(100% + 8px)",
    left: 0,
    width: "320px",
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    borderRadius: "16px",
    boxShadow: "0 12px 35px -10px rgba(0, 0, 0, 0.12), 0 4px 12px -5px rgba(0, 0, 0, 0.05)",
    display: "flex",
    flexDirection: "column" as const,
    zIndex: 1000,
    overflow: "hidden",
    animation: "popoverFadeInUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  proxyModalHeader: {
    display: "flex",
    alignItems: "end",
    justifyContent: "end",
    padding: "12px 16px",
    borderBottom: "1px solid var(--border-color)",
  },
  proxyModalTitle: {
    fontSize: "14px",
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  proxyModalClose: {
    background: "none",
    border: "none",
    fontSize: "18px",
    color: "var(--text-secondary)",
    cursor: "pointer",
    padding: "2px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    transition: "all 0.2s",
  },
  proxyModalBody: {
    padding: "12px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
  },
  searchWrapper: {
    position: "relative" as const,
    display: "flex",
    alignItems: "center",
    marginBottom: "4px",
  },
  searchIcon: {
    position: "absolute" as const,
    left: "10px",
    color: "var(--text-secondary)",
    fontSize: "12px",
  },
  searchInput: {
    width: "100%",
    height: "32px",
    padding: "6px 10px 6px 30px",
    borderRadius: "8px",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-page)",
    color: "var(--text-primary)",
    fontSize: "13px",
    outline: "none",
    boxSizing: "border-box" as const,
  },
  countryList: {
    maxHeight: "220px",
    overflowY: "auto" as const,
    display: "flex",
    flexDirection: "column" as const,
    gap: "2px",
  },
  countryRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px 10px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 500,
    transition: "all 0.15s",
  }
};

interface ProxyPopupProps {
  isOpen: boolean;
  onClose: () => void;
  proxyGeo: string;
  setProxyGeo: (val: string) => void;
}

export const ProxyPopup: React.FC<ProxyPopupProps> = ({
  isOpen,
  onClose,
  proxyGeo,
  setProxyGeo,
}) => {
  const [geoSearch, setGeoSearch] = useState("");

  if (!isOpen) return null;

  const filteredCountries = allCountries.filter((c) =>
    c.name.toLowerCase().includes(geoSearch.toLowerCase()) ||
    c.code.toLowerCase().includes(geoSearch.toLowerCase())
  );

  return (
    <div style={styles.proxyModalCard} onClick={(e) => e.stopPropagation()}>

      <div style={styles.proxyModalBody}>
        {/* Search */}
        <div style={styles.searchWrapper}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search proxy country..."
            value={geoSearch}
            onChange={(e) => setGeoSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {/* Scrollable list */}
        <div style={styles.countryList}>
          {filteredCountries.map((c) => {
            const info = getCountryInfo(c.code);
            const isSelected = proxyGeo === c.code;
            return (
              <div
                key={c.code}
                onClick={() => {
                  setProxyGeo(c.code);
                  onClose();
                  setGeoSearch("");
                }}
                style={{
                  ...styles.countryRow,
                  color: isSelected ? "var(--primary)" : "var(--text-primary)",
                  backgroundColor: isSelected ? "rgba(6, 74, 145, 0.08)" : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = "var(--bg-page)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                <span style={{ fontSize: "16px", lineHeight: "1" }}>{info.emoji}</span>
                <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {info.name}
                </span>
                <span style={{ fontSize: "11px", color: "var(--text-secondary)", marginRight: "4px" }}>
                  {c.code.toUpperCase()}
                </span>
                {isSelected && <span style={{ fontSize: "11px", fontWeight: "bold" }}>✓</span>}
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
    </div>
  );
};

export default ProxyPopup;
