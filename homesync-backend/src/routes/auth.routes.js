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
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false
  }),
  googleAuthCallback
);

module.exports = router;