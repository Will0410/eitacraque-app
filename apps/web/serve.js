#!/usr/bin/env node

import { spawn } from 'child_process';

const port = process.env.PORT || 8080;

const sirv = spawn('npx', ['sirv', 'dist', '--single', '--cors', '--port', port.toString()], {
  stdio: 'inherit',
  shell: true,
});

sirv.on('exit', (code) => {
  process.exit(code);
});
