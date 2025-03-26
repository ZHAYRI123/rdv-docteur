import Patient from "../models/Patient.js";
import Admin from "../models/Admin.js";

//Ajouter un patient
export const addPatient = async (req, res) => {
  try {
    const newPatient = await Patient.create({
      nom: req.body.nom,
      prenom: req.body.prenom,
      email: req.body.email,
      password: req.body.password,
    });
    res.status(201).json(newPatient);
  } catch (error) {
    res.status(500).json({ message: "Error de la creatio" });
  }
}
//Afficher tous les patients
export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: "Error da l'affichage" });
  }
}
//Afficher un patient
export const getPatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient non trouvé" });
    }
    res.status(200).json(patient);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
}
//Supprimer un patient
export const deletePatient = async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Patient supprimé avec succès" });
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
}
//Modifier un patient
export const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!patient) {
      return res.status(404).json({ message: "Patient non trouvé" });
    }
    res.status(200).json(patient);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
}