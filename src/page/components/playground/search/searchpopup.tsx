import { FiHash } from "react-icons/fi";
import { useTheme } from "../../../../utils/theme";

interface SearchPopupProps {
  isOpen: boolean;
  onClose: () => void;
  limit: number;
  setLimit: (val: number) => void;
}

export default function SearchPopup({
  isOpen,
  onClose,
  limit,
  setLimit,
}: SearchPopupProps) {
  if (!isOpen) return null;

  const handleReset = () => {
    setLimit(10);
  };

    const { isDarkMode } = useTheme();

  return (
    <div
      className="search-popup-card"
      style={{
        position: "absolute",
        bottom: "auto",
        top: 0,
        right: "auto",
        left: "calc(100% + 10px)",
        width: "300px",
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
              Limit (Max 100)
            </span>
          </div>
          <input
            type="number"
            value={limit}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (isNaN(val)) setLimit(1);
              else setLimit(Math.min(100, Math.max(1, val)));
            }}
            max={100}
            min={1}
            style={{
              width: "80px",
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
