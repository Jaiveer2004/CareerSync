const { Router } = require('express');
const { createPartnerProfile, getMyPartnerProfile, getPartnerServices, updatePartnerStatus } = require('../controllers/partner.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = Router();

router.post('/', protect, createPartnerProfile);
router.get('/services', protect, getPartnerServices);
router.get('/me', protect, getMyPartnerProfile);
router.patch('/status', protect, updatePartnerStatus);

module.exports = router;