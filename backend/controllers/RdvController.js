import Docteur from "../models/Docteur";
import Patient from "../models/Patient";
import Rdv from "../models/Rdv";

//Ajouter un rendez-vous
export const addRdv = async (req, res) => {
  try {
    const newRdv = await Rdv.create({
      date: req.body.date,
      heure: req.body.heure,
      docteur: req.body.docteur,
      patient: req.body.patient,
    });
    res.status(201).json(newRdv);
  } catch (error) {
    res.status(500).json({ message: "Error de la creatio" });
  }
}
//Afficher tous les rendez-vous
export const getAllRdv = async (req, res) => {
  try {
    const rdvs = await Rdv.find();
    res.status(200).json(rdvs);
  } catch (error) {
    res.status(500).json({ message: "Error da l'affichage" });
  }
}
//Afficher un rendez-vous et les informations du patient et du docteur
export const getRdv = async (req, res) => {
  try {
    const { id } = req.params;

    // Récupérer le rendez-vous
    const rdv = await Rdv.findById(id);
    if (!rdv) {
      return res.status(404).json({ message: "Rendez-vous non trouvé" });
    }

    // Récupérer le patient lié à ce rendez-vous
    const patient = await Patient.findById(rdv.patient);

    // Récupérer le docteur lié à ce rendez-vous
    const docteur = await Docteur.findById(rdv.docteur);

    res.status(200).json({
      rdv,
      patient,
      docteur
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
//Supprimer un rendez-vous
export const deleteRdv = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si le rendez-vous existe
    const rdv = await Rdv.findById(id);
    if (!rdv) {
      return res.status(404).json({ message: "Rendez-vous non trouvé" });
    }

    await Rdv.findByIdAndDelete(id);

    res.status(200).json({ message: "Rendez-vous supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
//Modifier un rendez-vous
export const updateRdv = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, heure, patient, docteur } = req.body;
    // Vérifier si le rendez-vous existe
    const rdv = await Rdv.findById(id);
    if (!rdv) {
      return res.status(404).json({ message: "Rendez-vous non trouvé" });
    }
    if (date) {
      rdv.date = date;
    }
    if (heure) {
      rdv.heure = heure;
    }
    if (patient) {
      rdv.patient = patient;
    }
    if (docteur) {
      rdv.docteur = docteur;
    }
    await rdv.save();
    res.status(200).json(rdv);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
}