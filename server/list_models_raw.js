require('dotenv').config();

async function listModelsRaw() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        console.error("No API Key found.");
        return;
    }

    // The SDK uses OPENAI_API_KEY for Google Key in this project context
    if (!apiKey.startsWith('AIza')) {
        console.error("Warning: Key does not start with AIza. Might not be a Google Key.");
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("API Error:", data.error);
        } else {
            console.log("Available Models:");
            if (data.models) {
                data.models.forEach(m => console.log(`- ${m.name} (${m.supportedGenerationMethods})`));
            } else {
                console.log("No models found in response:", data);
            }
        }
    } catch (err) {
        console.error("Fetch error:", err);
    }
}

listModelsRaw();
