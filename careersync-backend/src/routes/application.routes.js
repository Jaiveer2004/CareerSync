const { Router } = require('express');
const { createBooking, getMyBookings, cancelBooking, confirmBooking, rejectBooking, updateBookingStatus } = require('../controllers/application.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = Router();

router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.patch('/:bookingId/cancel', protect, cancelBooking);
router.patch('/:bookingId/confirm', protect, confirmBooking);
router.patch('/:bookingId/reject', protect, rejectBooking);
router.patch('/:bookingId/status', protect, updateBookingStatus);

module.exports = router;
