const { Router } = require('express');
const { createReview } = require('../controllers/review.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = Router();
router.post('/', protect, createReview);

module.exports = router;