const cron = require('node-cron');
const https = require('https');

// Ping the server every minute to prevent it from sleeping on free hosting tiers (like Render)
const pingServerJob = cron.schedule('*/1 * * * *', () => {
  // Use the actual deployed server URL, default to the known Render URL
  const serverUrl = process.env.PING_URL || 'https://homesync-n2sr.onrender.com/api/health';
  
  https.get(serverUrl, (res) => {
    if (res.statusCode === 200) {
      console.log('✅ Server pinged successfully to keep it awake.');
    } else {
      console.log(`⚠️ Expected 200 OK from ping, got: ${res.statusCode}`);
    }
  }).on('error', (err) => {
    console.error('❌ Error keeping server awake:', err.message);
  });
});

module.exports = pingServerJob;
