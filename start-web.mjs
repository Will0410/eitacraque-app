#!/usr/bin/env node

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = process.env.PORT || 4173;
const distPath = path.join(__dirname, 'apps', 'web', 'dist');

console.log(`[Server] Starting on port ${port}`);
console.log(`[Server] Dist path: ${distPath}`);

if (!fs.existsSync(distPath)) {
  console.error(`[Server] Dist not found at ${distPath}`);
  process.exit(1);
}

const mime = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  let url = req.url.split('?')[0];
  
  let file = path.join(distPath, url === '/' ? 'index.html' : url);
  
  if (fs.existsSync(file) && fs.statSync(file).isFile()) {
    const ext = path.extname(file);
    res.writeHead(200, { 'Content-Type': mime[ext] || 'text/plain' });
    fs.createReadStream(file).pipe(res);
  } else {
    const indexPath = path.join(distPath, 'index.html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream(indexPath).pipe(res);
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`[Server] Running on http://0.0.0.0:${port}`);
});