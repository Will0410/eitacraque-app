#!/usr/bin/env node

import { createServer } from 'http';
import { readFileSync, statSync } from 'fs';
import { join, extname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const port = process.env.PORT || 4173;
const distPath = join(__dirname, 'dist');

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

function serveFile(filePath, res) {
  try {
    const content = readFileSync(filePath);
    const ext = extname(filePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
    res.end(content);
  } catch {
    res.writeHead(500);
    res.end('Error');
  }
}

createServer((req, res) => {
  let url = req.url.split('?')[0];
  
  // Handle root path
  if (url === '/') url = '/index.html';
  
  const filePath = join(distPath, url);
  
  // Security check
  if (!resolve(filePath).startsWith(resolve(distPath))) {
    res.writeHead(403);
    return res.end('Forbidden');
  }
  
  try {
    const stat = statSync(filePath);
    if (stat.isDirectory()) {
      return serveFile(join(filePath, 'index.html'), res);
    }
    return serveFile(filePath, res);
  } catch {
    // File not found - serve index.html for SPA routing
    const indexFile = join(distPath, 'index.html');
    return serveFile(indexFile, res);
  }
}).listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});