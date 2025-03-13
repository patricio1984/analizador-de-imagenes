interface ImagePreviewProps {
    imageSrc: string | null;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ imageSrc }) => {
    if (!imageSrc) return null;

    return (
        <div>
            <h3>Previsualización</h3>
            <img src={imageSrc} alt="Imagen cargada" width="200" />
        </div>
    );
};

export default ImagePreview;
