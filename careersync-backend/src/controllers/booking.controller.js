// This is a controller to handle the logic for creating and managing bookings. The createBooking function will be protected, ensuring only logged-in users can make a booking.

const Booking = require('../models/booking.model');
const Service = require('../models/service.model');
const User = require('../models/user.model');
const ServicePartner = require('../models/servicePartner.model');

const createBooking = async (req, res) => {
  try {
    const { serviceId, bookingDate, address } = req.body;
    const customerId = req.user._id;

    // 1. Find the service to be booked
    const service = await Service.findById(serviceId);
    if (!service || !service.isActive) {
      return res.status(404).json({ message: 'Service not found or is unavailable' });
    }

    // 2. Create the new application (booking)
    const booking = await Booking.create({
      customer: customerId,
      partner: service.partner,
      service: serviceId,
      bookingDate,
      address,
      totalPrice: service.price,
      paymentStatus: 'paid', // Hardcode to paid/completed since we removed payments
    });

    res.status(201).json({
      message: 'Application created successfully',
      booking
    });

  } catch (error) {
    console.error('Error in createBooking:', error);
    res.status(500).json({ message: 'Failed to create application.' });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role; // 'customer' or 'partner'

    let query = {};
    if (role === 'customer') {
      query = { customer: userId };
    } else if (role === 'partner') {
      const partnerProfile = await ServicePartner.findOne({ user: userId }).select('_id');
      if (!partnerProfile) {
        return res.status(200).json([]);
      }
      query = { partner: partnerProfile._id };
    }

    const bookings = await Booking.find(query)
      .populate('customer', 'fullName email profilePicture')
      .populate({
        path: 'partner',
        select: 'user averageRating isOnline',
        populate: {
          path: 'user',
          select: 'fullName email profilePicture'
        }
      })
      .populate('service', 'name category price')
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Server error fetching bookings' });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user._id;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.customer.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (['completed', 'cancelled', 'rejected'].includes(booking.status)) {
      return res.status(400).json({ message: `Cannot cancel a ${booking.status} booking` });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Server error cancelling booking' });
  }
};

const confirmBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const partnerUserId = req.user._id;

    const partnerProfile = await ServicePartner.findOne({ user: partnerUserId }).select('_id');
    if (!partnerProfile) {
      return res.status(404).json({ message: 'Partner profile not found' });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.partner.toString() !== partnerProfile._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to confirm this booking' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ message: `Cannot confirm a ${booking.status} booking` });
    }

    booking.status = 'confirmed';
    await booking.save();

    res.status(200).json({ message: 'Booking confirmed successfully', booking });
  } catch (error) {
    console.error('Error confirming booking:', error);
    res.status(500).json({ message: 'Server error confirming booking' });
  }
};

const rejectBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const partnerUserId = req.user._id;

    const partnerProfile = await ServicePartner.findOne({ user: partnerUserId }).select('_id');
    if (!partnerProfile) {
      return res.status(404).json({ message: 'Partner profile not found' });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.partner.toString() !== partnerProfile._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to reject this booking' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ message: `Cannot reject a ${booking.status} booking` });
    }

    booking.status = 'rejected';
    await booking.save();

    res.status(200).json({ message: 'Booking rejected', booking });
  } catch (error) {
    console.error('Error rejecting booking:', error);
    res.status(500).json({ message: 'Server error rejecting booking' });
  }
};


const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    const userId = req.user._id;

    const validStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Authorization check
    let isPartnerOwner = false;
    if (req.user.role === 'partner') {
      const partnerProfile = await ServicePartner.findOne({ user: userId }).select('_id');
      isPartnerOwner = !!partnerProfile && booking.partner.toString() === partnerProfile._id.toString();
    }

    if (booking.customer.toString() !== userId.toString() && !isPartnerOwner) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    booking.status = status;
    await booking.save();
    res.status(200).json({ message: 'Booking status updated', booking });

  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
  confirmBooking,
  rejectBooking,
  updateBookingStatus
};
