import React, { useState } from 'react'
import '../styles/SearchForm.css'

// Composant pour le formulaire de recherche d'images
const SearchForm = ({onSearch, loading}) => {
    const [term, setTerm] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (term.trim() && !loading) {
            onSearch(term)
        }
    };

    return (
        <form className="search-form" onSubmit={handleSubmit}>
            <article className='search-input-container'>
                <input
                    type="text"
                    placeholder="Rechercher des images..."
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    disabled={loading}
                    className="search-input"
                />
                <button 
                    type="submit" 
                    disabled={loading || !term.trim()}  
                    className="search-btn">
                    {loading ? '⏳' : '🔍'}
                </button>
            </article>
        </form>
    )
}

export default SearchForm;