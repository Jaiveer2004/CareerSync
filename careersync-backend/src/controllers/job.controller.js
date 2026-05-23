const Job = require('../models/job.model');
const Company = require('../models/company.model');
const Review = require('../models/review.model');
const Application = require('../models/application.model');

// Create a new job posting
const createService = async (req, res) => {
  try {
    if (req.user.role !== 'partner') {
      return res.status(403).json({ message: 'Forbidden: Only companies can create job postings' });
    }

    let companyProfile = await Company.findOne({ user: req.user._id });
    if (!companyProfile) {
      companyProfile = await Company.create({ 
        user: req.user._id,
        companyName: req.user.fullName + ' Inc.'
      });
    }

    // Extract both job-board fields and legacy service fields for backward compatibility
    const { 
      title, 
      name, 
      description, 
      category, 
      salaryRange, 
      price, 
      employmentType, 
      requiredSkills, 
      skills, 
      experienceLevel, 
      location,
      duration 
    } = req.body;

    const job = await Job.create({
      company: companyProfile._id,
      partner: companyProfile._id, // Legacy compatibility
      title: title || name,
      name: name || title, // Legacy compatibility
      description,
      category,
      salaryRange: salaryRange || (price ? `₹${price.toLocaleString('en-IN')}` : '₹10L - ₹15L'),
      price: price || 100000, // Legacy compatibility
      employmentType: employmentType || 'Full-time',
      requiredSkills: requiredSkills || skills || [],
      experienceLevel: experienceLevel || '2-4 years',
      location: location || 'Remote',
      duration: duration || 60 // Legacy compatibility
    });

    res.status(201).json({
      message: 'Job posting created successfully',
      job,
      service: job // Legacy compatibility
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all active job postings
const getAllServices = async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true })
      .populate({
        path: 'company',
        select: 'user companyName industry website companySize averageRating isOnline'
      })
      .populate({
        path: 'partner', // Legacy compatibility
        select: 'user bio averageRating companyName industry website isOnline',
        populate: {
          path: 'user',
          select: 'fullName profilePicture'
        }
      });

    // Support legacy client structures by mapping or adding properties
    const mappedJobs = jobs.map(job => {
      const jobObj = job.toObject();
      return {
        ...jobObj,
        name: jobObj.title, // legacy compatibility
        price: 120000,      // legacy compatibility
        duration: 60,       // legacy compatibility
        providerCount: 1    // legacy compatibility
      };
    });

    res.status(200).json(mappedJobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Legacy compatibility for service providers
const getServiceProviders = async (req, res) => {
  try {
    const { serviceName } = req.params;
    const jobs = await Job.find({ 
      $or: [{ title: serviceName }, { name: serviceName }],
      isActive: true 
    }).populate({
      path: 'partner',
      select: 'user bio averageRating isOnline',
      populate: {
        path: 'user',
        select: 'fullName profilePicture email phone'
      }
    });

    if (jobs.length === 0) {
      return res.status(404).json({ message: 'No hiring companies found for this role' });
    }

    const providers = jobs.map(job => ({
      serviceId: job._id,
      serviceName: job.title,
      price: job.price || 120000,
      duration: 60,
      provider: {
        id: job.partner._id,
        name: job.partner.companyName || job.partner.user.fullName,
        profilePicture: job.partner.user.profilePicture,
        bio: job.partner.bio || 'Hiring company',
        email: job.partner.user.email,
        phone: job.partner.user.phone,
        isOnline: job.partner.isOnline,
        averageRating: job.partner.averageRating || 0,
        reviewCount: 0,
        isAvailable: true
      }
    }));

    res.status(200).json({
      serviceName,
      totalProviders: providers.length,
      availableProviders: providers.length,
      providers
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get job details by ID
const getServiceById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate({
        path: 'company',
        select: 'user companyName industry website companySize averageRating isOnline'
      })
      .populate({
        path: 'partner', // Legacy compatibility
        select: 'user bio averageRating companyName industry website isOnline',
        populate: {
          path: 'user',
          select: 'fullName profilePicture'
        }
      });

    if (!job) {
      return res.status(404).json({ message: 'Job posting not found' });
    }

    // Get reviews for the hiring company
    const reviews = await Review.find({ partner: job.partner || job.company })
      .populate('customer', 'fullName')
      .sort({ createdAt: -1 })
      .limit(5);

    const jobObj = job.toObject();
    res.status(200).json({
      ...jobObj,
      name: jobObj.title, // legacy compatibility
      price: jobObj.price || 120000, // legacy
      reviews,
      reviewCount: reviews.length,
      averageRating: job.partner?.averageRating || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createService, getAllServices, getServiceProviders, getServiceById };