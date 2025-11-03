import express from "express";
import searchModel from "../models/searchModel";

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
            .select('term timestamp')
            .lean();

        //Grouper par terme et garder le dernier timestamp
        const groupedHistory = history.reduce((acc, search) => {
            const existing = acc.find(item => item.term === search.term);
            if (existing) {
                if (new Date(search.timestamp) > new Date(existing.timestamp)) {
                    existing.timestamp = search.timestamp;
                }
            } else {
                acc.push({
                    term: search.term,
                    timestamp: search.timestamp
                });
            }
            return acc;
        }, []);

        res.status(200).json({
            success: true,
            history: groupedHistory
        })
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'historique:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'historique' });
    }
});

export default historyRouter;