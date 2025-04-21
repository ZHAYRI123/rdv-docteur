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

    if (!docteur) return res.status(404).send("Aucun compte trouvé avec cette adresse e-mail. Veuillez demandez a l'administration de vous ajouter!");

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
    const doctor = await Docteur.findOne({ email }); // Changer Doctor en Docteur
    if (!doctor) return res.status(404).json({ message: 'Docteur non trouvé' });
    res.json(doctor);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

// Add this route for getting doctor's patients
doctorRouter.get('/patients', authenticateToken, async (req, res) => {
  try {
    // 
    const appointments = await RDV.find({ docteur: req.user.userId })
      .distinct('patient');
    
    // Get patient details
    const patients = await Patient.find({ _id: { $in: appointments } });
    res.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ message: "Erreur lors de la récupération des patients" });
  }
});

// 
doctorRouter.get('/appointments', authenticateToken, async (req, res) => {
  try {
    const appointments = await RDV.find({ docteur: req.user.userId })
      .populate('patient', 'nom prenom')
      .sort({ date: 1, heure: 1 });
    
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: "Erreur lors de la récupération des rendez-vous" });
  }
});


doctorRouter.get('/me', authenticateToken, async (req, res) => {
  try {
    console.log('User ID:', req.user.userId); // Add debug log
    const docteur = await Docteur.findById(req.user.userId);
    if (!docteur) {
      return res.status(404).json({ message: "Docteur non trouvé" });
    }
    res.json({ 
      nom: docteur.nom,
      prenom: docteur.prenom
    });
  } catch (error) {
    console.error('Error fetching doctor info:', error);
    res.status(500).json({ message: "Erreur lors de la récupération des informations" });
  }
});

// Update appointment status
doctorRouter.put('/appointments/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await RDV.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Rendez-vous non trouvé" });
    }

    res.json(appointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ message: "Erreur lors de la mise à jour du rendez-vous" });
  }
});


export default doctorRouter;
