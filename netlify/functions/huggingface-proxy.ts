import fetch from 'node-fetch';
import { Handler } from '@netlify/functions';

const handler: Handler = async (event, context) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const HF_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

    if (!HF_API_TOKEN) {
        return { statusCode: 500, body: JSON.stringify({ error: "Token no configurado" }) };
    }

    try {
        if (!event.body) {
            return { statusCode: 400, body: JSON.stringify({ error: "No se envió ninguna imagen." }) };
        }

        const binaryData = Buffer.from(event.body, 'base64');

        const response = await fetch(
            "https://api-inference.huggingface.co/models/google/vit-base-patch16-224",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${HF_API_TOKEN}`,
                    "Content-Type": "application/octet-stream",
                },
                body: binaryData,
            }
        );

        const responseText = await response.text();

        if (!response.ok) {
            console.error("Error de Hugging Face:", responseText);
            return { statusCode: response.status, body: JSON.stringify({ error: responseText }) };
        }

        const data = JSON.parse(responseText);
        return { statusCode: 200, body: JSON.stringify(data) };
    } catch (error) {
        console.error("Error en la función:", error);
        return { statusCode: 500, body: JSON.stringify({ error: "Error interno del servidor" }) };
    }
};

export { handler };