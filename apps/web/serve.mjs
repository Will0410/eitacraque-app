#!/usr/bin/env node

import { execSync } from 'child_process';

const port = process.env.PORT || 8080;
const cmd = `npx serve -s dist -l ${port}`;

console.log(`Starting server on port ${port}...`);
execSync(cmd, { stdio: 'inherit' });
