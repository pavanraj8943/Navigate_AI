const mongoose = require('mongoose');

const interviewSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  resume: {
    type: mongoose.Schema.ObjectId,
    ref: 'Resume'
  },

  sessionType: {
    type: String,
    enum: ['full-mock', 'quick-practice', 'specific-skills', 'mock-test'],
    default: 'full-mock'
  },

  status: {
    type: String,
    enum: ['active', 'completed', 'abandoned'],
    default: 'active'
  },

  targetRole: String,

  currentDifficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard', 'Mixed'],
    default: 'Medium'
  },

  // Track progress per section
  sectionProgress: {
    Resume: { count: { type: Number, default: 0 }, target: { type: Number, default: 7 } },
    Technical: { count: { type: Number, default: 0 }, target: { type: Number, default: 7 } },
    HR: { count: { type: Number, default: 0 }, target: { type: Number, default: 7 } }
  },

  // Current active section
  currentSection: {
    type: String,
    enum: ['Resume', 'Technical', 'HR'],
    default: 'Resume'
  },

  questions: [{
    question: String,
    category: String,
    difficulty: String,
    hint: String,
    userResponse: String,
    skipped: { type: Boolean, default: false },
    aiEvaluation: {
      score: Number, // 1-10
      feedback: String,
      improvedAnswer: String,
      strengths: [String],
      improvements: [String]
    },
    durationSeconds: Number,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],

  overallFeedback: {
    score: Number,
    summary: String,
    strengths: [String],
    areasForImprovement: [String],
    nextSteps: [String],
    interviewReadinessScore: Number
  },

  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date
});

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);