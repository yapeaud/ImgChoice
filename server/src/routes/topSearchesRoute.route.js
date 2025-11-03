import express from 'express';
import searchModel from '../models/searchModel.js';

const topSearchesRouter = express.Router();

// Route GET /api/top-searches
topSearchesRouter.get('/', async (req, res) => {
    try {
        //Agréger les 5 termes de recherche les plus fréquents
        const topSearches = await searchModel.aggregate([
            {
                $group: {
                    _id: '$term',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            },
            { 
                $limit: 5 
            },
            {
                $project: {
                    _id: 0,
                    term: '$_id',
                    count: 1
                }
            }
        ]);

        res.status(200).json(topSearches);
    } catch (error) {
        console.error('Erreur lors de la récupération des recherches populaires:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des recherches populaires' });
    }
});
export default topSearchesRouter;