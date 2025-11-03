import mongoose from "mongoose";

// Modèle pour les utilisateurs authentifiés via des fournisseurs externes (OAuth).
const searchSchema = new mongoose.Schema({
    provider: {
        type: String,
        required: true,
        enum: ['google', 'github', 'facebook']
    },
    providerId: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,   
        unique: true,
        lowercase: true,
        trim: true
    },
    displayName: {
        type: String,
        required: true,
        trim: true, 
        lowercase: true
    },
}, { 
    timestamps: true
}); 

// Index unique pour garantir qu'un utilisateur ne peut s'inscrire qu'une seule fois par fournisseur.
searchSchema.index({ provider: 1, providerId: 1 }, { unique: true });

const User = mongoose.model('User', searchSchema);
export default User;