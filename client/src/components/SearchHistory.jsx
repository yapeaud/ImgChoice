import React, { useEffect, useState } from 'react'
import axios from 'axios'
import '../styles/SearchHistory.css'

const SearchHistory = ({ onSearchClick }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await axios.get(`${apiUrl}/history`, {
                withCredentials: true,
            });
            // S'assurer que les données sont un tableau
            const historyData = Array.isArray(response.data) ? response.data : [];
            setHistory(historyData);
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'historique:', error);
            if (error.response?.status === 401) {
                alert('Session expirée. Veuillez vous reconnecter.');
                window.location.href = '/login';
            }
            // En cas d'erreur, définir un tableau vide
            setHistory([]);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'À l\'instant';
        if (minutes < 60) return `Il y a ${minutes} min`;
        if (hours < 24) return `Il y a ${hours} h`;
        if (days < 7) return `Il y a ${days} j`;
        return date.toLocaleString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
        });
    };

    if (loading) {
        return (
            <div className="search-history">
                <h3>Historique de recherche</h3>
                <p className="loading-text">Chargement...</p>
            </div>
        );
    }

    // Vérifier à nouveau que history est un tableau avant de l'utiliser
    if (!Array.isArray(history) || history.length === 0) {
        return (
            <div className="search-history">
                <h3>Historique de recherche</h3>
                <p className="empty-history">Aucune recherche récente</p>
            </div>
        );
    }

    return (
        <section className="search-history">
            <h3>📜 Historique de recherche</h3>
            <ul className="history-list">
                {history.map((item, index) => (
                    <li key={index} className="history-item">
                        <button
                            className="history-term-btn"
                            onClick={() => onSearchClick(item.term)}
                        >
                            {item.term}
                        </button>
                        <span className="history-timestamp">
                            {formatDate(item.timestamp)}
                        </span>
                    </li>
                ))}
            </ul>
        </section>
    )
}

export default SearchHistory