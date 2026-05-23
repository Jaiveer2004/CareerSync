// This schema defines a specific job posting created by an employer/company.

const { Schema, model } = require('mongoose');

const jobSchema = new Schema({
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  partner: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
  },

  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
  },

  description: {
    type: String,
    required: [true, 'Job description is required'],
  },

  category: {
    type: String,
    required: [true, 'Category is required'],
    // Example categories: 'Software Engineering', 'Data & AI', 'Infrastructure & Security', 'Product & Design'
  },

  salaryRange: {
    type: String,
    required: [true, 'Salary range is required'],
    // Example: "₹12L - ₹18L", "$120k - $150k"
  },

  employmentType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    default: 'Full-time',
  },

  requiredSkills: [{
    type: String,
    trim: true,
  }],

  experienceLevel: {
    type: String,
    required: [true, 'Experience level is required'],
    // Example: "3-5 years", "Entry Level", "Senior"
  },

  location: {
    type: String,
    required: [true, 'Job location is required'],
    default: 'Remote',
  },

  isActive: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

const Job = model('Job', jobSchema);
module.exports = Job;