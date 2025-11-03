import mongoose from 'mongoose';

// Modèle pour stocker les termes de recherche des utilisateurs.
const searchSchema = new mongoose.Schema({
    UserId:{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },
    term: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    }
}, { 
    timestamps: true
});

// Créer un index composé pour optimiser les requêtes de recherche par identifiant utilisateur et terme.
searchSchema.index({ UserId: 1, term: 1 });

const searchModel = mongoose.model('Search', searchSchema);
export default searchModel;