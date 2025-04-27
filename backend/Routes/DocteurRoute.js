import Docteur from "../models/Docteur.js";
import RDV from "../models/Rdv.js";
import Patient from "../models/Patient.js";
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

// Connexion d'un docteur
doctorRouter.post('/loginDoctor', async (req, res) => {
  try {
    const { email, password } = req.body;
    const docteur = await Docteur.findOne({ email });

    if (!docteur) {
      return res.status(404).json({ message: "Docteur non trouvé" });
    }

    const validPassword = await bcrypt.compare(password, docteur.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign(
      { 
        userId: docteur._id,
        role: 'doctor'
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      docteur: {
        id: docteur._id,
        nom: docteur.nom,
        prenom: docteur.prenom,
        email: docteur.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Ajouter un docteur
doctorRouter.post('/createDoctor', async (req, res) => {
  try {
    const docteurData = req.body;
    console.log("Données reçues:", docteurData);  // Ajout du log

    const docteur = await Docteur.findOne({ email: docteurData.email });

    if (docteur) {
      console.log("Docteur déjà existant :", docteur);
      return res.status(400).send("Le docteur existe déjà");
    }

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
    console.error("Erreur lors de la création:", error);
    res.status(500).json({ message: "Erreur lors de la création du docteur" });
  }
});
// Récupérer tous les docteurs
doctorRouter.get('/all', async (req, res) => {
  try {
    const docteurs = await Docteur.find({});
    res.status(200).json(docteurs);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ 
      message: "Erreur lors de la récupération des docteurs",
      error: error.message 
    });
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

    await Docteur.findByIdAndDelete(id); // Changed from remove() to findByIdAndDelete()
    res.status(200).json({ message: "Docteur supprimé avec succès" });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Ajouter ou mettre à jour les patients dans un docteur par email
doctorRouter.post('/updateDoctor', authenticateToken, async (req, res) => {
  try {
    const { email, $push } = req.body;

    const updatedDoctor = await Docteur.findOneAndUpdate(
      { email: email },
      { $push: { patients: $push.patients } }, 
      { new: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({ message: 'Docteur non trouvé' });
    }

    res.status(200).json(updatedDoctor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du docteur' });
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

doctorRouter.post('/getByEmail', authenticateToken, async (req, res) => {
  try {
    const { email } = req.body;
    const doctor = await Docteur.findOne({ email }).populate('specialite');
    if (!doctor) return res.status(404).json({ message: 'Docteur non trouvé' });
    res.json(doctor);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token manquant' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({ message: 'Token invalide' });
  }
}



export default doctorRouter;
