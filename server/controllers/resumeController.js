const Resume = require('../models/Resume');
const User = require('../models/User');
const fs = require('fs');
const pdf = require('pdf-parse');
const path = require('path');

// @desc    Upload new resume
// @route   POST /api/resume/upload
// @access  Private
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Basic PDF parsing
    let rawText = '';
    try {
      if (req.file.mimetype === 'application/pdf') {
        const dataBuffer = fs.readFileSync(req.file.path);
        const data = await pdf(dataBuffer);
        rawText = data.text;
      } else {
        // Fallback for text/other (if allowed)
        rawText = fs.readFileSync(req.file.path, 'utf8');
      }
    } catch (parseError) {
      console.error('Error parsing PDF:', parseError);
      // We continue even if parsing fails, just saving the file record
    }

    // Create Resume record
    const resume = await Resume.create({
      user: req.user.id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      rawText: rawText,
      // Initialize basic parsed structure
      parsed: {
        personalInfo: {
          name: req.user.name, // Default to user name
          email: req.user.email
        }
      }
    });

    // Add resume to user's list
    // (If using virtuals this isn't strictly necessary for query, but good if we had an array)
    // database is one-to-many via Resume.user, so virtual populates it.

    res.status(201).json({
      success: true,
      data: resume
    });

  } catch (err) {
    console.error(err);
    // Clean up file if database save fails
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all resumes for user
// @route   GET /api/resume
// @access  Private
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

// @desc    Get single resume
// @route   GET /api/resume/:id
// @access  Private
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