import Docteur from "../models/Docteur.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import express from "express";

const doctorRouter = express.Router();
const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  throw new Error("Le JWT_SECRET n'est pas défini dans les variables d'environnement");
}

// Générer un token JWT
function generateToken(user, role) {
  return jwt.sign(
    { userId: user._id, email: user.email, role: role },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
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

// Connexion d'un docteur
doctorRouter.post('/loginDoctor', async (req, res) => {
  try {
    const { email, password } = req.body;
    const docteur = await Docteur.findOne({ email: email });

    if (!docteur) return res.status(404).send("Aucun compte trouvé avec cette adresse e-mail. Veuillez vous inscrire !");

    const isPasswordCorrect = await bcrypt.compare(password, docteur.password);
    if (!isPasswordCorrect) return res.status(400).send("Mot de passe incorrect");

    const token = generateToken(docteur, 'doctor');
    return res.json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
});

// Ajouter un docteur
doctorRouter.post('/createDoctor', async (req, res) => {
  try {
    const docteurData = req.body;
    const docteur = await Docteur.findOne({ email: docteurData.email });

    if (docteur) return res.status(400).send("Le docteur existe déjà");

    const password = docteurData.password;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newDocteurData = {
      ...docteurData,
      password: hashedPassword,
    };

    const newDocteur = new Docteur(newDocteurData);
    await newDocteur.save();

    const token = generateToken(newDocteur, 'doctor');
    return res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création du docteur" });
  }
});

// Récupérer tous les docteurs
doctorRouter.get('/all', async (req, res) => {
  try {
    const docteurs = await Docteur.find();
    res.status(200).json(docteurs);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'affichage des docteurs" });
  }
});

// Récupérer un docteur par ID
doctorRouter.get('/:id', async (req, res) => {
  try {
    const docteur = await Docteur.findById(req.params.id);
    if (!docteur) {
      return res.status(404).json({ message: "Docteur non trouvé" });
    }
    res.status(200).json(docteur);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Supprimer un docteur par ID
doctorRouter.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const docteur = await Docteur.findById(id);

    if (!docteur) {
      return res.status(404).json({ message: "Docteur non trouvé" });
    }

    await docteur.remove();
    res.status(200).json({ message: "Docteur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mettre à jour les informations d'un docteur
doctorRouter.put('/updateDoctor/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const docteur = await Docteur.findById(id);

    if (!docteur) {
      return res.status(404).json({ message: "Docteur non trouvé" });
    }

    const { nom, prenom, specialite, adresse, telephone, email } = req.body;

    if (nom) docteur.nom = nom;
    if (prenom) docteur.prenom = prenom;
    if (specialite) docteur.specialite = specialite;
    if (adresse) docteur.adresse = adresse;
    if (telephone) docteur.telephone = telephone;
    if (email) docteur.email = email;

    await docteur.save();
    res.status(200).json(docteur);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default doctorRouter;
