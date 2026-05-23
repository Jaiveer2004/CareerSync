// This schema represents a job application, connecting a candidate (customer), a recruiter (company/partner), and a job (service).

const { Schema, model } = require('mongoose');

const applicationSchema = new Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  partner: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  service: {
    type: Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Applied', 'Reviewing', 'Shortlisted', 'Interview', 'Rejected', 'pending', 'confirmed', 'completed', 'cancelled'],
    default: 'Applied',
  },
  coverLetter: {
    type: String,
  },
  resumeUrl: {
    type: String,
  },
  rejectionReason: {
    type: String,
  },
  notes: {
    type: String,
  }
}, { timestamps: true });

const Application = model('Application', applicationSchema);
module.exports = Application;
