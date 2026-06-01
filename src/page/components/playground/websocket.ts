import { useRef, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import type { ScrapedPage } from "./usePlayground";

interface UseWebSocketProps {
  addLog: (msg: string) => void;
  setScrapedPages: React.Dispatch<React.SetStateAction<ScrapedPage[]>>;
  processPageFormats: (page: any, idx: number) => void;
  setIsLoading: (loading: boolean) => void;
  fetchResultsFromPaths: (jobId: string, retryCount?: number) => void;
  fetchFormat: (
    filePath: string,
    type: string,
    pageIndex: number
  ) => Promise<void>;
}

export function useWebSocket({
  addLog,
  setScrapedPages,
  processPageFormats,
  setIsLoading,
  fetchResultsFromPaths,
  fetchFormat
}: UseWebSocketProps) {
  const wsRef = useRef<WebSocket | null>(null);

  const startWebSocket = useCallback(
    (id: string) => {
        console.log("id------------------------------------->>>>>>>>>>>>>>>>>>",id)
      addLog(`Opening WebSocket connection for crawl job ${id}...`);
      const baseUrl =
        import.meta.env.VITE_BASE_URL;
      const wsHost = baseUrl.replace(/^http/, "ws");

      // Build WS URL with auth params – the browser WebSocket API doesn't support
      // custom headers, so we pass the token & API key as query parameters.
      const token = Cookies.get("token");
      const wsParams = new URLSearchParams();
      if (token) wsParams.set("token", token);
      wsParams.set("api_key", "gspl-260526105644+84b437a1");
      const wsUrl = `${wsHost}/crawl/${id}?${wsParams.toString()}`;

      const socket = new WebSocket(wsUrl);
      wsRef.current = socket;

      socket.onopen = () => {
        addLog("WebSocket connection successfully established!");
      };

      socket.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("WebSocket Event:", data);

          if (data.type === "page_processed") {

            const newPage: ScrapedPage = {
              pageIndex: data.page,
            };

            setScrapedPages((prev) => {
              const existing = [...prev];
              const idx = existing.findIndex(
                (p) => p.pageIndex === data.page
              );
              if (idx === -1) {
                existing.push(newPage);
              }
              return existing.sort((a, b) => a.pageIndex - b.pageIndex);
            });

            processPageFormats(data, data.page);
          } else if (data.type === "crawl_completed") {
            if (data.links_file_path) {
            await fetchFormat(
              data.links_file_path,
              "links",
              0
            );
          }
  // addLog("Crawl job completed successfully!");
  toast.success("Crawling job completed successfully!");
  setIsLoading(false);
  socket.close();              // ✅ WS page_processed events already fetched content
}
        } catch (err) {
          console.error("Error parsing WebSocket message:", err);
        }
      };

      socket.onerror = (err) => {
        console.error("WebSocket Error:", err);
        addLog(
          "WebSocket connection error. Falling back to REST polling..."
        );
        fetchResultsFromPaths(id);
      };

      socket.onclose = () => {
        addLog("WebSocket connection closed.");
      };
    },
    [processPageFormats, addLog, setScrapedPages, setIsLoading, fetchResultsFromPaths]
  );

  // Cleanup WebSocket on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return { startWebSocket, wsRef };
}
