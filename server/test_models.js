require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
    if (!process.env.OPENAI_API_KEY) {
        console.error("No OPENAI_API_KEY found in .env");
        return;
    }

    console.log("Using API Key starting with:", process.env.OPENAI_API_KEY.substring(0, 8));

    try {
        const genAI = new GoogleGenerativeAI(process.env.OPENAI_API_KEY);
        // Did not see a direct listModels method on genAI instance in basic docs, 
        // typically it's via model manager or just trying a known working one.
        // Actually, older SDKs or specific calls might support it, but let's try to just run a simple prompt with 'gemini-1.5-flash'.

        const modelName = 'gemini-1.5-flash';
        console.log(`Testing model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello, are you working?");
        const response = await result.response;
        console.log("Response:", response.text());
        console.log("SUCCESS: gemini-1.5-flash is working.");

    } catch (error) {
        console.error("Error with gemini-1.5-flash:", error.message);

        // Try fallback to gemini-pro
        try {
            console.log("Testing fallback: gemini-pro");
            const genAI = new GoogleGenerativeAI(process.env.OPENAI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent("Hello");
            console.log("Response:", await result.response.text());
            console.log("SUCCESS: gemini-pro is working.");
        } catch (err2) {
            console.error("Error with gemini-pro:", err2.message);
        }
    }
}

listModels();
