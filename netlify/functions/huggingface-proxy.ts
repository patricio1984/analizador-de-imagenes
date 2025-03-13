import fetch from 'node-fetch';
import { Handler } from '@netlify/functions';
import { translate } from '@vitalets/google-translate-api';

const handler: Handler = async (event, context) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const HF_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

    if (!HF_API_TOKEN) {
        console.error("Token de Hugging Face no configurado.");
        return { statusCode: 500, body: JSON.stringify({ error: "El token de Hugging Face no está configurado en el servidor." }) };
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

        // Traducir las etiquetas al español
        const translatedData = await Promise.all(
            data.map(async (item: { label: string; score: number }) => {
                try {
                    const translation = await translate(item.label, { to: 'es' });
                    return { label: translation.text, score: item.score };
                } catch (error) {
                    console.error(`Error al traducir "${item.label}":`, error);
                    return { label: item.label, score: item.score };
                }
            })
        );

        return { statusCode: 200, body: JSON.stringify(translatedData) };
    } catch (error) {
        console.error("Error en la función proxy:", error);
        return { statusCode: 500, body: JSON.stringify({ error: "Error interno del servidor" }) };
    }
};

export { handler };