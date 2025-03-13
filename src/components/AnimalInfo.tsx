interface AnimalInfoProps {
    animalName: string;
    score: string;
    description: string;
    link: string;
    isDarkMode: boolean;
}

const AnimalInfo: React.FC<AnimalInfoProps> = ({ animalName, score, description, link, isDarkMode }) => {
    return (
        <div className={`p-4 rounded-lg shadow-md text-center ${isDarkMode ? 'dark bg-gray-400' : 'bg-white'}`}>
            <h2 className="text-xl font-semibold text-gray-800">
                {animalName} <span className={`${isDarkMode ? 'dark text-[#001F07]' : 'text-green-800'}`}>({score})</span>
            </h2>
            <p className={`mt-2 ${isDarkMode ? 'dark text-black' : 'text-gray-600'}`}>{description}</p>
            {description !== "No se encontró información." && link !== "#" && (
                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-2 inline-block underline ${isDarkMode ? 'dark text-[#061537] hover:text-black' : 'text-blue-600 hover:text-blue-800'}`}
                >
                    Ver más en Wikipedia
                </a>
            )}
        </div>
    );
};

export default AnimalInfo;
