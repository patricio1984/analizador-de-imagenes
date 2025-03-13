import { useState } from "react";
import { analyzeImageFromFile } from "./services/api";
import AnimalInfo from "./components/AnimalInfo";

const App = () => {
    const [results, setResults] = useState<
        { animalName: string; score: string; description: string; link: string }[]
    >([]);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            try {
                const analysisResults = await analyzeImageFromFile(file);
                const formattedResults = analysisResults.map(result => ({
                    animalName: result.name,
                    score: result.score,
                    description: result.description,
                    link: result.link,
                }));
                setResults(formattedResults);
            } catch (error) {
                console.error("Error en handleImageUpload:", error);
                setResults([{
                    animalName: "Error",
                    score: "0%",
                    description: "Hubo un problema al procesar la imagen.",
                    link: "#",
                }]);
            }
        }
    };

    const handleImageReset = () => {
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
        setResults([]);
    };

    const toggleDarkMode = () => {
        setIsDarkMode(prev => !prev);
    };

    return (
        <div className={`min-h-screen flex flex-col items-center p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-customBlue-50'} transition duration-300 ease-in-out`}>
            {/* Header */}
            <header className="w-full max-w-4xl flex flex-col items-center">
                <div className="w-full flex justify-between items-center mb-4">
                    <h1 className={`text-3xl font-bold text-center flex-1 ${isDarkMode ? 'dark text-white' : 'text-customBlue-700'}`}>
                        Analizador de Imágenes
                    </h1>
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-full bg-customBlue-500 dark:bg-gray-700 text-white dark:text-gray-200 hover:bg-customBlue-700 dark:hover:bg-gray-600 transition-colors"
                        aria-label={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                    >
                        {isDarkMode ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        ) : (
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            >
                            <path d="M12 4a1 1 0 110-2 1 1 0 010 2zm0 16a1 1 0 110 2 1 1 0 010-2zm10-8a1 1 0 110 2 1 1 0 010-2zm-20 0a1 1 0 110 2 1 1 0 010-2zm16.95-7.05a1 1 0 111.414 1.414l-1.414-1.414zm-13.9 13.9a1 1 0 111.414 1.414l-1.414-1.414zm13.9 1.414a1 1 0 11-1.414-1.414l1.414 1.414zM4.636 6.05a1 1 0 11-1.414-1.414l1.414 1.414zM12 6a6 6 0 100 12 6 6 0 000-12zM12 8a4 4 0 110 8 4 4 0 010-8z" />
                            </svg>
                        )}
                    </button>
                </div>
                <p className={`text-lg text-center max-w-2xl mb-8 ${isDarkMode ? 'dark text-gray-300' : 'text-gray-600'}`}>
                    Sube una imagen y descubre qué animales identifica nuestra IA.
                </p>
            </header>

            {/* Main content */}
            <main className={`w-full max-w-4xl flex-1 flex flex-col items-center mt-4 md:mt-16 p-5 rounded-lg shadow-md ${isDarkMode ? 'dark bg-gray-700' : 'bg-white'}`}>
                <div className="mb-6 w-full">
                    <label
                        htmlFor="image-upload"
                        className={`block text-lg font-medium mb-2 cursor-pointer ${isDarkMode ? 'dark text-gray-200' : 'text-customBlue-700'}`}
                    >
                        Sube una imagen para analizar
                        <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className={`mt-2 block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-customBlue-500 file:text-white hover:file:bg-customBlue-700 transition-colors ${isDarkMode ? 'dark text-gray-200' : 'text-gray-500'}`}
                        />
                    </label>
                </div>

                {imagePreview ? (
                    <section className="flex flex-col md:flex-row gap-6 animate-fade-in w-full">
                        {/* Vista previa */}
                        <div className="flex-1 space-y-4" role="region" aria-label="Vista previa de la imagen">
                            <h2 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'dark text-gray-200' : 'text-customBlue-700'}`}>Vista previa</h2>

                            <img src={imagePreview} alt="Vista previa de la imagen subida" className="w-full h-auto max-h-80 object-contain rounded-md" />

                            <button onClick={handleImageReset} className="mt-4 w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-md hover:bg-red-800 transition-colors">
                                Borrar imagen
                            </button>

                            {results.length > 0 && (
                                <div className={`p-4 rounded-lg shadow-md text-center ${isDarkMode ? 'dark bg-gray-400' : 'bg-white'}`}>
                                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-800' : 'text-customBlue-700'}`}>
                                        Resumen
                                    </h3>

                                    <p className={`${isDarkMode ? 'dark text-black' : 'text-gray-600'}`}>
                                        Identificamos {results.length} posibles animales en tu imagen.
                                    </p>
                                </div>
                            )}
                        </div>
                
                        {/* Resultados */}
                        <div className="flex-1 space-y-4" role="region" aria-label="Resultados del análisis">
                            {results.length > 0 && results.map((result, index) => (
                                <AnimalInfo
                                    key={index}
                                    animalName={result.animalName}
                                    score={result.score}
                                    description={result.description}
                                    link={result.link}
                                    isDarkMode={isDarkMode}
                                />
                            ))}
                        </div>
                    </section>
                        ) : (
                            <div className={`flex flex-col items-center text-center animate-fade-in ${isDarkMode ? 'dark text-gray-200' : 'text-gray-500'}`}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="120"
                                    height="120"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1"
                                    className="mb-4"
                                >
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                    <polyline points="21 15 16 10 5 21" />
                                </svg>
                                <p>Sube una imagen para comenzar</p>
                            </div>
                        )}
            </main>

            {/* Footer */}
            <footer className={`w-full max-w-4xl mt-6 text-center ${isDarkMode ? 'dark text-gray-300' : 'text-gray-600'}`}>
                <p>Creado con ❤️ por Patricio D. Mainero</p>
                <div className="flex justify-center gap-4 mt-2">
                    <a
                        href="https://github.com/patricio1984"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`hover:text-customBlue-700 transition-colors ${isDarkMode ? 'dark text-gray-300' : 'text-gray-600'}`}
                        aria-label="Visita mi perfil de GitHub"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.135 1.84 1.24 1.84 1.24 1.07 1.89 2.93 1.34 3.64 1.025.11-.885.427-1.34.77-1.645-2.69-.305-5.52-1.345-5.52-5.985 0-1.32.465-2.4 1.235-3.245-.125-.305-.54-1.53.12-3.19 0 0 1.005-.325 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.555 3.285-1.23 3.285-1.23.66 1.66.245 2.885.12 3.19.77.845 1.235 1.925 1.235 3.245 0 4.655-2.835 5.675-5.53 5.975.435.375.81 1.11.81 2.24 0 1.62-.015 2.925-.015 3.325 0 .32.215.695.825.575C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                    </a>
                    <a
                        href="https://linkedin.com/in/patriciomainero"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`hover:text-customBlue-700 transition-colors  ${isDarkMode ? 'dark text-gray-300' : 'text-gray-600'}`}
                        aria-label="Visita mi perfil de LinkedIn"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.3c-.97 0-1.75-.78-1.75-1.75s.78-1.75 1.75-1.75 1.75.78 1.75 1.75-.78 1.75-1.75 1.75zm13.5 11.3h-3v-5.5c0-1.31-.03-3-1.82-3-1.82 0-2.1 1.42-2.1 2.89v5.61h-3v-10h2.88v1.36h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.61v5.59z" />
                        </svg>
                    </a>
                </div>
            </footer>
        </div>
    );
};

export default App;






