import React, { useState } from 'react'
import axios from 'axios'
import '../styles/Dashboard.css'
import ImageGrid from './ImageGrid.jsx'
import SearchForm from './SearchForm.jsx'
import SearchHistory from './SearchHistory.jsx'
import TopSearchesBanner from './TopSearchesBanner.jsx'

// Composant principal du tableau de bord utilisateur
const Dashboard = ({ user }) => {

    const [searchTerm, setSearchTerm] = useState('');
    const [images, setImages] = useState([]);
    const [selectedImages, setSelectedImages] = useState(new Set());
    const [loading, setLoading] = useState(false);
    const [resultCount, setResultCount] = useState(0);
    const [showHistory, setShowHistory] = useState(false);

    const apiUrl = import.meta.env.VITE_API_URL;

    // Fonction pour gérer la recherche d'images
    const handleSearch = async (term) => {
        if (!term || term.trim() === '') return;

        setLoading(true);
        setSearchTerm(term);
        setSelectedImages(new Set());

        try {
            const response = await axios.post(
                `${apiUrl}/search`,
                { term: term.trim() },
                { withCredentials: true }
            );

            setImages(response.data.images);
            setResultCount(response.data.count);
        } catch (error) {
            console.error('Erreur lors de la recherche:', error);
            if (error.response?.status === 401) {
                alert('Session expirée. Veuillez vous reconnecter.');
                window.location.href = '/login';
            } else {
                alert('Erreur lors de la recherche. Veuillez réessayer.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour gérer la selection d'images
    const handleImageToggle = (imageId) => {
        const newSelected = new Set(selectedImages);
        if (newSelected.has(imageId)) {
            newSelected.delete(imageId);
        } else {
            newSelected.add(imageId);
        }
        setSelectedImages(newSelected);
    };

    // Fonction pour sélectionner ou désélectionner toutes les images
    const handleSelectAll = () => {
        if (selectedImages.size === images.length) {
            setSelectedImages(new Set());
        } else {
            setSelectedImages(new Set(images.map(img => img.id)));
        }
    };

    return (
        <main className="dashboard">
            <TopSearchesBanner onSearchClick={handleSearch} />

            <section className="dashboard-container">
                <article className="dashboard-main">
                    <SearchForm onSearch={handleSearch} loading={loading} />

                    {searchTerm && (
                        <div className="search-results-header">
                            <p className="search-info">
                                Vous avez recherché "<strong>{searchTerm}</strong>" - <strong>{resultCount}</strong> résultats.
                            </p>
                            {images.length > 0 && (
                                <div className="selection-controls">
                                    <span className="selection-count">
                                        Sélectionné : <strong>{selectedImages.size}</strong> image{selectedImages.size > 1 ? 's' : ''}
                                    </span>
                                    <button onClick={handleSelectAll} className="select-all-btn">
                                        {selectedImages.size === images.length ? 'Tout désélectionner' : 'Tout sélectionner'}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {loading && (
                        <div className="loading-message">
                            <div className="spinner"></div>
                            <p>Recherche en cours...</p>
                        </div>
                    )}

                    {!loading && images.length > 0 && (
                        <ImageGrid
                            images={images}
                            selectedImages={selectedImages}
                            onImageToggle={handleImageToggle}
                        />
                    )}

                    {!loading && searchTerm && images.length === 0 && (
                        <div className="no-results">
                            <p>Aucun résultat trouvé pour "{searchTerm}"</p>
                        </div>
                    )}
                </article>

                <article className="dashboard-sidebar">
                    <button
                        className="history-toggle-btn"
                        onClick={() => setShowHistory(!showHistory)}
                    >
                        {showHistory ? 'Masquer' : 'Afficher'} l'historique
                    </button>

                    {showHistory && <SearchHistory onSearchClick={handleSearch} />}
                </article>
            </section>
        </main>
    );
}

export default Dashboard