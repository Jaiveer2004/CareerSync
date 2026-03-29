const { Router } = require('express');
const { requestLoginOTP, verifyLoginOTP } = require('../controllers/otp.controller');
const { otpLimiter, verificationLimiter } = require('../middlewares/rateLimit.middleware');

const router = Router();

router.post('/request-login', otpLimiter, requestLoginOTP);
router.post('/verify-login', verificationLimiter, verifyLoginOTP);

module.exports = router;