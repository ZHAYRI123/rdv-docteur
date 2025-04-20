import Specialite from '../models/specialite.js';
import Docteur from '../models/Docteur.js';
import jwt from "jsonwebtoken";
import express from "express";

const specialiteRouter = express.Router();
const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  throw new Error("Le JWT_SECRET n'est pas défini dans les variables d'environnement");
}

// user c'est hopital
function authorizeHopital(req, res, next) {
  if (req.user.role !== 'hopital') {
    return res.status(403).json({ message: "Accès réservé aux hôpitaux" });
  }
  next();
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
//Ajouter une spécialité
specialiteRouter.post('/createSpecialite', authenticateToken, authorizeHopital, async (req, res) => {
  try {
    const newSpecialite = await Specialite.create({
      nom: req.body.nom,
      description: req.body.description,
    });
    res.status(201).json(newSpecialite);
  } catch (error) {
    res.status(500).json({ message: "Error de la creatio" });
  }
});

// Récupérer toutes les spécialités
specialiteRouter.post('/getAllSpecialites', authenticateToken, authorizeHopital, async (req, res) => {
  try {
    const specialites = await Specialite.find();
    res.status(200).json(specialites);
  } catch (error) {
    res.status(500).json({ message: "Error da l'affichage" });
  }
});

//récupérer une spécialité ET afficher les docteurs associés à cette spécialité
specialiteRouter.post('/getSpecialiteWithDocteurs', authenticateToken, authorizeHopital, async (req, res) => {
    try {
      const { id } = req.params;
  
      // Récupérer la spécialité
      const specialite = await Specialite.findById(id);
      if (!specialite) {
        return res.status(404).json({ message: "Spécialité non trouvée" });
      }
  
      // Récupérer tous les docteurs liés à cette spécialité
      const docteurs = await Docteur.find({ specialite: id });
  
      res.status(200).json({
        specialite,
        docteurs
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

//Supprimer une spécialité par son ID et ses docteurs
specialiteRouter.delete('/deleteSpecialite/:id', authenticateToken, authorizeHopital, async (req, res) => {
    try {
      const { id } = req.params;
  
      // Vérifier si la spécialité existe
      const specialite = await Specialite.findById(id);
      if (!specialite) {
        return res.status(404).json({ message: "Spécialité non trouvée" });
      }
  
      // Supprimer les docteurs associés à cette spécialité
      await Docteur.deleteMany({ specialite: id });
  
      // Supprimer la spécialité
      await Specialite.findByIdAndDelete(id);
  
      res.status(200).json({ message: "Spécialité et ses docteurs supprimés avec succès" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  export default specialiteRouter;