const Resume = require('../models/Resume');
const User = require('../models/User');
const { extractResumeData } = require('../utils/resumeExtractor');

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