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
      const { targetRole } = req.body;
      const context = await contextService.getContext(req.user.id);
      const resume = await Resume.findOne({ user: req.user.id }).sort({ uploadedAt: -1 });

      // Determine initial difficulty based on Resume Level (optional, but good for context)
      // For the mock test, we will enforce a fixed progression:
      // 1. Easy
      // 2. Medium
      // 3. Medium
      // 4. Hard
      // 5. Hard

      const questionsToGenerate = [
        { difficulty: 'Easy', section: 'Technical' },
        { difficulty: 'Medium', section: 'Technical' },
        { difficulty: 'Medium', section: 'Technical' },
        { difficulty: 'Hard', section: 'Technical' },
        { difficulty: 'Hard', section: 'Technical' }
      ];

      // Use batch generation to reduce API calls (1 call instead of 5)
      let generatedQuestions = [];
      try {
        generatedQuestions = await aiService.generateBatchQuestions(context, 5, questionsToGenerate);
      } catch (err) {
        console.error("Failed to generate batch questions, falling back to mocks", err);
        // Fallback handled inside service, but double check
        generatedQuestions = questionsToGenerate.map(c => ({
          question: "Tell me about your experience.",
          category: c.section,
          difficulty: c.difficulty,
          hint: "General question."
        }));
      }

      const session = await InterviewSession.create({
        user: req.user.id,
        resume: resume ? resume._id : null,
        sessionType: 'mock-test',
        targetRole,
        currentDifficulty: 'Mixed', // Not really used in fixed mode
        currentSection: 'Technical',
        status: 'active',
        currentQuestionIndex: 0, // New field to track current question
        sectionProgress: {
          Resume: { count: 0, target: 0 },
          Technical: { count: 0, target: 5 }, // 5 questions total
          HR: { count: 0, target: 0 }
        },
        questions: generatedQuestions
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

      // 1. Evaluate Answer
      const context = await contextService.getContext(req.user.id);
      const currentQ = session.questions[questionIndex];

      const evaluation = await aiService.evaluateAnswer(
        currentQ.question,
        answer,
        context
      );

      // 2. Update Question with Evaluation
      session.questions[questionIndex].userResponse = answer;
      session.questions[questionIndex].aiEvaluation = {
        score: evaluation.score,
        feedback: evaluation.feedback,
        improvedAnswer: evaluation.improvedAnswer
      };

      // 3. Update Progress
      // In this fixed mode, we just check if all questions are answered
      const allAnswered = session.questions.every(q => q.userResponse);

      if (allAnswered) {
        session.status = 'completed';
        session.completedAt = new Date();
      }

      await session.save();

      // Return evaluation. Frontend knows the array structure, so it can move to next.
      res.status(200).json({
        success: true,
        data: evaluation,
        interviewCompleted: allAnswered
      });
    } catch (err) {
      console.error('Submit Answer Error:', err);
      res.status(500).json({ message: 'Failed to submit answer' });
    }
  },

  // @desc    Skip a question (placeholder logic for now, just marks skipped)
  // @route   POST /api/interview/:id/skip
  // @access  Private
  skipQuestion: async (req, res) => {
    // For now, skipping just marks it and returns success.
    // In a strict mock test, skipping might not generate a new question, just move to next.
    try {
      const { questionId } = req.body;
      const session = await InterviewSession.findById(req.params.id);

      if (!session) return res.status(404).json({ message: 'Session not found' });

      const questionIndex = session.questions.findIndex(q => q._id.toString() === questionId);
      if (questionIndex === -1) return res.status(404).json({ message: 'Question not found' });

      session.questions[questionIndex].skipped = true;
      session.questions[questionIndex].userResponse = "SKIPPED";

      const allAnswered = session.questions.every(q => q.userResponse || q.skipped);
      if (allAnswered) {
        session.status = 'completed';
        session.completedAt = new Date();
      }

      await session.save();

      res.status(200).json({
        success: true,
        skipped: true,
        interviewCompleted: allAnswered
      });
    } catch (err) {
      console.error('Skip Question Error:', err);
      res.status(500).json({ message: 'Failed to skip question' });
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