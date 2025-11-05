import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    provider: {
        type: String,
        required: true,
        enum: ['google', 'github', 'facebook']
    },
    providerId: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    displayName: {
        type: String,
        required: true,
        trim: true
    },
    avatar: {
        type: String, // Ajouter un champ pour l'avatar
        default: null
    }
}, {
    timestamps: true
});

// Index unique composite pour garantir qu'un utilisateur ne peut s'inscrire qu'une seule fois par fournisseur
userSchema.index({ provider: 1, providerId: 1 }, { unique: true });

// Index unique pour l'email (mais attention, un email pourrait être utilisé avec différents providers)
userSchema.index({ email: 1 }, { unique: false }); // Rendre non unique si un email peut être utilisé avec plusieurs providers

const User = mongoose.model('User', userSchema);
export default User;