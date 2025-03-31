const express = require('express');

const app = express();
const PORT = 5000;

// Add this header to all responses
app.use((req, res, next) => {
  res.setHeader('X-Replit-Port-Ready', 'true');
  next();
});

app.get('/', (req, res) => {
  res.send('Quran Application Server is running (CommonJS version)');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});

// Log heartbeat
setInterval(() => {
  console.log(`Server heartbeat at ${new Date().toISOString()}`);
}, 2000);