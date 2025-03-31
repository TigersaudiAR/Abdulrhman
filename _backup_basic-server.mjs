import express from 'express';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const PORT = 5000;

// Critical: Add Replit port ready header
app.use((req, res, next) => {
  res.setHeader('X-Replit-Port-Ready', 'true');
  next();
});

// Serve static files from public directory
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));
console.log(`Serving static files from: ${publicPath}`);

// Check if index.html exists
const indexPath = path.join(publicPath, 'index.html');
if (fs.existsSync(indexPath)) {
  console.log(`Found index.html at: ${indexPath}`);
} else {
  console.log(`WARNING: index.html not found at: ${indexPath}`);
}

// Simple route to test the server
app.get('/api/test', (req, res) => {
  res.json({ status: 'ok', message: 'API is working' });
});

// Catch-all route to serve index.html
app.get('*', (req, res) => {
  res.sendFile(indexPath);
});

// Start listening
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`X-Replit-Port-Ready header is set on all responses`);
  console.log(`Visit http://localhost:${PORT} to see the app`);
});

// Log periodically to show server is running
let count = 0;
setInterval(() => {
  count++;
  console.log(`Server heartbeat ${count} at ${new Date().toISOString()}`);
}, 1000);