import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import doctorRouter from './Routes/DocteurRoute.js'

dotenv.config();
const app = express();

// Connexion MongoDB
connectDB();



// Middlewares
app.use(cors());
app.use(express.json());

//Routes
app.use('/doctors', doctorRouter);


// Route de test
app.get('/', (req, res) => {
  res.send('Bienvenue sur l’API de prise de rendez-vous médical !');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur sur http://localhost:${PORT}`));
