import Docteur from "../models/Docteur.js";
import Patient from "../models/Patient.js";
import Rdv from "../models/Rdv.js";
import jwt from "jsonwebtoken";
import express from "express";

const rdvRouter = express.Router();
const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  throw new Error("Le JWT_SECRET n'est pas défini dans les variables d'environnement");
}

// Middleware pour authentifier le token JWT
function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).send("Token non fourni");
  }

  const tokenParts = token.split(' ');
  const jwtToken = tokenParts[1];

  jwt.verify(jwtToken, JWT_SECRET, (err, decoded) => {
     if (err) {
      return res.status(403).send("Token invalide");
    }
    req.user = decoded;
    next();
  });
}

// 1. Ajouter un rendez-vous
rdvRouter.post('/addRdv', authenticateToken, async (req, res) => {
  try {
    const newRdv = await Rdv.create({
      date: req.body.date,
      heure: req.body.heure,
      docteur: req.body.docteur,
      patient: req.body.patient,
    });
    res.status(201).json(newRdv);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création du rendez-vous" });
  }
});

// 2. Récupérer tous les rendez-vous
rdvRouter.post('/getAllRdv', authenticateToken, async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email requis" });
    }

    const rdvs = await Rdv.find({
      'patient.email': email,
      status: { $ne: 'cancelled' } // Exclure les RDV annulés
    }).sort({ date: 1, heure: 1 }); // Trier par date et heure

    // Si aucun RDV trouvé, renvoyer un tableau vide
    if (!rdvs || rdvs.length === 0) {
      return res.status(200).json([]); // Changed from 404 to 200 with empty array
    }

    res.status(200).json(rdvs);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ 
      message: "Erreur lors de la récupération des rendez-vous",
      error: error.message 
    });
  }
});

// 3. Récupérer un rendez-vous par ID avec info patient + docteur
rdvRouter.get('/getRdv/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const rdv = await Rdv.findById(id);
    if (!rdv) return res.status(404).json({ message: "Rendez-vous non trouvé" });

    const patient = await Patient.findById(rdv.patient);
    const docteur = await Docteur.findById(rdv.docteur);

    res.status(200).json({ rdv, patient, docteur });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//  4. Supprimer un rendez-vous
rdvRouter.delete('/deleteRdv/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const rdv = await Rdv.findByIdAndDelete(id);
    if (!rdv) return res.status(404).json({ message: "Rendez-vous non trouvé" });
    res.status(200).json({ message: "Rendez-vous supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 5. Modifier un rendez-vous
rdvRouter.put('/updateRdv/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const rdv = await Rdv.findById(id);
    if (!rdv) return res.status(404).json({ message: "Rendez-vous non trouvé" });

    const { date, heure, patient, docteur } = req.body;
    if (date) rdv.date = date;
    if (heure) rdv.heure = heure;
    if (patient) rdv.patient = patient;
    if (docteur) rdv.docteur = docteur;

    await rdv.save();
    res.status(200).json(rdv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default rdvRouter;