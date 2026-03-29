const { Router } = require('express');
const { getUserProfile, getDashboardStats } = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = Router();
router.get('/profile', protect, getUserProfile);
router.get('/dashboard-stats', protect, getDashboardStats);

module.exports = router;