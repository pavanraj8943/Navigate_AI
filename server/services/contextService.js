const Resume = require('../models/Resume');

// Service to manage user context (resume data)
exports.getContext = async (userId) => {
    try {
        // Get the most recent resume
        const resume = await Resume.findOne({ user: userId }).sort({ uploadedAt: -1 });

        if (!resume || !resume.parsed) {
            return null;
        }

        return formatContext(resume.parsed);
    } catch (err) {
        console.error('Error fetching context:', err);
        return null;
    }
};

// Format parsed resume data into a system prompt friendly string
const formatContext = (data) => {
    const { personalInfo, skills, experience, projects, education } = data;

    let context = `Candidate Name: ${personalInfo?.name || 'Unknown'}\n`;

    if (skills && skills.length > 0) {
        const allSkills = skills.map(s => s.items.join(', ')).join(', ');
        context += `Skills: ${allSkills}\n`;
    }

    if (experience && experience.length > 0) {
        context += `Experience:\n`;
        experience.forEach(exp => {
            context += `- ${exp.role} at ${exp.company} (${exp.startDate || ''} - ${exp.endDate || 'Present'})\n`;
            if (exp.description) context += `  ${exp.description.substring(0, 150)}...\n`;
        });
    }

    if (projects && projects.length > 0) {
        context += `Projects:\n`;
        projects.forEach(proj => {
            context += `- ${proj.name}: ${proj.description}\n`;
        });
    }

    if (education && education.length > 0) {
        context += `Education:\n`;
        education.forEach(edu => {
            context += `- ${edu.degree} in ${edu.field} from ${edu.school}\n`;
        });
    }

    return context;
};
