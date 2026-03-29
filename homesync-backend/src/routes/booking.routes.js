const { Router } = require('express');
const { createBooking, createPaymentOrder, getMyBookings, verifyPayment, cancelBooking, confirmBooking, rejectBooking, updateBookingStatus } = require('../controllers/booking.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = Router();

router.post('/', protect, createBooking);
router.post('/verify-payment', protect, verifyPayment);
router.post('/create-order', protect, createPaymentOrder);
router.get('/my-bookings', protect, getMyBookings);
router.patch('/:bookingId/cancel', protect, cancelBooking);
router.patch('/:bookingId/confirm', protect, confirmBooking);
router.patch('/:bookingId/reject', protect, rejectBooking);
router.patch('/:bookingId/status', protect, updateBookingStatus);

module.exports = router;