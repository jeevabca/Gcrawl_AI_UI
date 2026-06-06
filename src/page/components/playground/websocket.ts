import { useRef, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import type { ScrapedPage } from "./usePlayground";
import useAxios from "../../../services";


interface UseWebSocketProps {
  addLog: (msg: string) => void;
  setScrapedPages: React.Dispatch<React.SetStateAction<ScrapedPage[]>>;
  storeInlineContent: (content: string, type: string, pageIndex: number) => void;
  setIsLoading: (loading: boolean) => void;
}


export function useWebSocket({
  addLog,
  setScrapedPages,
  storeInlineContent,
  setIsLoading,
}: UseWebSocketProps) {
  const wsRef = useRef<WebSocket | null>(null);

  const [getContent] = useAxios<any, any>({
    endpoint: "GET_CRAWL_CONTENT",
    hideErrorMsg: true,
  });



  const startWebSocket = useCallback(
    async (id: string) => {
      const baseUrl =
        import.meta.env.VITE_BASE_URL;
      const wsHost = baseUrl.replace(/^http/, "ws");
      console.log("WebSocket Host:", wsHost);
      const wsUrl = `${wsHost}/crawl/${id}`;
      console.log("WebSocket URL:", wsUrl);

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
              pageIndex: data.page - 1, // backend sends 1-indexed page
              title: data.title || data.start_url || `Page ${data.page}`
            };

            setScrapedPages((prev) => {
              const existing = [...prev];
              const idx = existing.findIndex(
                (p) => p.pageIndex === newPage.pageIndex
              );
              if (idx === -1) {
                existing.push(newPage);
              }
              return existing.sort((a, b) => a.pageIndex - b.pageIndex);
            });

            // Fetch the updated content for this page when it is processed
            getContent({ path: `/${id}` }).then((res) => {
              const actualData = res?.data || res;
              const pages = Array.isArray(actualData) ? actualData : (actualData?.pages || actualData?.data);
              
              if (pages && pages.length > 0) {
                pages.forEach((page: any, idx: number) => {
                  setScrapedPages((prev) => {
                    const existing = [...prev];
                    const foundIdx = existing.findIndex((p) => p.pageIndex === idx);
                    if (foundIdx === -1) {
                      existing.push({
                        pageIndex: idx,
                        title: page.title || page.start_url || `Page ${idx + 1}`
                      });
                    }
                    return existing.sort((a, b) => a.pageIndex - b.pageIndex);
                  });

                  if (page.markdown_content) storeInlineContent(page.markdown_content, "markdown", idx);
                  if (page.html_content) storeInlineContent(page.html_content, "html", idx);
                  if (page.links) storeInlineContent(typeof page.links === "object" ? JSON.stringify(page.links, null, 2) : page.links, "links", idx);
                  if (page.images_json) storeInlineContent(typeof page.images_json === "object" ? JSON.stringify(page.images_json, null, 2) : page.images_json, "images", idx);
                  if (page.seo_json) storeInlineContent(typeof page.seo_json === "object" ? JSON.stringify(page.seo_json, null, 2) : page.seo_json, "seo", idx);
                  if (page.seo_md) storeInlineContent(page.seo_md, "seo_md", idx);
                  if (page.seo_json) storeInlineContent(typeof page.seo_json === "object" ? JSON.stringify(page.seo_json, null, 2) : page.seo_json, "seo_json", idx);
                  if (page.seo_xlsx_s3_url) storeInlineContent(page.seo_xlsx_s3_url, "seo_xlsx_s3_url", idx);
                  if (page.screenshot_s3_url) storeInlineContent(page.screenshot_s3_url, "screenshot", idx);
                });
              }
            });

          } else if (data.type === "crawl_completed") {
            toast.success("Crawling job completed successfully!");
            socket.close();

            // Fetch the final content after crawl completes and turn off loading
            getContent({ path: `/${id}` }).then((res) => {
              const actualData = res?.data || res;
              const pages = Array.isArray(actualData) ? actualData : (actualData?.pages || actualData?.data);
              
              if (pages && pages.length > 0) {
                pages.forEach((page: any, idx: number) => {
                  if (page.markdown_content) storeInlineContent(page.markdown_content, "markdown", idx);
                  if (page.html_content) storeInlineContent(page.html_content, "html", idx);
                  if (page.links) storeInlineContent(typeof page.links === "object" ? JSON.stringify(page.links, null, 2) : page.links, "links", idx);
                  if (page.images_json) storeInlineContent(typeof page.images_json === "object" ? JSON.stringify(page.images_json, null, 2) : page.images_json, "images", idx);
                  if (page.seo_json) storeInlineContent(typeof page.seo_json === "object" ? JSON.stringify(page.seo_json, null, 2) : page.seo_json, "seo", idx);
                  if (page.seo_md) storeInlineContent(page.seo_md, "seo_md", idx);
                  if (page.seo_json) storeInlineContent(typeof page.seo_json === "object" ? JSON.stringify(page.seo_json, null, 2) : page.seo_json, "seo_json", idx);
                  if (page.seo_xlsx_s3_url) storeInlineContent(page.seo_xlsx_s3_url, "seo_xlsx_s3_url", idx);
                  if (page.screenshot_s3_url) storeInlineContent(page.screenshot_s3_url, "screenshot", idx);
                });
              }
              setIsLoading(false);
            }).catch(() => {
              setIsLoading(false);
            });
          }
        } catch (err) {
          console.error("Error parsing WebSocket message:", err);
        }
      };

      socket.onerror = (err) => {
        console.error("WebSocket Error:", err);
        addLog(
          "WebSocket connection error. Falling back..."
        );
        setIsLoading(false);
      };

      socket.onclose = () => {
        addLog("WebSocket connection closed.");
      };
    },
    [storeInlineContent, addLog, setScrapedPages, setIsLoading, getContent]
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
