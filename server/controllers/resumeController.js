const Resume = require('../models/Resume');
const User = require('../models/User');
const { extractResumeData } = require('../utils/resumeExtractor');
const fs = require('fs');

// @desc    Upload new resume
// @route   POST /api/resume/upload
// @access  Private
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Parse and extract data
    let extracted;
    try {
      extracted = await extractResumeData(req.file.path, req.file.mimetype);
    } catch (parseError) {
      console.error('Extraction error:', parseError);
      // Even if extraction fails, we might want to fail the request or just save the file without data.
      // For now, let's treat it as a hard failure for better UX feedback.
      return res.status(500).json({ message: 'Failed to process resume file' });
    }

    const { text: rawText, data: extractedData } = extracted;

    // Create Resume record
    const resume = await Resume.create({
      user: req.user.id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      rawText: rawText,
      // Initialize parsed structure with extracted data
      parsed: {
        personalInfo: {
          name: req.user.name, // Default to user name
          email: extractedData.personalInfo.email || req.user.email,
          phone: extractedData.personalInfo.phone || '',
          location: '',
          links: extractedData.personalInfo.links || []
        },
        summary: extractedData.summary || '',
        skills: extractedData.skills,
        experience: extractedData.experience || [],
        education: extractedData.education || [],
        projects: extractedData.projects || []
      }
    });

    // Trigger AI Analysis for Level and Insights
    // We do this asynchronously but await it here to ensure data is ready for the interview. 
    // In a production app with long resumes, this might be a background job.
    try {
      const analysis = await aiService.analyzeResumeLevel(rawText);
      resume.analysis = analysis;
      await resume.save();
    } catch (analysisErr) {
      console.error('AI Analysis failed:', analysisErr);
      // Continue without analysis, defaulting to Intermediate
    }

    // Initialize Chat Session with Greeting
    const ChatMessage = require('../models/ChatMessage');
    let chatSession = await ChatMessage.findOne({ user: req.user.id }).sort({ 'sessionMetadata.lastActivity': -1 });

    if (!chatSession) {
      chatSession = await ChatMessage.create({
        user: req.user.id,
        resume: resume._id,
        messages: [],
        sessionMetadata: {
          title: 'Resume Review'
        }
      });
    } else {
      // Update the resume link to the new one
      chatSession.resume = resume._id;
    }

    // Add Greeting
    chatSession.messages.push({
      role: 'assistant',
      content: `Hello, ${req.user.name}! I've analyzed your resume and determined your level is **${resume.analysis?.level || 'Intermediate'}**. I'm ready to help you prepare.`,
      timestamp: new Date()
    });
    chatSession.sessionMetadata.lastActivity = new Date();
    await chatSession.save();

    res.status(201).json({
      success: true,
      data: resume
    });

  } catch (err) {
    console.error(err);
    // Clean up file if database save fails
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        console.error('Error deleting file:', e);
      }
    }
    res.status(500).json({ message: 'Server Error' });
  }
};


exports.getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id }).sort({ uploadedAt: -1 });
    res.status(200).json({
      success: true,
      count: resumes.length,
      data: resumes
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};


exports.getResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Make sure user owns the resume
    if (resume.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.status(200).json({
      success: true,
      data: resume
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};


exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Make sure user owns the resume
    if (resume.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Delete file from filesystem
    try {
      if (fs.existsSync(resume.path)) {
        fs.unlinkSync(resume.path);
      }
    } catch (err) {
      console.error('Error deleting file from filesystem:', err);
      // Continue to delete from DB even if file delete fails
    }

    await resume.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

const aiService = require('../services/aiService');
const contextService = require('../services/contextService');

// @desc    Check resume alignment with target role
// @route   POST /api/resume/alignment
// @access  Private
exports.checkAlignment = async (req, res) => {
  try {
    const { targetRole } = req.body;

    if (!targetRole) {
      return res.status(400).json({ message: 'Target role is required' });
    }

    // Get context from contextService
    const context = await contextService.getContext(req.user.id);

    if (!context) {
      return res.status(404).json({ message: 'No resume found' });
    }

    const analysis = await aiService.checkResumeAlignment(context, targetRole);

    res.status(200).json({
      success: true,
      data: analysis
    });

  } catch (err) {
    console.error('Check Alignment Error:', err);
    res.status(500).json({ message: 'Failed to check alignment' });
  }
};