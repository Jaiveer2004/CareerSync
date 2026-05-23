const Application = require('../models/application.model');
const Job = require('../models/job.model');
const User = require('../models/user.model');
const Company = require('../models/company.model');

// Submit a new application
const createBooking = async (req, res) => {
  try {
    const { serviceId, jobId, bookingDate, coverLetter, resumeUrl } = req.body;
    const customerId = req.user._id;

    const targetJobId = jobId || serviceId;
    if (!targetJobId) {
      return res.status(400).json({ message: 'Job ID is required' });
    }

    const job = await Job.findById(targetJobId);
    if (!job || !job.isActive) {
      return res.status(404).json({ message: 'Job posting not found or is unavailable' });
    }

    // Check if company profile exists
    const companyProfile = await Company.findById(job.company || job.partner);
    if (!companyProfile) {
      return res.status(404).json({ message: 'Hiring company not found for this role' });
    }

    const application = await Application.create({
      customer: customerId,
      partner: companyProfile._id,
      service: job._id,
      bookingDate: bookingDate || new Date(),
      status: 'Applied',
      coverLetter: coverLetter || '',
      resumeUrl: resumeUrl || ''
    });

    res.status(201).json({
      message: 'Application submitted successfully',
      booking: {
        ...application.toObject(),
        totalPrice: 120000, // Legacy support
        paymentStatus: 'paid' // Legacy support
      }
    });

  } catch (error) {
    console.error('Error in createApplication:', error);
    res.status(500).json({ message: 'Failed to submit application.' });
  }
};

// Retrieve applications for candidates or recruiters
const getMyBookings = async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;

    let query = {};
    if (role === 'customer') {
      query = { customer: userId };
    } else if (role === 'partner') {
      const companyProfile = await Company.findOne({ user: userId }).select('_id');
      if (!companyProfile) {
        return res.status(200).json([]);
      }
      query = { partner: companyProfile._id };
    }

    const applications = await Application.find(query)
      .populate('customer', 'fullName email profilePicture')
      .populate({
        path: 'partner',
        select: 'user averageRating isOnline companyName industry website companySize',
        populate: {
          path: 'user',
          select: 'fullName email profilePicture'
        }
      })
      .populate('service', 'title name category salaryRange price requiredSkills location experienceLevel')
      .sort({ createdAt: -1 });

    // Map properties to satisfy legacy frontend component interface keys
    const mappedApplications = applications.map(app => {
      const obj = app.toObject();
      const legacyStatus = obj.status === 'Applied' || obj.status === 'Reviewing' ? 'pending' : 
                           obj.status === 'Shortlisted' || obj.status === 'Interview' ? 'confirmed' :
                           obj.status === 'Rejected' ? 'cancelled' : obj.status;
      return {
        ...obj,
        status: legacyStatus, // Map to legacy UI display expectation
        actualStatus: obj.status, // Keep new high fidelity status
        totalPrice: 120000,
        paymentStatus: 'paid',
        bookingDate: obj.bookingDate || obj.createdAt,
        service: {
          ...obj.service,
          name: obj.service?.title || obj.service?.name || 'Software Engineer',
          price: 120000
        }
      };
    });

    res.status(200).json(mappedApplications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Server error fetching applications' });
  }
};

// Cancel an application (Candidate side)
const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user._id;

    const application = await Application.findById(bookingId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.customer.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this application' });
    }

    application.status = 'Rejected';
    await application.save();

    res.status(200).json({ 
      message: 'Application cancelled successfully', 
      booking: {
        ...application.toObject(),
        status: 'cancelled'
      }
    });
  } catch (error) {
    console.error('Error cancelling application:', error);
    res.status(500).json({ message: 'Server error cancelling application' });
  }
};

// Shortlist / Confirm application
const confirmBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const partnerUserId = req.user._id;

    const companyProfile = await Company.findOne({ user: partnerUserId }).select('_id');
    if (!companyProfile) {
      return res.status(404).json({ message: 'Company profile not found' });
    }

    const application = await Application.findById(bookingId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.partner.toString() !== companyProfile._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to confirm this application' });
    }

    application.status = 'Shortlisted';
    await application.save();

    res.status(200).json({ 
      message: 'Candidate shortlisted successfully', 
      booking: {
        ...application.toObject(),
        status: 'confirmed'
      }
    });
  } catch (error) {
    console.error('Error shortlisting application:', error);
    res.status(500).json({ message: 'Server error shortlisting application' });
  }
};

// Reject application
const rejectBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { reason } = req.body;
    const partnerUserId = req.user._id;

    const companyProfile = await Company.findOne({ user: partnerUserId }).select('_id');
    if (!companyProfile) {
      return res.status(404).json({ message: 'Company profile not found' });
    }

    const application = await Application.findById(bookingId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.partner.toString() !== companyProfile._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to reject this application' });
    }

    application.status = 'Rejected';
    if (reason) {
      application.rejectionReason = reason;
    }
    await application.save();

    res.status(200).json({ 
      message: 'Application rejected', 
      booking: {
        ...application.toObject(),
        status: 'cancelled'
      }
    });
  } catch (error) {
    console.error('Error rejecting application:', error);
    res.status(500).json({ message: 'Server error rejecting application' });
  }
};

// Update status
const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    const userId = req.user._id;

    const validStatuses = [
      'Applied', 'Reviewing', 'Shortlisted', 'Interview', 'Rejected',
      'pending', 'confirmed', 'completed', 'cancelled'
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await Application.findById(bookingId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    let isPartnerOwner = false;
    if (req.user.role === 'partner') {
      const companyProfile = await Company.findOne({ user: userId }).select('_id');
      isPartnerOwner = !!companyProfile && application.partner.toString() === companyProfile._id.toString();
    }

    if (application.customer.toString() !== userId.toString() && !isPartnerOwner) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    // Map status key to new schema values if legacy is supplied
    let targetStatus = status;
    if (status === 'pending') targetStatus = 'Reviewing';
    else if (status === 'confirmed') targetStatus = 'Shortlisted';
    else if (status === 'completed') targetStatus = 'Interview';
    else if (status === 'cancelled') targetStatus = 'Rejected';

    application.status = targetStatus;
    await application.save();
    
    res.status(200).json({ 
      message: 'Application status updated', 
      booking: {
        ...application.toObject(),
        status: status // Maintain matching legacy state in response
      }
    });

  } catch (error) {
    console.error('Error updating application status:', error);
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
