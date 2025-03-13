const HF_API_TOKEN = import.meta.env.VITE_HUGGINGFACE_API_TOKEN;

interface Result {
    name: string;
    score: string;
    description: string;
    link: string;
}

export const analyzeImageFromFile = async (file: File): Promise<Result[]> => {
    try {
        if (!HF_API_TOKEN) {
            throw new Error("El token de autenticación de Hugging Face no está configurado.");
        }

        // Leer el archivo como un ArrayBuffer (binario)
        const imageData = await file.arrayBuffer();

        const apiUrl = process.env.NODE_ENV === 'development' 
            ? '/api'
            : 'https://api-inference.huggingface.co'; 

        // Hacer la solicitud a la API de Hugging Face
        const response = await fetch(
            `${apiUrl}/models/google/vit-base-patch16-224`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${HF_API_TOKEN}`,
                    "Content-Type": "application/octet-stream",
                },
                body: imageData,
            }
        );

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error("Error al conectar con la API de Hugging Face:", errorMessage);
            throw new Error(`Error en la API de Hugging Face: ${errorMessage}`);
        }

        const data = await response.json();

        if (!data || !Array.isArray(data) || data.length === 0) {
            return [{
                name: "Desconocido",
                score: "0%",
                description: "No se pudo identificar el objeto.",
                link: "#"
            }];
        }

        // Tomar los 5 primeros resultados y procesarlos
        const topFive = data.slice(0, 5).map(async (item: { label: string; score: number }) => {
            const objectName = item.label ?? "Desconocido";
            const score = `${(item.score * 100).toFixed(1)}%`; // Convertir a porcentaje con 1 decimal

            // Consultar Wikipedia para obtener más información
            const wikiUrl = `https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(objectName)}`;
            const wikiResponse = await fetch(wikiUrl);

            let description = "No se encontró información.";
            let link = `https://es.wikipedia.org/wiki/${encodeURIComponent(objectName)}`;

            if (wikiResponse.ok) {
                const wikiData = await wikiResponse.json();
                description = wikiData.extract
                    ? wikiData.extract.split(". ").slice(0, 2).join(". ") + "."
                    : "No se encontró información.";
                link = wikiData.content_urls?.desktop?.page || link;
            } else {
                console.error(`Error al obtener información de Wikipedia para ${objectName}:`, wikiResponse.statusText);
            }

            return { name: objectName, score, description, link };
        });

        // Esperar a que todas las promesas de Wikipedia se resuelvan
        const results = await Promise.all(topFive);
        return results;
    } catch (error) {
        console.error("Error al analizar la imagen:", error);
        throw new Error("Hubo un problema al procesar la imagen.");
    }
};


