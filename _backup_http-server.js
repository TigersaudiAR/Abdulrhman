// Minimal HTTP server for Replit
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 5000;

// Create a basic HTTP server
const server = http.createServer((req, res) => {
  // Set the Replit port ready header
  res.setHeader('X-Replit-Port-Ready', 'true');
  
  // Handle different routes
  if (req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
    return;
  }
  
  // For any other path, serve the index.html file
  const filePath = path.join(__dirname, 'public', 'index.html');
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end(`Error loading the file: ${err.message}`);
      return;
    }
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(content);
  });
});

// Start the server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`⚡️ PURE NODE.JS SERVER RUNNING ON PORT ${PORT}`);
  console.log(`X-Replit-Port-Ready header is set on all responses`);
});

// Heartbeat to keep logs active
setInterval(() => {
  console.log(`HTTP server heartbeat at ${new Date().toISOString()}`);
}, 2000);