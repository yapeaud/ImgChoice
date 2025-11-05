import express from 'express';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import 'dotenv/config';

// Import DB connection
import { connectDB } from './config/imgchoice_db.js';

// Import routes
import authRoutes from './routes/authRoute.route.js';
import searchRoutes from './routes/searchRoute.route.js';
import topSearchesRoute from './routes/topSearchesRoute.route.js';
import historyRoute from './routes/historyRoute.route.js';

// Import passport configuration - CET IMPORT DOIT ÊTRE APRÈS passport
import './config/passport.js';

// Initialiser l'application Express
const app = express();
const PORT = process.env.PORT || 3000;

// Vérification des variables d'environnement critiques
if (!process.env.SESSION_SECRET) {
    console.warn('⚠️ SESSION_SECRET non défini - la sécurité des sessions peut être compromise');
}

if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI non défini - la connexion à la base de données échouera');
}

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5175',
    credentials: true
}));
app.use(express.json());

// Connexion à la base de données
connectDB();

// Session configuration - DOIT ÊTRE AVANT passport.initialize()
app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    } 
}));

// Passport Middleware - CET ORDRE EST CRUCIAL
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/top-searches', topSearchesRoute);
app.use('/api/history', historyRoute);

// Route de test
app.get('/', (req, res) => {
    res.send('API est en cours d\'exécution');
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port http://localhost:${PORT}`);
});