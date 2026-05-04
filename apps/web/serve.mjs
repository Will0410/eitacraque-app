#!/usr/bin/env node

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = process.env.PORT || 4173;
const distPath = join(__dirname, 'dist');

console.log(`Starting Vite preview on port ${port} from ${distPath}...`);
execSync(`npx vite preview --port ${port} --host`, {
  stdio: 'inherit',
  cwd: __dirname
});
