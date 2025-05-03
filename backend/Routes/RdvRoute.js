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
    const { docteurId, patientEmail, date, heure, symptoms } = req.body;

    // Find patient by email
    const patient = await Patient.findOne({ email: patientEmail });
    if (!patient) {
      return res.status(404).json({ message: "Patient non trouvé" });
    }

    // Check for existing appointment
    const existingAppointment = await Rdv.findOne({
      docteur: docteurId,
      patient: patient._id,
      status: 'pending'
    });

    if (existingAppointment) {
      return res.status(400).json({ 
        message: "Vous avez déjà un rendez-vous en attente avec ce médecin" 
      });
    }

    const newRdv = new Rdv({
      date: new Date(date),
      heure,
      docteur: docteurId,
      patient: patient._id,
      symptoms,
      status: 'pending'
    });

    await newRdv.save();

    const populatedRdv = await Rdv.findById(newRdv._id)
      .populate('patient', 'nom prenom email')
      .populate('docteur', 'nom prenom specialite');

    res.status(201).json(populatedRdv);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ 
      message: "Erreur lors de la création du rendez-vous",
      error: error.message 
    });
  }
});

// 2. Récupérer tous les rendez-vous
rdvRouter.get('/getAllRdv', authenticateToken, async (req, res) => {
  try {
    const rdvs = await Rdv.find()
      .populate('patient', 'nom prenom email')
      .populate({
        path: 'docteur',
        populate: {
          path: 'specialite',
          select: 'nom'
        }
      })
      .sort({ date: 1, heure: 1 });

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

// Add this route after your existing routes
rdvRouter.put('/updateStatus/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, doctorId, completionDate } = req.body;

    const appointment = await Rdv.findOne({ 
      _id: id,
      docteur: doctorId 
    });

    if (!appointment) {
      return res.status(404).json({ 
        message: "Rendez-vous non trouvé ou vous n'êtes pas autorisé à le modifier" 
      });
    }

    appointment.status = status;
    if (status === 'completed') {
      appointment.completionDate = completionDate;
    }
    await appointment.save();

    const updatedAppointment = await Rdv.findById(id)
      .populate('patient', 'nom prenom email')
      .populate('docteur', 'nom prenom specialite');

    res.json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ 
      message: "Erreur lors de la mise à jour du rendez-vous",
      error: error.message 
    });
  }
});

export default rdvRouter;