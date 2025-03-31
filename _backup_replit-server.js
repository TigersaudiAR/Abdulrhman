// Replit compatible server that handles both client and server code
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express application
const app = express();
app.use(express.json());

// Define port - using 5000 to match the Replit configuration
const PORT = 5000;

// CRITICAL: Add the X-Replit-Port-Ready header to all responses
app.use((req, res, next) => {
  res.setHeader('X-Replit-Port-Ready', 'true');
  next();
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
console.log(`Serving static files from: ${path.join(__dirname, 'public')}`);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Basic API for user settings
app.get('/api/user-settings', (req, res) => {
  // Return default settings
  res.json({
    reciter: 'ar.alafasy',
    translation: 'en.sahih',
    fontSize: 1.2,
    showTranslation: true,
    autoPlayAudio: false,
    prayerMethod: 2,
    showNextPrayer: true,
    highlightCurrentVerse: true,
    autoSaveLastRead: true
  });
});

// API for Quran pages
app.get('/api/quran/page/:pageNumber', (req, res) => {
  const pageNumber = req.params.pageNumber;
  // For now, we return a stub response
  res.json({
    pageNumber: parseInt(pageNumber),
    verses: [
      { surahNumber: 1, verseNumber: 1, text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' },
      { surahNumber: 1, verseNumber: 2, text: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ' },
      { surahNumber: 1, verseNumber: 3, text: 'الرَّحْمَٰنِ الرَّحِيمِ' }
    ]
  });
});

// All other routes that don't match any static files or API endpoints, 
// serve index.html (for SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start listening
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ SERVER RUNNING ON PORT ${PORT}`);
  console.log(`Replit header X-Replit-Port-Ready is set on all responses`);
  console.log(`Server is now available!`);
});

// Heartbeat to keep logs active
setInterval(() => {
  console.log(`Server heartbeat at ${new Date().toISOString()}`);
}, 2000);