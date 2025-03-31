// Simple Express server to get past port detection
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createServer } from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create express app
const app = express();
const server = createServer(app);

// Serve static client files
app.use(express.static(join(__dirname, 'client')));

// Root route with critical header
app.get('/', (req, res) => {
  res.setHeader('X-Replit-Port-Ready', 'true');
  res.sendFile(join(__dirname, 'client/index.html'));
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Start server
const PORT = 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.clear();
  console.log(`
=================================================
✅ ULTRA SIMPLE SERVER RUNNING ON PORT ${PORT}
=================================================
  `);
  
  console.log(`Server is listening at http://0.0.0.0:${PORT}`);
  
  // Log heartbeat
  setInterval(() => {
    console.log(`Server heartbeat at ${new Date().toISOString()}`);
  }, 5000);
});