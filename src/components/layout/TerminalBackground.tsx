import type { ReactNode } from "react";

const LEFT_LINES = [
  '{ "sensor_id": "ANALYTICS_01",',
  '  "status": "ACTIVE",',
  '  "metrics": {',
  '    "cpu": "42%",',
  '    "latency": "12ms",',
  '    "throughput": "1.2gbps"',
  '  },',
  '  "nodes": [',
  '    "us-east",',
  '    "eu-west",',
  '    "ap-south"',
  '  ]',
  "}",
  "",
  '{ "sensor_id": "ANALYTICS_02",',
  '  "status": "ACTIVE",',
  '  "metrics": {',
  '    "cpu": "38%",',
  '    "latency": "9ms",',
  '    "throughput": "0.9gbps"',
  "  },",
  '  "nodes": [',
  '    "us-west",',
  '    "eu-north"',
  "  ]",
  "}",
  "",
];

const MID_LINES = [
  "* STATUS: SCRAPING_IN_PROGRESS",
  "* PAGES_DISCOVERED: 12",
  "* DATA_EXTRACTED: 3.4 KB",
  "> FETCHING_BLOCK_RESOURCES...",
  "* STATUS: SCRAPING_IN_PROGRESS",
  "* PAGES_DISCOVERED: 18",
  "> EXTRACTING_METADATA...",
  "* STATUS: COMPLETE",
  "* DATA_EXTRACTED: 7.1 KB",
  "",
  "* STATUS: SCRAPING_IN_PROGRESS",
  "* PAGES_DISCOVERED: 5",
  "> FETCHING_BLOCK_RESOURCES...",
  "> EXTRACTING_METADATA...",
  "",
];

const RIGHT_LINES = [
  "FETCHING_BLOCK_RESOURCES... SUCCESS",
  "FETCHING_BLOCK_RESOURCES... SUCCESS",
  "FETCHING_BLOCK_RESOURCES... SUCCESS",
  "FETCHING_BLOCK_RESOURCES... SUCCESS",
  "FETCHING_BLOCK_RESOURCES... SUCCESS",
  "FETCHING_BLOCK_RESOURCES... SUCCESS",
  "FETCHING_BLOCK_RESOURCES... SUCCESS",
  "FETCHING_BLOCK_RESOURCES... SUCCESS",
  "FETCHING_BLOCK_RESOURCES... SUCCESS",
  "0x4F 0xAC 0x22 0x11 0x88",
  "0x4F 0xAC 0x22 0x11 0x88",
  "0x4F 0xAC 0x22 0x11 0x88",
  "0x4F 0xAC 0x22 0x11 0x88",
  "FETCHING_BLOCK_RESOURCES... SUCCESS",
  "FETCHING_BLOCK_RESOURCES... SUCCESS",
  "0x1A 0x3B 0x77 0x0F 0xCC",
  "0x1A 0x3B 0x77 0x0F 0xCC",
  "",
];

interface ScrollingColumnProps {
  lines: string[];
  duration: number;
  style?: React.CSSProperties;
}

function ScrollingColumn({ lines, duration, style }: ScrollingColumnProps) {
  const doubled = [...lines, ...lines];

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        overflow: "hidden",
        height: "100%",
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: "11px",
        lineHeight: "1.7",
        color: "var(--text-scrolling, #4a6fa5)",
        whiteSpace: "pre",
        padding: "12px",
        pointerEvents: "none",
        userSelect: "none",
        ...style,
      }}
    >
      <div
        style={{
          animation: `terminalScrollUp ${duration}s linear infinite`,
        }}
      >
        {doubled.map((line, i) => (
          <div key={i}>{line || "\u00A0"}</div>
        ))}
      </div>
    </div>
  );
}

interface TerminalBackgroundProps {
  children: ReactNode;
}

export default function TerminalBackground({ children }: TerminalBackgroundProps) {
  return (
    <div
      className="terminal-bg-container"
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        background: "var(--bg-page)",
        overflow: "hidden",
      }}
    >
      {/* Keyframe and variable injection */}
      <style>{`
        @keyframes terminalScrollUp {
          from { transform: translateY(0); }
          to   { transform: translateY(-50%); }
        }
        :root {
          --text-scrolling: rgba(74, 111, 165, 0.45);
        }
        .dark-theme, :root.dark-theme, html.dark-theme, body.dark-theme {
          --text-scrolling: rgba(59, 130, 246, 0.18) !important;
        }
      `}</style>

      {/* Left — JSON data */}
      <ScrollingColumn
        lines={LEFT_LINES}
        duration={16}
        style={{ left: 0, width: "38%", opacity: 0.7 }}
      />

      {/* Mid — status messages */}
      <ScrollingColumn
        lines={MID_LINES}
        duration={12}
        style={{ left: "38%", width: "26%", opacity: 0.6 }}
      />

      {/* Right — success logs + hex bytes */}
      <ScrollingColumn
        lines={RIGHT_LINES}
        duration={20}
        style={{ right: 0, width: "36%", opacity: 0.7 }}
      />

      {/* Foreground content sits on top */}
      <div style={{ position: "relative", zIndex: 10 }}>
        {children}
      </div>
    </div>
  );
}
