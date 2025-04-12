import Specialite from '../models/specialite';
import Docteur from '../models/Docteur';

//Ajouter une spécialité
export const createSpecialite = async (req, res) => {
  try {
    const newSpecialite = await Specialite.create({
      nom: req.body.nom,
      description: req.body.description,
    });
    res.status(201).json(newSpecialite);
  } catch (error) {
    res.status(500).json({ message: "Error de la creatio" });
  }
};

// Récupérer toutes les spécialités
export const getAllSpecialites = async (req, res) => {
  try {
    const specialites = await Specialite.find();
    res.status(200).json(specialites);
  } catch (error) {
    res.status(500).json({ message: "Error da l'affichage" });
  }
};

//récupérer une spécialité ET afficher les docteurs associés à cette spécialité
export const getSpecialiteWithDocteurs = async (req, res) => {
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
  };

//Supprimer une spécialité par son ID et ses docteurs
export const deleteSpecialite = async (req, res) => {
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
  };
  
