// This model holds all the details for a recruiter company profile and links to the core User model.

const { Schema, model } = require('mongoose');

const companySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  companyName: {
    type: String,
    trim: true,
    default: 'My Tech Startup',
  },

  industry: {
    type: String,
    trim: true,
    default: 'Information Technology',
  },

  website: {
    type: String,
    trim: true,
  },

  bio: {
    type: String,
    maxLength: 1000,
  },

  companySize: {
    type: String,
    default: '10-50 employees',
  },

  experienceYears: {
    type: Number,
    min: 0,
  },

  phoneNumber: {
    type: String,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  isOnline: { 
    type: Boolean,
    default: true,
  },

  averageRating: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

const Company = model('Company', companySchema);
module.exports = Company;