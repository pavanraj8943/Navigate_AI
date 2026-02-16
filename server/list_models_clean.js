require('dotenv').config();

async function listModels() {
    const apiKey = process.env.OPENAI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            console.log("--- START MODELS ---");
            data.models.forEach(m => {
                if (m.name.includes('gemini')) {
                    console.log(m.name);
                }
            });
            console.log("--- END MODELS ---");
        } else {
            console.log("No models found or error:", JSON.stringify(data));
        }
    } catch (err) {
        console.error("Error:", err);
    }
}

listModels();
