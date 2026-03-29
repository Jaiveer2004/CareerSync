const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');


const healthRoutes = require('./routes/health.routes');

const app = express();

// Middlewares:
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// API Welcome Route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Fixora API',
    version: '1.0.0',
    documentation: `${req.protocol}://${req.get('host')}/api-docs`,
    endpoints: {
      auth: '/api/auth',
      services: '/api/services',
      bookings: '/api/bookings',
      users: '/api/users',
      partners: '/api/partners',
      reviews: '/api/reviews',
      chat: '/api/chat',
    }
  });
});

app.use('/api', healthRoutes); 

module.exports = app;