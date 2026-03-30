const { Router } = require('express');
const {
  enable2FA,
  verify2FA,
  disable2FA,
  verify2FALogin,
  verifyBackupCode
} = require('../controllers/2fa.controller')
const { protect } = require('../middlewares/auth.middleware');

const router = Router();
router.post('/verify-login', verify2FALogin);
router.post('/verify-backup-code', verifyBackupCode);
router.use(protect);
router.post('/enable', enable2FA);
router.post('/verify', verify2FA);
router.post('/disable', disable2FA);

module.exports = router;