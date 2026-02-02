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
    enum: ['full-mock', 'quick-practice', 'specific-skills'],
    default: 'quick-practice'
  },
  targetRole: String,
  difficulty: {
    type: String,
    enum: ['junior', 'mid', 'senior'],
    default: 'mid'
  },

  questions: [{
    question: String,
    category: {
      type: String,
      enum: ['behavioral', 'technical', 'system-design']
    },
    userResponse: String, // Transcription or text input
    aiEvaluation: {
      score: Number, // 1-10
      feedback: String,
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
    nextSteps: [String]
  },

  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date
});

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);