const aiService = require('../services/aiService');
const contextService = require('../services/contextService');

// @desc    Send a message to the AI
// @route   POST /api/chat
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: 'Messages array is required' });
    }

    // Get user context (resume data)
    const context = await contextService.getContext(req.user.id);

    // Generate AI response
    const aiResponse = await aiService.generateResponse(messages, context);

    res.status(200).json({
      success: true,
      message: aiResponse
    });
  } catch (err) {
    console.error('Chat Error:', err);
    res.status(500).json({ message: 'Failed to generate response' });
  }
};