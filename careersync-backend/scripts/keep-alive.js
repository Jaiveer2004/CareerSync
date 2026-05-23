const https = require('https');

// Keep-alive script to prevent Render server from sleeping (Free Tier idle shutdown)
const PING_URL = process.env.PING_URL || 'https://careersync-n2sr.onrender.com/api/health';
const INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

if (process.env.NODE_ENV !== 'development') {
  console.log(`[Keep-Alive] Initialized. Pinging ${PING_URL} every 5 minutes.`);
  
  // Send a startup check ping
  https.get(PING_URL, (res) => {
    console.log(`[Keep-Alive] Startup ping sent. Status code: ${res.statusCode}`);
  }).on('error', (err) => {
    console.error(`[Keep-Alive] Startup ping failed: ${err.message}`);
  });

  // Schedule loop every 5 minutes
  setInterval(() => {
    https.get(PING_URL, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ [Keep-Alive] Server pinged successfully to keep it awake.');
      } else {
        console.log(`⚠️ [Keep-Alive] Expected 200 OK, got: ${res.statusCode}`);
      }
    }).on('error', (err) => {
      console.error('❌ [Keep-Alive] Error keeping server awake:', err.message);
    });
  }, INTERVAL);
} else {
  console.log('[Keep-Alive] Development environment detected. Ping timer disabled.');
}
