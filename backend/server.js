import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import doctorRouter from './Routes/DocteurRoute.js'
import patientRouter from './Routes/PatientRoute.js'
import emailRouter from './Routes/email.js'
import hopitalRouter from './Routes/hopitalRoute.js'
import specialiteRouter from './Routes/specialiteRoute.js'
import rdvRouter from './Routes/RdvRoute.js'

dotenv.config();
const app = express();

// Connexion MongoDB
connectDB();



// Middlewares
app.use(cors());
app.use(express.json());

//Routes
app.use('/doctor', doctorRouter);
app.use('/patient', patientRouter);
app.use('/email', emailRouter);
app.use('/hopital', hopitalRouter);
app.use('/specialite', specialiteRouter);
app.use('/rdv', rdvRouter);






// Route de test
app.get('/', (req, res) => {
  res.send('Bienvenue sur l’API de prise de rendez-vous médical !');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur sur http://localhost:${PORT}`));
