  // Helper to extract hostname for favicon
  export const getHostname = (url: string) => {
    try {
      const u = url.startsWith("http") ? url : `https://${url}`;
      return new URL(u).hostname;
    } catch (e) {
      return "example.com";
    }
  };