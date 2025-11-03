import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/imgchoice_db.js';

// Initialiser l'application Express
const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());
connectDB();// Connexion à la base de données

app.get('/', (req, res) => {
    res.send('API est en cours d\'execution')
})

app.listen(PORT, () => {
    console.log(`Serveur en cours d'execution sur le port http://localhost:${PORT}`)
})