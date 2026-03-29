require('dotenv').config();

const http = require('http');
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 8000;

// Create HTTP Server:
const server = http.createServer(app);


// Connect to DB
connectDB();


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = server;