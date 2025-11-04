import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/TopSearchesBanner.css';

// Composant pour afficher la bannière des recherches populaires
const TopSearchesBanner = ({ onSearchClick }) => {
    const [topSearches, setTopSearches] = useState([]);
    const [loading, setLoading] = useState(true);

    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetchTopSearches();
    }, []);

    // Fonction pour récupérer les recherches populaires depuis le backend
    const fetchTopSearches = async () => {
        try {
            const response = await axios.get(`${apiUrl}/top-searches`);
            setTopSearches(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des recherches populaires:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section className="top-searches-banner">
                <article className="banner-content">
                    <span className="banner-label">Recherches populaires:</span>
                    <span>Chargement...</span>
                </article>
            </section>
        );
    }

    if (topSearches.length === 0) {
        return null;
    }

    return (
        <section className="top-searches-banner">
            <article className="banner-content">
                <span className="banner-label">🔝 Recherches populaires:</span>
                <div className="top-searches-list">
                    {topSearches.map((search, index) => (
                        <button
                            key={index}
                            className="top-search-tag"
                            onClick={() => onSearchClick(search.term)}
                        >
                            {search.term} ({search.count})
                        </button>
                    ))}
                </div>
            </article>
        </section>
    );
};

export default TopSearchesBanner;