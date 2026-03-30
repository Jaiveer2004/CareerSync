const { Router } = require('express');
const { 
  requestPasswordReset, 
  resetPassword 
} = require('../controllers/password.controller');

const router = Router();

router.post('/request-reset', requestPasswordReset);
router.post('/reset', resetPassword);

module.exports = router;