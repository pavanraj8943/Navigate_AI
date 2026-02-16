const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  mimeType: String,
  size: Number,
  path: String, // Path to file storage (local or S3)

  // Extracted data
  parsed: {
    personalInfo: {
      name: String,
      email: String,
      phone: String,
      location: String,
      links: [String]
    },
    summary: String,
    experience: [{
      company: String,
      role: String,
      startDate: String,
      endDate: String,
      description: String,
      achievements: [String],
      technologies: [String]
    }],
    skills: [{
      category: String,
      items: [String]
    }],
    education: [{
      school: String,
      degree: String,
      field: String,
      graduationDate: String
    }],
    projects: [{
      name: String,
      description: String,
      technologies: [String],
      link: String
    }]
  },

  // AI-generated insights
  analysis: {
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate'
    },
    summary: String,
    strengths: [String],
    weaknesses: [String],
    suggestedFocus: [String]
  },

  insights: { // Kept for backward compatibility if needed, or can be merged into analysis
    strengths: [String],
    gaps: [String],
    keywordsExtracted: [String],
    suggestedQuestions: [String],
    industryMatch: [String]
  },

  rawText: String,

  uploadedAt: {
    type: Date,
    default: Date.now
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resume', resumeSchema);