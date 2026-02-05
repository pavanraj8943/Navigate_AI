const InterviewSession = require('../models/InterviewSession');
const Resume = require('../models/Resume');

const analyticsController = {
  // @desc    Get dashboard stats
  // @route   GET /api/analytics/dashboard
  // @access  Private
  getDashboardStats: async (req, res) => {
    try {
      const userId = req.user.id;

      const sessions = await InterviewSession.find({ user: userId });
      const resume = await Resume.findOne({ user: userId }).sort({ uploadedAt: -1 });

      const totalSessions = sessions.length;

      // Calculate average score
      let totalScore = 0;
      let ratedQuestions = 0;

      sessions.forEach(session => {
        session.questions.forEach(q => {
          if (q.aiEvaluation && q.aiEvaluation.score) {
            totalScore += q.aiEvaluation.score;
            ratedQuestions++;
          }
        });
      });

      const averageScore = ratedQuestions > 0 ? (totalScore / ratedQuestions).toFixed(1) : 0;

      // Identify strengths and improvements
      const strengths = new Set();
      const improvements = new Set();

      sessions.forEach(session => {
        session.questions.forEach(q => {
          if (q.aiEvaluation) {
            (q.aiEvaluation.strengths || []).forEach(s => strengths.add(s));
            (q.aiEvaluation.improvements || []).forEach(i => improvements.add(i));
          }
        });
      });

      res.status(200).json({
        success: true,
        data: {
          totalSessions,
          averageScore: parseFloat(averageScore),
          skillsAnalyzed: resume ? resume.parsed?.skills?.length || 0 : 0,
          topStrengths: Array.from(strengths).slice(0, 5),
          topImprovements: Array.from(improvements).slice(0, 5),
          recentHistory: sessions.slice(-5).reverse()
        }
      });
    } catch (err) {
      console.error('Analytics Error:', err);
      res.status(500).json({ message: 'Failed to fetch analytics' });
    }
  }
};

module.exports = analyticsController;