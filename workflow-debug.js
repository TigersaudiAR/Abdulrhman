import http from 'http';
import net from 'net';

async function debugWorkflow() {
  console.log('====== WORKFLOW DEBUGGING INFO ======');
  console.log(`Date/Time: ${new Date().toISOString()}`);
  console.log('Checking port 5000...');
  
  // Check if port 5000 is open
  const isPortOpen = await checkPort(5000);
  console.log(`Port 5000 is ${isPortOpen ? 'OPEN' : 'CLOSED'}`);
  
  // Check if HTTP server is responding
  console.log('Attempting to connect to HTTP server on port 5000...');
  try {
    const response = await httpRequest('http://localhost:5000/api/health');
    console.log('HTTP Server responded with:');
    console.log(`Status: ${response.statusCode}`);
    console.log(`Headers: ${JSON.stringify(response.headers, null, 2)}`);
    console.log(`Body: ${response.body}`);
  } catch (error) {
    console.error('Error connecting to HTTP server:', error.message);
  }
  
  console.log('====== END DEBUGGING INFO ======');
}

// Helper function to check if a port is open
function checkPort(port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    
    const onError = () => {
      socket.destroy();
      resolve(false);
    };
    
    socket.setTimeout(1000);
    socket.once('error', onError);
    socket.once('timeout', onError);
    
    socket.connect(port, '127.0.0.1', () => {
      socket.end();
      resolve(true);
    });
  });
}

// Helper function to make HTTP request
function httpRequest(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve({ 
          statusCode: res.statusCode,
          headers: res.headers,
          body
        });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Run the debug function
debugWorkflow();