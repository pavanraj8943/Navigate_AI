const OpenAI = require('openai');

// Initialize OpenAI client
// Note: This requires OPENAI_API_KEY in .env
let openai;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
    openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
} else {
    console.warn('WARNING: OPENAI_API_KEY is missing or not set. AI features will not work.');
}

const checkClient = () => {
    if (!openai) {
        throw new Error('AI service is currently unavailable. Please check your OPENAI_API_KEY configuration.');
    }
};

exports.generateResponse = async (messages, context) => {
    try {
        const systemPrompt = {
            role: 'system',
            content: `You are an expert interview coach and career advisor.
      
      Here is the candidate's resume context:
      ${context || 'No resume uploaded yet.'}
      
      Your goal is to help the candidate prepare for interviews, improve their resume, and advance their career.
      - Be encouraging, professional, and specific.
      - Use the resume context to tailor your advice.
      - If asking interview questions, use the STAR method (Situation, Task, Action, Result) as a guide.
      - Keep responses concise and actionable.
      `
        };

        checkClient();

        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo', // or gpt-4 if available/affordable
            messages: [systemPrompt, ...messages],
            temperature: 0.7,
            max_tokens: 500,
        });

        return completion.choices[0].message.content;
    } catch (err) {
        console.error('OpenAI Error:', err);
        throw new Error('Failed to generate AI response');
    }
};

exports.generateInterviewQuestions = async (context, count = 5) => {
    try {
        const systemPrompt = {
            role: 'system',
            content: `You are an expert technical and behavioral interviewer. 
            Based on the candidate's resume context provided below, generate ${count} unique interview questions.
            Mix behavioral (STAR method) and technical questions relevant to their skills and experience.
            
            Return ONLY a JSON array of objects with the following structure:
            [
                {
                    "question": "The question text",
                    "category": "behavioral" | "technical" | "system-design",
                    "hint": "A short hint for the candidate"
                }
            ]
            
            Candidate Context:
            ${context || 'No resume provided. Ask general professional questions.'}
            `
        };

        checkClient();

        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [systemPrompt],
            temperature: 0.8,
            max_tokens: 1000,
            response_format: { type: "json_object" }
        });

        const response = JSON.parse(completion.choices[0].message.content);
        return response.questions || response; // Handle both cases where it might be wrapped in {questions: []}
    } catch (err) {
        console.error('AI generateQuestions error:', err);
        throw new Error('Failed to generate interview questions');
    }
};

exports.evaluateAnswer = async (question, answer, context) => {
    try {
        const systemPrompt = {
            role: 'system',
            content: `You are an expert interviewer evaluating a candidate's response.
            Evaluate the answer based on the question and the candidate's resume context.
            Provide a score from 1 to 10 and constructive feedback.
            
            Return ONLY a JSON object with the following structure:
            {
                "score": number,
                "feedback": "string",
                "strengths": ["string"],
                "improvements": ["string"]
            }
            
            Candidate Context:
            ${context}
            `
        };

        const userPrompt = {
            role: 'user',
            content: `Question: ${question}\nCandidate Answer: ${answer}`
        };

        checkClient();

        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [systemPrompt, userPrompt],
            temperature: 0.5,
            max_tokens: 800,
            response_format: { type: "json_object" }
        });

        return JSON.parse(completion.choices[0].message.content);
    } catch (err) {
        console.error('AI evaluateAnswer error:', err);
        throw new Error('Failed to evaluate answer');
    }
};
