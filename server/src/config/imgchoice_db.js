import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI n'est pas défini dans les variables d'environnement");
        }
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB connecté: ${conn.connection.host}`);
    } catch (error) {
        console.error("❌ Erreur lors de la connexion à MongoDB:", error.message);
        process.exit(1); // 1 signifie un échec
    }
}; 