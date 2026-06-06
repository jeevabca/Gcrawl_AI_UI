import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'

/**
 * Vite plugin that adds a server-side image download proxy.
 * Handles GET requests to /api/download-image?url=<encoded-url>
 * Fetches the image server-side (bypassing browser CORS) and
 * returns it with Content-Disposition: attachment to force download.
 */
function imageDownloadProxy(): Plugin {
  return {
    name: 'image-download-proxy',
    configureServer(server) {
      server.middlewares.use('/api/download-image', async (req, res) => {
        try {
          const urlObj = new URL(req.url || '', 'http://localhost');
          const imageUrl = urlObj.searchParams.get('url');

          if (!imageUrl) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Missing url parameter' }));
            return;
          }

          // Fetch the image server-side (no CORS restrictions)
          const response = await fetch(imageUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
              'Accept': 'image/*,*/*',
            },
          });

          if (!response.ok) {
            res.statusCode = response.status;
            res.end(JSON.stringify({ error: `Failed to fetch image: ${response.statusText}` }));
            return;
          }

          // Extract filename from the URL
          const pathname = new URL(imageUrl).pathname;
          const filename = pathname.split('/').pop() || 'image';

          // Get content type from the response
          const contentType = response.headers.get('content-type') || 'application/octet-stream';

          // Stream the response back with download headers
          res.setHeader('Content-Type', contentType);
          res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
          res.setHeader('Cache-Control', 'no-cache');

          const buffer = Buffer.from(await response.arrayBuffer());
          res.end(buffer);
        } catch (err: any) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: err.message || 'Internal proxy error' }));
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), imageDownloadProxy()],
})
