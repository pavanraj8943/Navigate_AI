const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Google Generative AI client
// Note: We are using the existing OPENAI_API_KEY env var which contains a Google API Key
let genAI;
const modelsToTry = ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-flash-latest", "gemini-pro-latest", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
let activeModel = null;

if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('AIza')) {
    genAI = new GoogleGenerativeAI(process.env.OPENAI_API_KEY);
    // Initial model is just a placeholder, we will get the model instance dynamically or try-catch
    activeModel = genAI.getGenerativeModel({ model: modelsToTry[0] });
} else {
    console.warn('WARNING: Valid Google API Key not found in OPENAI_API_KEY environment variable.');
}

const checkClient = () => {
    if (!genAI) {
        console.warn('AI service unavailable (client not initialized), using mock response.');
        return false;
    }
    return true;
};

// Helper to try generating content with fallbacks
const generateWithFallback = async (prompt) => {
    let lastError = null;

    for (const modelName of modelsToTry) {
        try {
            console.log(`Trying model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text(); // Success
        } catch (err) {
            console.warn(`Model ${modelName} failed:`, err.message);
            lastError = err;

            // If it's not a 404 (Not Found), it might be something else, but strictly for "not found" or "not supported" we continue.
            // Actually, we should probably continue for most errors except maybe Auth errors.
            // 404 is specifically what we are seeing.
            if (err.message.includes('404') || err.message.includes('not found')) {
                continue;
            }
            // For other errors, maybe still try? Let's just try all.
        }
    }
    throw lastError || new Error("All models failed.");
};

exports.generateResponse = async (messages, context) => {
    try {
        if (!checkClient()) {
            return "I apologize, but I am currently unavailable. Please check the server configuration.";
        }

        let promptContext = `You are a helpful, expert technical assistant, similar to Stack Overflow's AI. 
        Your goal is to help developers with coding questions, debugging, and software architecture.
        Be concise, accurate, and provide code examples where appropriate.
        
        Context provided by user (Resume/Background):
        ${context || 'No specific context provided.'}
        `;

        // Simplify for fallback: just construct a large prompt string since we are using generateContent mostly
        // But activeModel in original code used startChat.
        // To support fallback easily, we might switch to generateContent for chat if we want stateless,
        // OR we just stick to one model for chat if it worked before?

        // For this function 'generateResponse' (Chat), let's try to find a working model first if not set?
        // Actually, let's just use generateWithFallback but we need to format history.

        // Construct prompt history for generateContent (simpler than startChat for fallback logic)
        const lastMessage = messages[messages.length - 1];
        const historyText = messages.slice(0, -1).map(m => `${m.role === 'assistant' ? 'Model' : 'User'}: ${m.content}`).join('\n');

        const fullPrompt = `${promptContext}\n\nChat History:\n${historyText}\n\nUser: ${lastMessage.content}\nModel:`;

        const text = await generateWithFallback(fullPrompt);
        return text;

    } catch (err) {
        console.error('Gemini Error:', err);
        return "I encountered an error processing your request. Please try again later.";
    }
};

// Deprecated/Stubbed Interview Functions
exports.generateInterviewQuestions = async (context, count = 5, type = 'general') => {
    try {
        if (!checkClient()) {
            // Mock questions if AI is offline
            return [
                {
                    question: "Tell me about yourself.",
                    category: "Introduction",
                    difficulty: "Easy",
                    hint: "Focus on your professional background and key achievements."
                }
            ];
        }

        const prompt = `
            You are an expert technical interviewer.
            Based on the following candidate context (Resume/Background):
            "${context}"
            
            Generate ${count} interview questions.
            The questions should be a mix of:
            1. Resume-based (specific to their skills and experience)
            2. HR/Behavioral (cultural fit, soft skills)
            3. Technical (based on their listed skills)
            
            The output must be a valid JSON array of objects with the following structure:
            [
                {
                    "question": "The question text",
                    "category": "Resume" | "HR" | "Technical",
                    "difficulty": "Easy" | "Medium" | "Hard",
                    "hint": "A brief hint for the candidate"
                }
            ]
            
            IMPORTANT: Return ONLY the JSON array. No markdown formatting or other text.
        `;

        const text = await generateWithFallback(prompt);

        // Clean up the response to ensure valid JSON
        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(jsonString);

    } catch (err) {
        console.error('Gemini Question Generation Error:', err);
        // Fallback to mock questions
        return [
            {
                question: "Tell me about yourself.",
                category: "Introduction",
                difficulty: "Easy",
                hint: "Focus on your professional background and key achievements."
            }
        ];
    }
};

exports.evaluateAnswer = async (question, answer, context) => {
    try {
        if (!checkClient()) {
            return {
                score: 5,
                feedback: "AI service unavailable. Default score provided.",
                improvedAnswer: "N/A"
            };
        }

        const prompt = `
            You are an expert technical interviewer evaluating a candidate's answer.
            
            Question: "${question}"
            Candidate's Answer: "${answer}"
            Candidate Context: "${context}"
            
            Evaluate the answer on a scale of 1-10.
            Provide constructive feedback and a better version of the answer.
            
            The output must be a valid JSON object with the following structure:
            {
                "score": number (1-10),
                "feedback": "Detailed feedback string",
                "improvedAnswer": "A better version of the answer"
            }
            
            IMPORTANT: Return ONLY the JSON object. No markdown formatting or other text.
        `;

        const text = await generateWithFallback(prompt);

        // Clean up the response
        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(jsonString);

    } catch (err) {
        console.error('Gemini Answer Evaluation Error:', err);
        return {
            score: 0,
            feedback: "Error evaluating answer.",
            improvedAnswer: "N/A"
        };
    }
};

// Analyze resume to determine level and insights
exports.analyzeResumeLevel = async (resumeText) => {
    try {
        if (!checkClient()) {
            return {
                level: 'Intermediate',
                summary: 'AI service unavailable. Defaulting to Intermediate.',
                strengths: [],
                weaknesses: [],
                suggestedFocus: []
            };
        }

        const prompt = `
            Analyze the following resume text and determine the candidate's experience level (Beginner, Intermediate, or Advanced).
            Also provide a summary, list of strengths, weaknesses, and suggested focus areas for an interview.
            
            Resume Text:
            "${resumeText.substring(0, 10000)}" // Limit text to avoid token limits
            
            Return a JSON object:
            {
                "level": "Beginner" | "Intermediate" | "Advanced",
                "summary": "Brief professional summary",
                "strengths": ["strength1", "strength2"],
                "weaknesses": ["weakness1", "weakness2"],
                "suggestedFocus": ["topic1", "topic2"]
            }
        `;

        const text = await generateWithFallback(prompt);
        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonString);

    } catch (err) {
        console.error('Resume Analysis Error:', err);
        return {
            level: 'Intermediate',
            summary: 'Error analyzing resume.',
            strengths: [],
            weaknesses: [],
            suggestedFocus: []
        };
    }
};

// Generate a SINGLE next question based on context and adaptive logic
exports.generateNextQuestion = async (context, sessionState) => {
    try {
        if (!checkClient()) {
            return {
                question: "Tell me about your experience.",
                category: sessionState.currentSection || "Introduction",
                difficulty: sessionState.currentDifficulty || "Medium",
                hint: "Overview of your background."
            };
        }

        const { currentSection, currentDifficulty, previousQuestions, lastAnswer, lastEvaluation } = sessionState;

        const prompt = `
            You are an expert technical interviewer conducting a ${currentDifficulty} level interview.
            Section: ${currentSection}
            
            Candidate Context (Resume):
            "${context}"
            
            Previous Question History (Last 5):
            ${JSON.stringify(previousQuestions.slice(-5))}
            
            ${lastAnswer ? `Last Answer: "${lastAnswer}"` : ''}
            ${lastEvaluation ? `Last Evaluation Score: ${lastEvaluation.score}/10` : ''}
            
            Generate ONE new interview question for the "${currentSection}" section.
            The question should be appropriate for ${currentDifficulty} difficulty.
            ${currentSection === 'Technical' ? 'Focus on specific skills listed in the resume.' : ''}
            ${currentSection === 'HR' ? 'Focus on behavioral/situational questions.' : ''}
            
            Ensure the question is NOT a duplicate of previous questions.
            
            Return a JSON object:
            {
                "question": "The question text",
                "category": "${currentSection}",
                "difficulty": "${currentDifficulty}",
                "hint": "A helpful hint if they get stuck"
            }
        `;

        const text = await generateWithFallback(prompt);
        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonString);

    } catch (err) {
        console.error('Question Generation Error:', err);
        return {
            question: "Could you elaborate on your experience?",
            category: sessionState.currentSection || "General",
            difficulty: sessionState.currentDifficulty || "Medium",
            hint: "Share more details."
        };
    }
};

// Generate MULTIPLE questions in a single batch to save API calls
exports.generateBatchQuestions = async (context, count, configs) => {
    try {
        if (!checkClient()) {
            // Return mocks if unavailable
            return configs.map(c => ({
                question: "Tell me about your experience.",
                category: c.section || "General",
                difficulty: c.difficulty || "Medium",
                hint: "Overview of your background."
            }));
        }

        const prompt = `
            You are an expert technical interviewer.
            Context (Resume): "${context.substring(0, 5000)}"
            
            Generate ${count} interview questions based on the following specifications:
            ${configs.map((c, i) => `${i + 1}. Difficulty: ${c.difficulty}, Category: ${c.section}`).join('\n')}
            
            Return a JSON array of objects. Each object must strictly follow this schema:
            {
                "question": "Question text",
                "category": "Category from spec",
                "difficulty": "Difficulty from spec",
                "hint": "Brief hint"
            }
            
            IMPORTANT: Return ONLY the JSON array.
        `;

        const text = await generateWithFallback(prompt);
        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(jsonString);

        // Validate array length and structure
        if (Array.isArray(parsed)) {
            return parsed;
        } else {
            throw new Error("Invalid response format (not an array)");
        }

    } catch (err) {
        console.error('Batch Question Generation Error:', err);
        // Fallback: return simple mocks mapping to configs
        return configs.map(c => ({
            question: "Could you elaborate on your experience regarding " + c.section + "?",
            category: c.section,
            difficulty: c.difficulty,
            hint: "Discuss your relevant projects."
        }));
    }
};

exports.checkResumeAlignment = async (context, targetRole) => {
    try {
        if (!checkClient()) return { matchPercentage: 0, gaps: [], suggestions: [] };

        const prompt = `
            Analyze the following resume context against the target role: "${targetRole}".
            Resume Context: "${context}"
            
            Provide a match percentage, list missing skills/gaps, and suggestions for improvement.
            
            Return JSON:
            {
                "matchPercentage": number (0-100),
                "gaps": ["gap1", "gap2"],
                "suggestions": ["suggestion1", "suggestion2"]
            }
         `;

        const text = await generateWithFallback(prompt);

        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonString);

    } catch (err) {
        console.error('Alignment Check Error:', err);
        return { matchPercentage: 0, gaps: ["Error checking alignment"], suggestions: [] };
    }
};
