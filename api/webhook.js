const axios = require("axios");


export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método no permitido, usa POST" });
    }

    const API_KEY = process.env.OPENAI_API_KEY; // Usamos la clave de OpenAI desde las variables de entorno en Vercel
    const userMessage = req.body.queryResult?.queryText || "Hola"; // Capturamos la pregunta del usuario

    try {
        const response = await axios.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-4-turbo",
            messages: [
                { role: "system", content: "Eres Manuel, asistente de IA de Performance Lab Ibiza. Responde sobre espectáculos y asesoramiento de eventos." },
                { role: "user", content: userMessage }
            ]
        }, {
            headers: { "Authorization": `Bearer ${API_KEY}` }
        });

        res.json({ fulfillmentText: response.data.choices[0].message.content }); // Respondemos a Dialogflow
    } catch (error) {
        console.error("Error en OpenAI:", error.response?.data || error.message);
        res.json({ fulfillmentText: "Hubo un error al procesar tu solicitud." });
    }
}
