const fs = require('fs');
const pdf = require('pdf-parse');

// Helper functions for extraction
const extractEmail = (text) => {
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
  const match = text.match(emailRegex);
  return match ? match[0] : null;
};

const extractPhone = (text) => {
  // Basic phone regex (supports various formats including international)
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  const match = text.match(phoneRegex);
  return match ? match[0] : null;
};

const extractLinks = (text) => {
  const linkRegex = /(https?:\/\/[^\s]+)/g;
  const matches = text.match(linkRegex);
  return matches ? matches.slice(0, 3) : []; // Limit to 3 links
}

const extractSkills = (text) => {
  const commonSkills = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Ruby', 'PHP',
    'React', 'Angular', 'Vue', 'Next.js', 'Node.js', 'Express', 'Django', 'Flask', 'Spring',
    'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes',
    'Git', 'CI/CD', 'Agile', 'Scrum', 'HTML', 'CSS', 'Tailwind', 'SASS', 'GraphQL', 'REST API',
    'Machine Learning', 'AI', 'Data Analysis', 'Project Management'
  ];

  const foundSkills = commonSkills.filter(skill => {
    // Case-insensitive match, ensuring whole word boundary if possible or just inclusion
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    return regex.test(text);
  });

  // Dedup and return wrapped structure
  return [...new Set(foundSkills)].map(skill => ({
    category: 'Detected',
    items: [skill]
  }));
};

// Heuristic extraction for sections (very basic, can be improved with AI later)
const extractSection = (text, startKeywords, endKeywords) => {
  const lines = text.split('\n');
  let capturing = false;
  let content = [];

  // Normalize keywords for matching
  const startRegex = new RegExp(`^\\s*(${startKeywords.join('|')})`, 'i');

  for (let line of lines) {
    if (startRegex.test(line)) {
      capturing = true;
      continue;
    }

    // Stop if we hit another likely section header
    if (capturing && /^\s*(Experience|Education|Skills|Projects|Summary|Certifications|Interests|References)/i.test(line) && !startRegex.test(line)) {
      break;
    }

    if (capturing) {
      const trimmed = line.trim();
      if (trimmed) content.push(trimmed);
    }
  }

  return content;
};

const extractExperience = (text) => {
  // Basic extraction - capturing lines under Experience
  const rawLines = extractSection(text, ['Experience', 'Work History', 'Employment'], []);

  // Simply return raw lines for now, or try to structure them lightly
  // A real parser would look for dates, companies, etc.
  return rawLines.length > 0 ? [{
    company: 'Extracted from Resume',
    role: 'See details',
    description: rawLines.slice(0, 10).join('\n'), // Limit size
    achievements: []
  }] : [];
};

const extractEducation = (text) => {
  const rawLines = extractSection(text, ['Education', 'Academic Background'], []);
  return rawLines.length > 0 ? [{
    school: rawLines[0] || 'Unknown School',
    degree: rawLines[1] || 'Degree N/A',
    field: '',
    graduationDate: null
  }] : [];
};

const extractSummary = (text) => {
  const rawLines = extractSection(text, ['Summary', 'Profile', 'Professional Summary', 'About Me'], []);
  return rawLines.join(' ');
};

/**
 * Extracts text and structured data from a resume file
 * @param {string} filePath - Path to the uploaded file
 * @param {string} mimeType - MIME type of the file
 * @returns {Promise<{text: string, data: object}>}
 */
const extractResumeData = async (filePath, mimeType) => {
  let rawText = '';

  try {
    if (mimeType === 'application/pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      // Ensure pdf-parse is working or fallback to simple extraction if simulated
      if (typeof pdf === 'function') {
        const data = await pdf(dataBuffer);
        rawText = data.text;
      } else {
        console.warn('pdf-parse library not loading a function, checking default export');
        // Attempt default export if CJS/ESM mismatch
        if (pdf && typeof pdf.default === 'function') {
          const data = await pdf.default(dataBuffer);
          rawText = data.text;
        } else {
          // Mock text for dev if PDF parse completely fails (so we don't crash)
          console.error('PDF parsing library invalid. Using fallback text.');
          rawText = "could not parse pdf content properly. verify server dependencies.";
        }
      }
    } else {
      // Fallback for text/other (if allowed)
      rawText = fs.readFileSync(filePath, 'utf8');
    }
  } catch (parseError) {
    console.error('Error parsing file:', parseError);
    // Return empty but don't crash, let the controller handle it
    rawText = "Parsing failed";
  }

  // Extract Info
  const email = extractEmail(rawText);
  const phone = extractPhone(rawText);
  const links = extractLinks(rawText);
  const skills = extractSkills(rawText);
  const experience = extractExperience(rawText);
  const education = extractEducation(rawText);
  const summary = extractSummary(rawText);

  return {
    text: rawText,
    data: {
      personalInfo: {
        email,
        phone,
        links
      },
      summary,
      skills: skills.length > 0 ? skills : [],
      experience,
      education,
      projects: [] // TODO: Implement project extraction
    }
  };
};

module.exports = {
  extractResumeData
};