#!/usr/bin/env node

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = process.env.PORT || 4173;
const distPath = path.join(__dirname, 'dist');

console.log(`[Server] Starting on port ${port}`);
console.log(`[Server] Dist path: ${distPath}`);

if (!fs.existsSync(distPath)) {
  console.error(`[Server] Dist not found at ${distPath}`);
  process.exit(1);
}

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];

  // Remove leading slash
  if (urlPath.startsWith('/')) urlPath = urlPath.slice(1);

  let filePath = path.join(distPath, urlPath);

  // Security check
  if (!path.resolve(filePath).startsWith(path.resolve(distPath))) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  // Check if file exists
  if (fs.existsSync(filePath)) {
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
  } else {
    // SPA fallback - check if it's an asset request
    const isAsset = /\.\w+$/.test(urlPath);
    if (!isAsset) {
      filePath = path.join(distPath, 'index.html');
    } else {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'text/plain';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      console.error(`Error reading ${filePath}:`, err.message);
      res.writeHead(500);
      res.end('Internal Server Error');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`[Server] Running on http://0.0.0.0:${port}`);
});
