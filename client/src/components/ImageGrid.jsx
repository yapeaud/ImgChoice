import React from 'react'
import '../styles/ImageGrid.css'

// Composant pour afficher une grille d'images avec des options de sélection
const ImageGrid = ({ images, selectedImages, onImageToggle }) => {
    return (
        <main className="image-grid">
            {images.map((image) => (
                <section
                    key={image.id}
                    className={`image-card ${selectedImages.has(image.id) ? 'selected' : ''}`}
                    onClick={() => onImageToggle(image.id)}
                >
                    <article className="image-wrapper">
                        <img
                            src={image.url}
                            alt={image.description || 'Image'}
                            loading="lazy"
                        />
                        <div className="image-overlay">
                            <input
                                type="checkbox"
                                checked={selectedImages.has(image.id)}
                                onChange={() => onImageToggle(image.id)}
                                onClick={(e) => e.stopPropagation()}
                                className="image-checkbox"
                            />
                        </div>
                        <div className="image-info">
                            <p className="image-author">
                                Photo par <a href={image.authorUrl} target="_blank" rel="noopener noreferrer">
                                    {image.author}
                                </a>
                            </p>
                        </div>
                    </article>
                </section>
            ))}
        </main>
    );
};

export default ImageGrid