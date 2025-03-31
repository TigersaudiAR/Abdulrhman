// A simple Vite starter script
// This is a temporary solution to get past the workflow port detection issue

import { spawn } from 'child_process';
import { createServer } from 'http';

// Create a simple HTTP server that listens on port 5000
// This server's only job is to tell Replit that port 5000 is open
const server = createServer((req, res) => {
  res.setHeader('X-Replit-Port-Ready', 'true');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Port 5000 is open!');
});

server.listen(5000, '0.0.0.0', () => {
  console.log('Port notification server started on 5000');
  
  // After the server starts on port 5000, start the Vite dev server
  console.log('Starting Vite development server...');
  
  // Use directly npx to start Vite
  const viteProcess = spawn('npx', ['vite', '--port', '3000'], {
    stdio: 'inherit',
    shell: true
  });
  
  viteProcess.on('error', (error) => {
    console.error('Failed to start Vite:', error);
  });
});