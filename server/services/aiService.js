const OpenAI = require('openai');

// Initialize OpenAI client
// Note: This requires OPENAI_API_KEY in .env
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

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
