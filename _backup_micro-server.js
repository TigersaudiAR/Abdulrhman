// Extremely minimal server for Replit
import express from 'express';

const app = express();
const PORT = 5000;

// Add Replit port ready header - CRITICAL
app.use((req, res, next) => {
  res.setHeader('X-Replit-Port-Ready', 'true');
  next();
});

// Simple route to test the server
app.get('/api/test', (req, res) => {
  res.json({ status: 'ready' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`SUPER SIMPLE SERVER RUNNING ON PORT ${PORT}`);
});

// Heartbeat to keep logs active
setInterval(() => {
  console.log(`Server heartbeat at ${new Date().toISOString()}`);
}, 2000);