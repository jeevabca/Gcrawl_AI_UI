import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import { ssgPlugin } from 'vite-plugin-ssg'

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
  plugins: [
    react(),
    imageDownloadProxy(),
    ssgPlugin({
      // Point this to your pages directory or a specific file
      pages: ['src/page/components/landing/landing.tsx'],
      // Put your SSG options here instead of the root `ssgOptions`
      config: {
        outDir: 'dist/static',
        vite: {
          plugins: [
            {
              name: 'mock-css-in-ssr',
              enforce: 'pre',
              resolveId(source, _importer, options) {
                // Intercept CSS imports in SSR and route them to a virtual JS module
                // so Vite's css-post plugin doesn't try to process them
                if (options?.ssr && source.endsWith('.css')) {
                  return '\0mock-css.js';
                }
              },
              load(id, options) {
                if (options?.ssr && id === '\0mock-css.js') {
                  return 'export default {}';
                }
              }
            }
          ]
        }
      }
    })
  ],
})

