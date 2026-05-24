// An endpoint for a user to fetch their own profile and dashboard statistics.

const Application = require('../models/application.model');
const Job = require('../models/job.model');
const Company = require('../models/company.model');
const Review = require('../models/review.model');
const User = require('../models/user.model');

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fullName, phoneNumber, skills, experience, education, resumeText, resumeUrl } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (fullName) user.fullName = fullName;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (skills) user.skills = skills;
    if (experience) user.experience = experience;
    if (education) user.education = education;
    if (resumeText) user.resumeText = resumeText;
    if (resumeUrl) user.resumeUrl = resumeUrl;

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error updating profile', error: error.message });
  }
};

const getUserProfile = async (req, res) => {
  if (req.user) {
    res.status(200).json(req.user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// Get dashboard statistics for candidate or company recruiter
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    let stats = {};

    if (userRole === 'customer') {
      // Candidate dashboard stats
      const totalBookings = await Application.countDocuments({ customer: userId });
      const pendingBookings = await Application.countDocuments({ 
        customer: userId, 
        status: { $in: ['Applied', 'Reviewing', 'pending'] } 
      });
      const completedBookings = await Application.countDocuments({ 
        customer: userId, 
        status: { $in: ['Shortlisted', 'Interview', 'completed'] } 
      });

      // Fetch recent applications
      const recentBookings = await Application.find({ customer: userId })
        .populate('service', 'title name category')
        .populate({
          path: 'partner',
          select: 'companyName user',
          populate: {
            path: 'user',
            select: 'fullName'
          }
        })
        .sort({ createdAt: -1 })
        .limit(5);

      // Map to expected legacy structure
      const mappedRecent = recentBookings.map(app => {
        const obj = app.toObject();
        return {
          ...obj,
          service: {
            ...obj.service,
            name: obj.service?.title || obj.service?.name || 'Software Engineer'
          },
          partner: {
            ...obj.partner,
            user: {
              fullName: obj.partner?.companyName || obj.partner?.user?.fullName || 'Tech Startup'
            }
          }
        };
      });

      stats = {
        totalBookings,
        pendingBookings,
        completedBookings,
        totalSpent: 1200000, // Hardcoded expected CTC target in INR
        recentBookings: mappedRecent
      };
    } else if (userRole === 'partner') {
      // Company recruiter dashboard stats
      const companyProfile = await Company.findOne({ user: userId });
      if (companyProfile) {
        const totalServices = await Job.countDocuments({ company: companyProfile._id });
        const activeServices = await Job.countDocuments({ company: companyProfile._id, isActive: true });
        const totalBookings = await Application.countDocuments({ partner: companyProfile._id });
        const completedBookings = await Application.countDocuments({ 
          partner: companyProfile._id, 
          status: { $in: ['Shortlisted', 'Interview', 'completed'] } 
        });

        // Recent job applications received
        const recentBookings = await Application.find({ partner: companyProfile._id })
          .populate('service', 'title name category')
          .populate('customer', 'fullName email')
          .sort({ createdAt: -1 })
          .limit(5);

        const mappedRecent = recentBookings.map(app => {
          const obj = app.toObject();
          return {
            ...obj,
            service: {
              ...obj.service,
              name: obj.service?.title || obj.service?.name || 'Software Engineer'
            }
          };
        });

        stats = {
          totalServices,
          activeServices,
          totalBookings,
          completedBookings,
          totalEarnings: 4500000, // Total allocated hiring budget
          totalReviews: await Review.countDocuments({ partner: companyProfile._id }),
          averageRating: companyProfile.averageRating || 0,
          recentBookings: mappedRecent,
          isOnline: companyProfile.isOnline,
          hasCompanyProfile: true
        };
      } else {
        stats = {
          totalServices: 0,
          activeServices: 0,
          totalBookings: 0,
          completedBookings: 0,
          totalEarnings: 0,
          totalReviews: 0,
          averageRating: 0,
          recentBookings: [],
          isOnline: false,
          hasCompanyProfile: false
        };
      }
    }

    res.status(200).json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getUserProfile, updateUserProfile, getDashboardStats };