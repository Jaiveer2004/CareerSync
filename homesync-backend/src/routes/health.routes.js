const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/health', (req, res) => {
  const healthCheck = {
    status: 'OK',
    uptime: process.uptime(),
    timestamp: Date.now(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
  };

  const statusCode = healthCheck.database === 'connected' ? 200 : 503;
  
  res.status(statusCode).json(healthCheck);
});

module.exports = router;
