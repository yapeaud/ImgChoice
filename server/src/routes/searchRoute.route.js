import express from 'express';
import axios from 'axios';
import searchModel from '../models/searchModel.js';

const searchRouter = express.Router();

// Middleware pour vérifier l'authentification
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: "Non authentifié" });
};

// Route POST /api/search
searchRouter.post('/', isAuthenticated, async (req, res) => {
    try {
        const { term } = req.body;

        if (!term || term.trim() === "") {
            return res.status(400).json({ error: 'Le terme de recherche est requis.' });
        }

        if (!process.env.UNSPLASH_ACCESS_KEY) {
            return res.status(500).json({ error: 'Configuration API Unsplash manquante' });
        }

        //Enregistrement de la recherche dans la base de données MongoDB
        const newSearch = new searchModel({
            term: term.trim().toLowerCase(),
            UserId: req.user._id
        });
        await newSearch.save();

        //Appeler l'API Unsplash
        const unsplashResponse = await axios.get('https://api.unsplash.com/search/photos', {
            params: {
                query: term,
                per_page: 20,
                client_id: process.env.UNSPLASH_ACCESS_KEY
            }
        });

        const images = unsplashResponse.data.results.map(img => ({
            id: img.id,
            url: img.urls.small,
            thumbnail: img.urls.thumb,
            small: img.urls.small,
            description: img.description || img.alt_description || '',
            author: img.user.name,
            authorUrl: img.user.links.html
        }));
        res.status(200).json({
            term: term,
            count: images.length,
            images: images,
            searchId: newSearch._id
        });
    } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        if (error.response?.status === 401 || error.response?.status === 403) {
            return res.status(401).json({ error: 'Clé API Unsplash invalide ou expirée' });
        }
        if (error.response?.status === 429) {
            return res.status(429).json({ error: 'Limite de requêtes API dépassée. Veuillez réessayer plus tard.' });
        }
        res.status(500).json({ error: 'Erreur lors de la recherche d\'images' });
    }
});

export default searchRouter;