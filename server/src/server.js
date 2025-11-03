import express from 'express';
import cors from 'cors';
import passport from 'passport';
import './config/passport.js'; // Configuration de Passport
import 'dotenv/config';
import { connectDB } from './config/imgchoice_db.js';
import session from 'express-session';
import authRoutes from './routes/authRoute.route.js';
import searchRoutes from './routes/searchRoute.route.js';
import topSearchesRoute from './routes/topSearchesRoute.route.js';
import historyRoute from './routes/historyRoute.route.js';


// Initialiser l'application Express
const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors({
    origin: 'http://localhost:5175', // L'URL de votre frontend
    credentials: true
}));
app.use(express.json());
connectDB();// Connexion à la base de données

//Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 heures
    } 
}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/top-searches', topSearchesRoute);
app.use('/api/history', historyRoute);


//Route de test
app.get('/', (req, res) => {
    res.send('API est en cours d\'execution')
})

app.listen(PORT, () => {
    console.log(`Serveur en cours d'execution sur le port http://localhost:${PORT}`)
})