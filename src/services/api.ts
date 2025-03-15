interface Result {
    name: string;
    score: string;
    description: string;
    link: string;
}

export const analyzeImageFromFile = async (file: File): Promise<Result[]> => {
    try {
        // Preprocesar la imagen en el frontend
        const canvas = document.createElement("canvas");
        canvas.width = 224;
        canvas.height = 224;
        const ctx = canvas.getContext("2d");

        // Verificar si ctx es null
        if (!ctx) {
            throw new Error("No se pudo inicializar el contexto 2D del canvas.");
        }

        const img = new Image();
        const imageUrl = URL.createObjectURL(file);
        await new Promise((resolve) => {
            img.onload = resolve;
            img.src = imageUrl;
        });

        // Dibujar la imagen redimensionada en el canvas
        ctx.drawImage(img, 0, 0, 224, 224);
        URL.revokeObjectURL(imageUrl);

        // Convertir el canvas a un Blob (JPEG)
        const imageBlob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((blob) => resolve(blob!), "image/jpeg", 0.9);
        });

        const imageData = await imageBlob.arrayBuffer();

        // Enviar la imagen preprocesada al proxy de Netlify
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

        const topFive = data.slice(0, 5).map(async (item: { label: string; score: number }) => {
            const objectName = item.label ?? "Desconocido";
            const score = `${(item.score * 100).toFixed(1)}%`;

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

        const results = await Promise.all(topFive);
        return results;
    } catch (error) {
        console.error("Error al analizar la imagen:", error);
        throw new Error("Hubo un problema al procesar la imagen.");
    }
};