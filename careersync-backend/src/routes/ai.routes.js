const { Router } = require('express');
const multer = require('multer');
const { generateChatResponse, parseResume, generateCoverLetter, generateJD } = require('../controllers/ai.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// 1. General AI Chatbot
router.post('/chat', generateChatResponse);

// 2. AI Resume Parser (Accepts PDF upload or raw text)
router.post('/parse-resume', protect, upload.single('resume'), parseResume);

// 3. AI Cover Letter Generator for quick apply
router.post('/generate-cover-letter', protect, generateCoverLetter);

// 4. AI Job Description Generator for recruiters
router.post('/generate-jd', protect, generateJD);

module.exports = router;
