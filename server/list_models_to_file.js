require('dotenv').config();
const fs = require('fs');

async function listModels() {
    const apiKey = process.env.OPENAI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        let output = "";
        if (data.models) {
            output += "MATCHING MODELS:\n";
            data.models.forEach(m => {
                output += `${m.name}\n`;
            });
        } else {
            output += "ERROR/NO MODELS: " + JSON.stringify(data);
        }

        fs.writeFileSync('available_models.txt', output);
        console.log("Written to avail_models.txt");

    } catch (err) {
        fs.writeFileSync('available_models.txt', "FETCH ERROR: " + err.message);
        console.error("Error:", err);
    }
}

listModels();
