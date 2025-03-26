import Docteur from "../models/Docteur";
import Admin from "../models/Admin";

//Ajouter un docteur
export const createDocteur = async (req, res) => {
  try {
    const newDocteur = await Docteur.create({
      nom: req.body.nom,
      prenom: req.body.prenom,
      email: req.body.email,
      password: req.body.password,
      specialite: req.body.specialite,
    });
    res.status(201).json(newDocteur);
  } catch (error) {
    res.status(500).json({ message: "Error de la creatio" });
  }
};

//Récupérer tous les docteurs
export const getAllDocteurs = async (req, res) => {
  try {
    const docteurs = await Docteur.find();
    res.status(200).json(docteurs);
  } catch (error) {
    res.status(500).json({ message: "Error da l'affichage" });
  }
}

//Récupérer un docteur
export const getDocteur = async (req, res) => {
  try {
    const docteur = await Docteur.findById(req.params.id);
    if (!docteur) {
      return res.status(404).json({ message: "Docteur non trouvé" });
    }
    res.status(200).json(docteur);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
}
//Supprimer un docteur
export const deleteDocteur = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si le docteur existe
    const docteur = await Docteur.findById(id);
    if (!docteur) {
      return res.status(404).json({ message: "Docteur non trouvé" });
    }

    // Supprimer le docteur
    await docteur.remove();
    res.status(200).json({ message: "Docteur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
//Modifier un docteur
export const updateDocteur = async (req, res) => {
  try {
    const { id } = req.params;
    const docteur = await Docteur.findById(id);
    if (!docteur) {
      return res.status(404).json({ message: "Docteur non trouvé" });
    }
    const { nom, prenom, specialite, adresse, telephone, email } = req.body;
    if (nom) {
      docteur.nom = nom;
    }
    if (prenom) {
      docteur.prenom = prenom;
    }
    if (specialite) {
      docteur.specialite = specialite;
    }
    if (adresse) {
      docteur.adresse = adresse;
    }
    if (telephone) {
      docteur.telephone = telephone;
    }
    if (email) {
      docteur.email = email;
    }
    await docteur.save();
    res.status(200).json(docteur);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
}