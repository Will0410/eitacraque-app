#!/usr/bin/env node

import { execSync } from 'child_process';

const port = process.env.PORT || 4173;
const cmd = `npx vite preview --port ${port} --host`;

console.log(`Starting Vite preview on port ${port}...`);
execSync(cmd, { stdio: 'inherit' });
