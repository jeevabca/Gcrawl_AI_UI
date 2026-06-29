import React, { useState } from "react";
import { RiMarkdownFill, RiCodeSSlashLine, RiScreenshot2Line, RiImage2Line } from "react-icons/ri";
import { TbSeo } from "react-icons/tb";


export type FormatType = "Markdown" | "HTML" | "Screenshot" | "Images" | "SEO";

const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const styles = {
  formatModalCard: {
    position: "absolute" as const,
    bottom: "auto",
    top: "calc(100% + 20px)",
    right: "auto",
    left: 0,
    width: "680px",
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    borderRadius: "16px",
    boxShadow: "0 12px 35px -10px rgba(0, 0, 0, 0.12), 0 4px 12px -5px rgba(0, 0, 0, 0.05)",
    display: "flex",
    flexDirection: "column" as const,
    zIndex: 1000,
    overflow: "hidden",
    transformOrigin: "bottom right",
    animation: "popoverFadeInUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
  formatModalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    borderBottom: "1px solid var(--border-color)",
  },
  formatModalTitle: {
    fontSize: "16px",
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  formatModalClose: {
    background: "none",
    border: "none",
    fontSize: "20px",
    color: "var(--text-secondary)",
    cursor: "pointer",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "6px",
    transition: "all 0.2s",
  },
  formatModalBody: {
    padding: "12px",
    maxHeight: "480px",
    overflowY: "auto" as const,
  },
  formatList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "2px",
  },
  formatRowItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 12px",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    border: "1px solid transparent",
  },
  rowItemLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  customCheckbox: {
    width: "18px",
    height: "18px",
    borderRadius: "5px",
    border: "1.5px solid #d1d5db",
    backgroundColor: "var(--bg-card)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "transparent",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  formatRowIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--text-secondary)",
    transition: "color 0.2s",
  },
  formatRowLabel: {
    fontSize: "14px",
    fontWeight: 600,
    color: "var(--text-primary)",
  },
  subSettingsPanel: {
    padding: "10px 14px",
    backgroundColor: "var(--bg-page)",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
    marginTop: "4px",
    marginBottom: "8px",
    marginLeft: "32px",
  },
  globalSettingsPanel: {
    padding: "12px 14px",
    backgroundColor: "var(--bg-page)",
    borderRadius: "12px",
    border: "1px solid var(--border-color)",
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
    marginTop: "8px",
  },
  settingsRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
  },
  settingsLabel: {
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--text-secondary)",
  },
  settingsInput: {
    padding: "4px 8px",
    borderRadius: "6px",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-card)",
    color: "var(--text-primary)",
    fontSize: "12px",
    fontWeight: 600,
    outline: "none",
    width: "70px",
    textAlign: "center" as const,
  },
  settingsTextInput: {
    padding: "4px 8px",
    borderRadius: "6px",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-card)",
    color: "var(--text-primary)",
    fontSize: "12px",
    outline: "none",
    width: "160px",
  },
  selectInput: {
    padding: "4px 8px",
    borderRadius: "6px",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-card)",
    color: "var(--text-primary)",
    fontSize: "12px",
    fontWeight: 600,
    outline: "none",
    cursor: "pointer",
  }
};

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (val: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange }) => {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        width: "36px",
        height: "20px",
        borderRadius: "10px",
        backgroundColor: checked ? "var(--primary)" : "rgba(120, 120, 128, 0.2)",
        border: "none",
        cursor: "pointer",
        position: "relative",
        padding: "0",
        transition: "background-color 0.25s",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          backgroundColor: "#ffffff",
          position: "absolute",
          top: "2px",
          left: checked ? "18px" : "2px",
          transition: "left 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
        }}
      />
    </button>
  );
};

interface FormatRowItemProps {
  format: FormatType;
  isSelected: boolean;
  onToggle: (format: FormatType) => void;
  icon: React.ReactNode;
}

const FormatRowItem: React.FC<FormatRowItemProps> = ({ format, isSelected, onToggle, icon }) => {
  const [isHovered, setIsHovered] = useState(false);

  const rowStyle = {
    ...styles.formatRowItem,
    ...(isSelected ? {
      backgroundColor: "rgba(6, 74, 145, 0.04)",
      border: "1px solid rgba(6, 74, 145, 0.08)",
    } : {}),
    ...(isHovered ? {
      backgroundColor: "var(--bg-page)",
    } : {}),
  };

  const checkboxStyle = {
    ...styles.customCheckbox,
    ...(isSelected ? {
      border: "1.5px solid var(--primary)",
      backgroundColor: "var(--primary)",
      color: "#ffffff",
    } : {}),
  };

  const iconStyle = {
    ...styles.formatRowIcon,
    ...((isSelected || isHovered) ? {
      color: "var(--text-primary)",
    } : {}),
  };

  return (
    <div
      style={rowStyle}
      onClick={() => onToggle(format)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.rowItemLeft}>
        <span style={checkboxStyle}>
          {isSelected && <CheckIcon />}
        </span>
        <span style={iconStyle}>
          {icon}
        </span>
        <span style={styles.formatRowLabel}>{format}</span>
      </div>
    </div>
  );
};

interface FormatPopupProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFormats: FormatType[];
  onToggleFormat: (format: FormatType) => void;

  // Rendering Settings
  jsRender: boolean;
  setJsRender: (val: boolean) => void;
  renderTimeout: number;
  setRenderTimeout: (val: number) => void;
  autoScroll: boolean;
  setAutoScroll: (val: boolean) => void;
  scrollDelay: number;
  setScrollDelay: (val: number) => void;
  maxScrolls: number;
  setMaxScrolls: (val: number) => void;

  // Markdown Settings
  markdownClean: boolean;
  setMarkdownClean: (val: boolean) => void;

  // HTML Settings
  htmlClean: boolean;
  setHtmlClean: (val: boolean) => void;
  removeExternalLinks: boolean;
  setRemoveExternalLinks: (val: boolean) => void;
  relativeToAbsoluteLinks: boolean;
  setRelativeToAbsoluteLinks: (val: boolean) => void;
  removeDataImages: boolean;
  setRemoveDataImages: (val: boolean) => void;
  ignoreTags: string[];
  setIgnoreTags: (val: string[]) => void;

  // Screenshot Settings
  screenshotFullPage: boolean;
  setScreenshotFullPage: (val: boolean) => void;
  screenshotFormat: "jpg" | "png";
  setScreenshotFormat: (val: "jpg" | "png") => void;
  screenshotQuality: number;
  setScreenshotQuality: (val: number) => void;
  isScreenshotTab?: boolean;
}

export const FormatPopup: React.FC<FormatPopupProps> = ({
  isOpen,
  onClose,
  selectedFormats,
  onToggleFormat,
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
  markdownClean,
  setMarkdownClean,
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
  screenshotFullPage,
  setScreenshotFullPage,
  screenshotFormat,
  setScreenshotFormat,
  screenshotQuality,
  setScreenshotQuality,
  isScreenshotTab,
}) => {
  const [closeHover, setCloseHover] = useState(false);

  if (!isOpen) return null;

  return (
    <div style={styles.formatModalCard} onClick={(e) => e.stopPropagation()}>
      <div style={styles.formatModalHeader}>
        <span style={styles.formatModalTitle}>{isScreenshotTab ? "Screenshot Options" : "Format & Options"}</span>
        <button
          style={{
            ...styles.formatModalClose,
            ...(closeHover ? { backgroundColor: "var(--bg-page)", color: "var(--text-primary)" } : {}),
          }}
          onClick={onClose}
          onMouseEnter={() => setCloseHover(true)}
          onMouseLeave={() => setCloseHover(false)}
        >
          &times;
        </button>
      </div>

      <div style={styles.formatModalBody}>
        <div style={styles.formatList}>
          {!isScreenshotTab && (
            <>
              {/* MARKDOWN FORMAT */}
              <FormatRowItem
                format="Markdown"
                isSelected={selectedFormats.includes("Markdown")}
                onToggle={onToggleFormat}
                icon={<RiMarkdownFill style={{ width: "18px", height: "18px" }} />}
              />
              {selectedFormats.includes("Markdown") && (
                <div style={styles.subSettingsPanel} onClick={(e) => e.stopPropagation()}>
                  <div style={styles.settingsRow}>
                    <span style={styles.settingsLabel}>Clean Markdown</span>
                    <ToggleSwitch checked={markdownClean} onChange={setMarkdownClean} />
                  </div>
                </div>
              )}

              {/* HTML FORMAT */}
              <FormatRowItem
                format="HTML"
                isSelected={selectedFormats.includes("HTML")}
                onToggle={onToggleFormat}
                icon={<RiCodeSSlashLine style={{ width: "18px", height: "18px" }} />}
              />
              {selectedFormats.includes("HTML") && (
                <div style={styles.subSettingsPanel} onClick={(e) => e.stopPropagation()}>
                  <div style={styles.settingsRow}>
                    <span style={styles.settingsLabel}>Clean HTML</span>
                    <ToggleSwitch checked={htmlClean} onChange={setHtmlClean} />
                  </div>
                  <div style={styles.settingsRow}>
                    <span style={styles.settingsLabel}>Remove External Links</span>
                    <ToggleSwitch checked={removeExternalLinks} onChange={setRemoveExternalLinks} />
                  </div>
                  <div style={styles.settingsRow}>
                    <span style={styles.settingsLabel}>Relative to Absolute Links</span>
                    <ToggleSwitch checked={relativeToAbsoluteLinks} onChange={setRelativeToAbsoluteLinks} />
                  </div>
                  <div style={styles.settingsRow}>
                    <span style={styles.settingsLabel}>Remove Data Images</span>
                    <ToggleSwitch checked={removeDataImages} onChange={setRemoveDataImages} />
                  </div>
                  <div style={{ ...styles.settingsRow, flexDirection: "column" as const, alignItems: "flex-start", gap: "8px" }}>
                    <span style={styles.settingsLabel}>Ignore Tags</span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                      {["header", "footer", "nav", "form", "iframe", ".hidden"].map((tag) => (
                        <label
                          key={tag}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "12px",
                            color: "var(--text-primary)",
                            cursor: "pointer"
                          }}
                        >
                          <input
                            type="checkbox"
                            style={{ cursor: "pointer", accentColor: "var(--primary)" }}
                            checked={ignoreTags.includes(tag)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setIgnoreTags([...ignoreTags, tag]);
                              } else {
                                setIgnoreTags(ignoreTags.filter((t) => t !== tag));
                              }
                            }}
                          />
                          {tag}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* SCREENSHOT FORMAT */}
          {(!isScreenshotTab) && (
            <FormatRowItem
              format="Screenshot"
              isSelected={selectedFormats.includes("Screenshot")}
              onToggle={onToggleFormat}
              icon={<RiScreenshot2Line style={{ width: "18px", height: "18px" }} />}
            />
          )}
          {(isScreenshotTab || selectedFormats.includes("Screenshot")) && (
            <div style={{
              ...styles.subSettingsPanel,
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: "28px",
              padding: "16px 20px",
              backgroundColor: "var(--bg-page)",
              borderRadius: "12px",
              border: "1px solid var(--border-color)",
            }} onClick={(e) => e.stopPropagation()}>

              {/* Left Column: Screenshot Config */}
              <div style={{ flex: "1 1 260px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>
                  Screenshot Config
                </div>

                <div style={styles.settingsRow}>
                  <span style={styles.settingsLabel}>Full Page Screenshot</span>
                  <ToggleSwitch checked={screenshotFullPage} onChange={setScreenshotFullPage} />
                </div>
                <div style={styles.settingsRow}>
                  <span style={styles.settingsLabel}>Image Format</span>
                  <select
                    style={styles.selectInput}
                    value={screenshotFormat}
                    onChange={(e) => setScreenshotFormat(e.target.value as "jpg" | "png")}
                  >
                    <option value="jpg">JPG</option>
                    <option value="png">PNG</option>
                  </select>
                </div>
                {screenshotFormat === "jpg" && (
                  <div style={styles.settingsRow}>
                    <span style={styles.settingsLabel}>Quality (1-100)</span>
                    <input
                      type="number"
                      style={styles.settingsInput}
                      value={screenshotQuality}
                      onChange={(e) => setScreenshotQuality(Math.min(100, Math.max(1, parseInt(e.target.value))))}
                    />
                  </div>
                )}

                <div style={styles.settingsRow}>
                  <span style={styles.settingsLabel}>JS Render (Execute JS)</span>
                  <ToggleSwitch checked={jsRender} onChange={setJsRender} />
                </div>
              </div>

              {/* Right Column: Rendering Config */}
              {jsRender && (
                <div style={{ flex: "1 1 260px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>
                    Rendering Config
                  </div>

                  <div style={styles.settingsRow}>
                    <span style={styles.settingsLabel}>Render Timeout (ms)</span>
                    <input
                      type="number"
                      style={styles.settingsInput}
                      value={renderTimeout}
                      onChange={(e) => setRenderTimeout(parseInt(e.target.value))}
                    />
                  </div>

                  <div style={styles.settingsRow}>
                    <span style={styles.settingsLabel}>Auto Scroll Page</span>
                    <ToggleSwitch checked={autoScroll} onChange={setAutoScroll} />
                  </div>

                  {autoScroll && (
                    <div style={{ display: "flex", gap: "10px", marginTop: "2px" }}>
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
                        <span style={{ fontSize: "10px", color: "var(--text-secondary)", fontWeight: 600 }}>Delay (ms)</span>
                        <input
                          type="number"
                          style={{ ...styles.settingsInput, width: "100%" }}
                          value={scrollDelay}
                          onChange={(e) => setScrollDelay(parseInt(e.target.value))}
                        />
                      </div>
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
                        <span style={{ fontSize: "10px", color: "var(--text-secondary)", fontWeight: 600 }}>Max Scrolls</span>
                        <input
                          type="number"
                          style={{ ...styles.settingsInput, width: "100%" }}
                          value={maxScrolls}
                          onChange={(e) => setMaxScrolls(parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

          {!isScreenshotTab && (
            <>
              {/* SEO FORMAT */}
              <FormatRowItem
                format="SEO"
                isSelected={selectedFormats.includes("SEO")}
                onToggle={onToggleFormat}
                icon={<TbSeo style={{ width: "18px", height: "18px" }} />}
              />

              {/* IMAGES FORMAT */}
              <FormatRowItem
                format="Images"
                isSelected={selectedFormats.includes("Images")}
                onToggle={onToggleFormat}
                icon={<RiImage2Line style={{ width: "18px", height: "18px" }} />}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormatPopup;