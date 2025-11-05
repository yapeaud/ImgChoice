import express from "express";
import searchModel from "../models/searchModel.js";

const historyRouter = express.Router();

// Middleware pour vérifier l'authentification
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: "Non authentifié" });
};

// Route GET /api/history
historyRouter.get("/", isAuthenticated, async (req, res) => {
    try {
        // Récupérer l'historique des recherches de l'utilisateur authentifié
        const history = await searchModel.find({ UserId: req.user._id })
            .sort({ createdAt: -1 })
            .limit(50)
            .select('term createdAt')
            .lean();

        //Grouper par terme et garder le dernier timestamp
        const groupedHistory = history.reduce((acc, search) => {
            const existing = acc.find(item => item.term === search.term);
            const searchTimestamp = search.createdAt;
            if (existing) {
                const existingTimestamp = existing.timestamp;
                if (new Date(searchTimestamp) > new Date(existingTimestamp)) {
                    existing.timestamp = searchTimestamp;
                }
            } else {
                acc.push({
                    term: search.term,
                    timestamp: searchTimestamp
                });
            }
            return acc;
        }, []);

        res.status(200).json({
            success: true,
            history: groupedHistory
        });
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'historique:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'historique' });
    }
});

export default historyRouter;