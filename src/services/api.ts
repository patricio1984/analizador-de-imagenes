interface Result {
    name: string;
    score: string;
    description: string;
    link: string;
}

export const analyzeImageFromFile = async (file: File): Promise<Result[]> => {
    try {
        const imageData = await file.arrayBuffer();

        const response = await fetch("/.netlify/functions/huggingface-proxy", {
            method: "POST",
            headers: {
                "Content-Type": "application/octet-stream",
            },
            body: imageData,
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error en la solicitud: ${errorMessage}`);
        }

        const data = await response.json();

        if (!data || !Array.isArray(data)) {
            return [{ name: "Desconocido", score: "0%", description: "No se pudo identificar el objeto.", link: "#" }];
        }

        // Procesar los 5 primeros resultados con Wikipedia
        const topFive = data.slice(0, 5).map(async (item: { label: string; score: number }) => {
            const objectName = item.label ?? "Desconocido";
            const score = `${(item.score * 100).toFixed(1)}%`;

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

        // Esperar a que todas las consultas a Wikipedia se resuelvan
        const results = await Promise.all(topFive);
        return results;
    } catch (error) {
        console.error("Error al analizar la imagen:", error);
        throw new Error("Hubo un problema al procesar la imagen.");
    }
};

