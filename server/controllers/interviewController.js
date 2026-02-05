const InterviewSession = require('../models/InterviewSession');
const Resume = require('../models/Resume');
const aiService = require('../services/aiService');
const contextService = require('../services/contextService');

const interviewController = {
  // @desc    Start an interview session
  // @route   POST /api/interview/start
  // @access  Private
  startSession: async (req, res) => {
    try {
      const { sessionType, targetRole, difficulty } = req.body;

      // Get user context
      const context = await contextService.getContext(req.user.id);

      // Find the most recent resume to link to
      const resume = await Resume.findOne({ user: req.user.id }).sort({ uploadedAt: -1 });

      // Generate questions using AI
      const rawQuestions = await aiService.generateInterviewQuestions(context);

      const session = await InterviewSession.create({
        user: req.user.id,
        resume: resume ? resume._id : null,
        sessionType: sessionType || 'quick-practice',
        targetRole,
        difficulty: difficulty || 'mid',
        questions: rawQuestions.map(q => ({
          question: q.question,
          category: q.category,
          hint: q.hint
        }))
      });

      res.status(201).json({
        success: true,
        data: session
      });
    } catch (err) {
      console.error('Start Session Error:', err);
      res.status(500).json({ message: 'Failed to start interview session' });
    }
  },

  // @desc    Submit an answer for evaluation
  // @route   POST /api/interview/:id/answer
  // @access  Private
  submitAnswer: async (req, res) => {
    try {
      const { questionId, answer } = req.body;
      const session = await InterviewSession.findById(req.params.id);

      if (!session) {
        return res.status(404).json({ message: 'Session not found' });
      }

      const questionIndex = session.questions.findIndex(q => q._id.toString() === questionId);
      if (questionIndex === -1) {
        return res.status(404).json({ message: 'Question not found in session' });
      }

      // Get context for evaluation
      const context = await contextService.getContext(req.user.id);

      // Evaluate answer using AI
      const evaluation = await aiService.evaluateAnswer(
        session.questions[questionIndex].question,
        answer,
        context
      );

      // Update question with answer and evaluation
      session.questions[questionIndex].userResponse = answer;
      session.questions[questionIndex].aiEvaluation = evaluation;

      await session.save();

      res.status(200).json({
        success: true,
        data: evaluation
      });
    } catch (err) {
      console.error('Submit Answer Error:', err);
      res.status(500).json({ message: 'Failed to submit answer' });
    }
  },

  // @desc    Get session details
  // @route   GET /api/interview/:id
  // @access  Private
  getSession: async (req, res) => {
    try {
      const session = await InterviewSession.findById(req.params.id);

      if (!session) {
        return res.status(404).json({ message: 'Session not found' });
      }

      if (session.user.toString() !== req.user.id) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      res.status(200).json({
        success: true,
        data: session
      });
    } catch (err) {
      console.error('Get Session Error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // @desc    Get all user sessions
  // @route   GET /api/interview
  // @access  Private
  getSessions: async (req, res) => {
    try {
      const sessions = await InterviewSession.find({ user: req.user.id }).sort({ startedAt: -1 });
      res.status(200).json({
        success: true,
        data: sessions
      });
    } catch (err) {
      console.error('Get Sessions Error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = interviewController;