#!/usr/bin/env node

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = process.env.PORT || 4173;
const distPath = path.resolve(__dirname, 'apps/web/dist');

console.log(`[Web Server] Starting on port ${port}`);
console.log(`[Web Server] Dist path: ${distPath}`);

// Verify dist exists
if (!fs.existsSync(distPath)) {
  console.error(`[Web Server] ERROR: Dist directory not found at ${distPath}`);
  process.exit(1);
}

if (!fs.existsSync(path.join(distPath, 'index.html'))) {
  console.error(`[Web Server] ERROR: index.html not found in dist`);
  process.exit(1);
}

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.jsx': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.map': 'application/json',
};

const server = http.createServer((req, res) => {
  // Normalize URL - handle root path
  let urlPath = decodeURIComponent(req.url);
  if (urlPath.startsWith('/')) {
    urlPath = urlPath.slice(1);
  }

  let filePath = path.resolve(path.join(distPath, urlPath));

  // Security: ensure requested path is within dist folder
  if (!filePath.startsWith(path.resolve(distPath))) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found', statusCode: 404 }));
    return;
  }

  // If path ends with / or is empty, serve index.html
  if (urlPath === '' || urlPath.endsWith('/')) {
    filePath = path.join(distPath, 'index.html');
  } else if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
  } else {
    // For SPA routes (no file extension), serve index.html
    const isAssetRequest = /\.\w+$/.test(urlPath);
    if (!isAssetRequest) {
      filePath = path.join(distPath, 'index.html');
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not Found', statusCode: 404 }));
      return;
    }
  }

  // Get content type
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  // Read and serve file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      console.error(`[Web Server] Error reading ${filePath}:`, err.message);
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not Found', statusCode: 404 }));
      return;
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

server.on('error', (err) => {
  console.error('[Web Server] Server error:', err);
  process.exit(1);
});

server.listen(port, '0.0.0.0', () => {
  console.log(`[Web Server] ✓ Server running on http://0.0.0.0:${port}`);
  console.log(`[Web Server] ✓ Serving ${distPath}`);
});

process.on('SIGTERM', () => {
  console.log('[Web Server] SIGTERM received, closing...');
  server.close(() => {
    console.log('[Web Server] Server closed');
    process.exit(0);
  });
});
