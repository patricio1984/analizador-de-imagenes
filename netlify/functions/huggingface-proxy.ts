import fetch from 'node-fetch';
import { Handler } from '@netlify/functions';

const handler: Handler = async (event, context) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const HF_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;
    const apiUrl = "https://api-inference.huggingface.co/models/google/vit-base-patch16-224";

    console.log("Token HF:", HF_API_TOKEN ? "Presente" : "Ausente");

    if (!HF_API_TOKEN) {
        return { statusCode: 500, body: JSON.stringify({ error: "El token de Hugging Face no está configurado en el servidor." }) };
    }

    try {
        if (!event.body) {
            return { statusCode: 400, body: JSON.stringify({ error: "El cuerpo de la solicitud no puede ser nulo." }) };
        }

        const binaryData = Buffer.from(event.body, 'base64');
        console.log("Datos binarios enviados:", binaryData.length, "bytes");

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${HF_API_TOKEN}`,
                "Content-Type": "application/octet-stream",
            },
            body: binaryData,
        });

        const responseText = await response.text();
        console.log("Estado de la respuesta:", response.status);
        console.log("Respuesta completa:", responseText);

        if (!response.ok) {
            return { statusCode: response.status, body: JSON.stringify({ error: responseText }) };
        }

        const data = JSON.parse(responseText);
        return { statusCode: 200, body: JSON.stringify(data) };
    } catch (error) {
        console.error("Error en la función proxy:", error);
        return { statusCode: 500, body: JSON.stringify({ error: "Error interno del servidor" }) };
    }
};

export { handler };