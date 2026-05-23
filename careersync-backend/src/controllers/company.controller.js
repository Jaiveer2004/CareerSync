const Company = require('../models/company.model');
const User = require('../models/user.model');
const Job = require('../models/job.model');

const createPartnerProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    // Check if the company profile already exists for this user:
    const existingProfile = await Company.findOne({ user: userId });
    if (existingProfile) {
      return res.status(400).json({ message: 'Company profile already exists.' });
    }

    // Extract both job-board fields and legacy fields for compatibility
    const { 
      companyName, 
      industry, 
      website, 
      bio, 
      companySize, 
      experienceYears, 
      phoneNumber,
      skillsAndExpertise
    } = req.body;
    
    const companyProfile = await Company.create({
      user: userId,
      companyName: companyName || (req.user.fullName + ' Tech'),
      industry: industry || (skillsAndExpertise ? skillsAndExpertise.join(', ') : 'Information Technology'),
      website,
      bio,
      companySize: companySize || '10-50 employees',
      experienceYears: experienceYears || 1,
      phoneNumber
    });

    // Update the user's profile role to 'partner' (Employer/Recruiter role)
    await User.findByIdAndUpdate(userId, { role: 'partner' });

    res.status(201).json({
      message: 'Employer profile created successfully! You can now start posting jobs.',
      profile: companyProfile,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getPartnerServices = async (req, res) => {
  try {
    const companyProfile = await Company.findOne({ user: req.user._id });
    if (!companyProfile) {
      return res.status(404).json({ message: 'Company profile not found' });
    }

    const jobs = await Job.find({ company: companyProfile._id });

    // Map jobs to support legacy service expectations on frontend
    const mappedJobs = jobs.map(job => {
      const jobObj = job.toObject();
      return {
        ...jobObj,
        name: jobObj.title, // legacy compatibility
        price: 120000,
        duration: 60
      };
    });

    res.status(200).json(mappedJobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updatePartnerStatus = async (req, res) => {
  try {
    if (req.user.role !== 'partner') {
      return res.status(403).json({ message: "Forbidden: Only recruiters can change online status" });
    }

    const companyProfile = await Company.findOne({ user: req.user._id });
    if (!companyProfile) {
      return res.status(404).json({ message: "Company profile not found" });
    }

    const { isOnline } = req.body;
    companyProfile.isOnline = isOnline;
    await companyProfile.save();

    res.status(200).json({ 
      message: `Status updated to ${isOnline ? 'Online' : 'Offline'}`,
      isOnline: companyProfile.isOnline,
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMyPartnerProfile = async (req, res) => {
  try {
    const companyProfile = await Company.findOne({ user: req.user._id });
    if (!companyProfile) {
      return res.status(404).json({ message: "Company profile not found" });
    }
    res.status(200).json(companyProfile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createPartnerProfile, getPartnerServices, updatePartnerStatus, getMyPartnerProfile };
