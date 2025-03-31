import express from 'express';

const app = express();
const PORT = 5000;

// Very important: Add a header to let Replit know the port is ready
app.use((req, res, next) => {
  res.setHeader('X-Replit-Port-Ready', 'true');
  next();
});

app.get('/', (req, res) => {
  res.send('Quran Application Server is running');
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