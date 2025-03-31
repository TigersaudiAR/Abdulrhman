// Simple starter script for Replit server
// This script will import the main server file
console.log('Starting Replit server...');
import('./replit-server.js')
  .then(() => {
    console.log('Server module imported successfully');
  })
  .catch(err => {
    console.error('Failed to import server module:', err);
  });