import fetch from 'node-fetch';
import { Handler } from '@netlify/functions';

const handler: Handler = async (event, context) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const HF_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;
    const apiUrl = "https://api-inference.huggingface.co/models/google/vit-base-patch16-224";

    try {
        if (!event.body) {
            return { statusCode: 400, body: JSON.stringify({ error: "El cuerpo de la solicitud no puede ser nulo." }) };
        }

        const binaryData = Buffer.from(event.body, 'base64');
        console.log("Buffer decodificado:", binaryData);

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${HF_API_TOKEN}`,
                "Content-Type": "application/octet-stream",
            },
            body: binaryData,
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            return { statusCode: response.status, body: JSON.stringify({ error: errorMessage }) };
        }

        const data = await response.json();
        return { statusCode: 200, body: JSON.stringify(data) };
    } catch (error) {
        console.error("Error en la función proxy:", error);
        return { statusCode: 500, body: JSON.stringify({ error: "Error interno del servidor" }) };
    }
};

export { handler };