import express from 'express';
import { createServer } from 'http';
import { registerRoutes } from './routes';
import { setupVite } from './vite';
import path from 'path';
import fs from 'fs';

// Create Express application with JSON support
const app = express();
app.use(express.json());

// يصرح لجميع المسارات (CORS) مع إعدادات موسعة
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  // معالجة طلبات OPTIONS قبل الطلبات الفعلية
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Define port - we need to use port 5000 for Replit workflows to work correctly
const isDev = process.env.NODE_ENV !== 'production';
// In development, always use port 5000 for Replit to properly expose it
const PORT = Number(process.env.PORT) || 5000;

// Serve static files from the public directory with improved caching
const staticOptions = { 
  maxAge: isDev ? 0 : '1h',
  etag: true,
  lastModified: true
};

// Serve static files from the public directory
app.use('/assets', express.static(path.join(process.cwd(), 'public/assets'), staticOptions));
app.use('/fonts', express.static(path.join(process.cwd(), 'public/fonts'), staticOptions));
app.use('/images', express.static(path.join(process.cwd(), 'public/images'), staticOptions));
app.use('/test.html', express.static(path.join(process.cwd(), 'public/test.html'), staticOptions));

// Add a fallback static directory for all other static assets
app.use(express.static(path.join(process.cwd(), 'public'), staticOptions));

// سجل المسارات الإضافية للتصحيح
console.log(`Environment: ${isDev ? 'Development' : 'Production'}`);
console.log('Static paths:');
console.log(`- Assets path: ${path.join(process.cwd(), 'public/assets')}`);
console.log(`- Fonts path: ${path.join(process.cwd(), 'public/fonts')}`);
console.log(`- Images path: ${path.join(process.cwd(), 'public/images')}`);
console.log(`- Test path: ${path.join(process.cwd(), 'public/test.html')}`);
console.log(`- Fallback path: ${path.join(process.cwd(), 'public')}`);

// Set up the header for all responses
app.use((req, res, next) => {
  res.setHeader('X-Replit-Port-Ready', 'true');
  next();
});

// مسار الـ API الرئيسي - سيتم التعامل مع مسار الصفحة الرئيسية من قِبل Vite
app.get('/api', (req, res) => {
  res.json({
    message: 'Quran Application API is running',
    status: 'available',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), env: process.env.NODE_ENV || 'development' });
});

// Verify environment and file paths for debugging
app.get('/api/debug', (req, res) => {
  // التحقق من وجود الملفات الهامة
  const clientDir = path.resolve(process.cwd(), 'client');
  const mainTsxPath = path.resolve(clientDir, 'src', 'main.tsx');
  const clientIndexPath = path.resolve(clientDir, 'index.html');
  const publicDir = path.resolve(process.cwd(), 'public');
  
  const debugInfo = {
    env: process.env.NODE_ENV || 'development',
    port: PORT,
    paths: {
      cwd: process.cwd(),
      clientDir: {
        path: clientDir,
        exists: fs.existsSync(clientDir)
      },
      mainTsx: {
        path: mainTsxPath,
        exists: fs.existsSync(mainTsxPath)
      },
      clientIndex: {
        path: clientIndexPath,
        exists: fs.existsSync(clientIndexPath)
      },
      publicDir: {
        path: publicDir,
        exists: fs.existsSync(publicDir)
      }
    }
  };
  
  res.json(debugInfo);
});

// Create HTTP server
const server = createServer(app);

// Register API routes
registerRoutes(app);

// التحقق من وجود ملف main.tsx
const mainTsxPath = path.resolve(process.cwd(), 'client', 'src', 'main.tsx');
if (fs.existsSync(mainTsxPath)) {
  console.log(`Found main.tsx at ${mainTsxPath}`);
} else {
  console.error(`Missing main.tsx file at ${mainTsxPath}`);
  // في حالة النشر، إذا لم يكن الملف موجودًا، فقد تكون هناك مشكلة خطيرة
  if (!isDev) {
    console.error('Critical error: main.tsx is missing in production build!');
  }
}

// Setup Vite for frontend (do this after registering our routes)
setupVite(app, server);

// Start server explicitly on 0.0.0.0 to make it externally accessible
server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ SERVER RUNNING ON PORT ${PORT}`);
  console.log(`🚀 Server available at http://0.0.0.0:${PORT}`);

  // Log port ready indicator for Replit
  console.log('X-Replit-Port-Ready: true');
  console.log('X-Replit-Port-Ready header added to all responses');
  
  // Additional logging to indicate Replit port-ready status
  console.log(`Server is listening on port ${PORT} and ready for connections`);
});

// Log heartbeat every 5 seconds to keep console active (less frequent in production)
const heartbeatInterval = isDev ? 5000 : 30000;
setInterval(() => {
  console.log(`Server heartbeat at ${new Date().toISOString()}`);
}, heartbeatInterval);