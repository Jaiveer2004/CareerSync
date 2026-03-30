// This file defines the API endpoints (/register and /login) and connects them to the controller functions.
const { Router } = require('express');
const {
  registerUser,
  loginUser,
  googleAuthCallback,
  verifyEmail,
  resendVerificationEmail
} = require('../controllers/auth.controller');

const { authLimiter } = require('../middlewares/rateLimit.middleware');

const passport = require('../config/passport');

const router = Router();
router.post('/register', registerUser);
router.post('/login', authLimiter, loginUser);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);

router.get(
  '/google',
  (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return res.status(501).json({ message: 'Google authentication is not configured on the server.' });
    }
    next();
  },
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return res.status(501).json({ message: 'Google authentication is not configured on the server.' });
    }
    next();
  },
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false
  }),
  googleAuthCallback
);

module.exports = router;