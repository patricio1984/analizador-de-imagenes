import React, { useState } from "react";

interface ImageUploadProps {
    onImageUpload: (file: File) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload }) => {
    const [preview, setPreview] = useState<string | null>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];

            // Validar que el archivo sea una imagen
            if (!file.type.startsWith("image/")) {
                alert("Por favor selecciona un archivo de imagen válido.");
                return;
            }

            setPreview(URL.createObjectURL(file));
            onImageUpload(file);
        }
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {preview && <img src={preview} alt="Vista previa" style={{ width: "200px" }} />}
        </div>
    );
};

export default ImageUpload;
