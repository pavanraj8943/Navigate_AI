const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  resume: {
    type: mongoose.Schema.ObjectId,
    ref: 'Resume',
    required: true
  },
  coachingMode: {
    type: String,
    enum: ['behavioral', 'technical', 'general', 'resume-qa'],
    default: 'general'
  },

  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    metadata: {
      tokensUsed: Number,
      insights: [String]
    }
  }],

  sessionMetadata: {
    startedAt: {
      type: Date,
      default: Date.now
    },
    lastActivity: {
      type: Date,
      default: Date.now
    },
    title: String, // Auto-generated title for the chat session
    summary: String
  }
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);