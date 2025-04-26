import express from "express";
import Patient from "../models/Patient.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const patientRouter = express.Router();
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

// Middleware d'authentification
function authenticateToken(req, res, next) {
	const token = req.headers['authorization'];

	if (!token) {
		return res.status(401).send('Token non fourni');
	}

	const tokenParts = token.split(' ');
	const jwtToken = tokenParts[1];

	jwt.verify(jwtToken, JWT_SECRET, (err, decoded) => {
		if (err) {
			return res.status(403).send('Token invalide');
		}
		req.user = decoded;
		next();
	});
}

// Connexion d’un patient
patientRouter.post('/loginPatient', async (req, res) => {
	try {
		const { email, password } = req.body;
		const patient = await Patient.findOne({ email: email });
		if (!patient) {
			return res.status(404).send("Aucun compte trouvé avec cette adresse email. Veuillez vous inscrire !");
		}

		const isPasswordCorrect = await bcrypt.compare(password, patient.password);
		if (!isPasswordCorrect) {
			return res.status(400).send("Mot de passe incorrect");
		}

		const token = generateToken(patient, 'patient');
		return res.json({ token, role: "patient"  });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Erreur interne du serveur" });
	}
});

// Inscription d’un patient
patientRouter.post('/addPatient', async (req, res) => {
	try {
		const patientData = req.body;
		const patientExists = await Patient.findOne({ email: patientData.email });
		if (patientExists) {
			return res.status(400).send("Cet email est déjà utilisé");
		}

		const hashedPassword = await bcrypt.hash(patientData.password, 10);
		const newPatient = new Patient({
			...patientData,
			password: hashedPassword,
			
		});

		await newPatient.save();

		const token = generateToken(newPatient, 'patient');
		return res.json({ token });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Erreur interne du serveur" });
	}
});

patientRouter.post('/getByEmail', authenticateToken, async (req, res) => {
	try {
		const { email } = req.body;
		const patient = await Patient.findOne({ email });
		if (!patient) return res.status(404).json({ message: 'Patient not found' });
		return res.json({
			nom: patient.nom,
			prenom: patient.prenom,
			email: patient.email,
			telephone: patient.telephone,
			dateNaissance: patient.dateNaissance,
			sexe: patient.sexe
		  });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Internal server error' });
	}
});

// Récupérer tous les patients
patientRouter.get('/getAllPatients', async (req, res) => {
	try {
		const patients = await Patient.find();
		res.status(200).json(patients);
	} catch (error) {
		res.status(500).json({ message: "Erreur lors de la récupération des patients" });
	}
});


// Récupérer un patient par ID
patientRouter.get('/getPatient/:id', async (req, res) => {
	try {
		const patient = await Patient.findById(req.params.id);
		if (!patient) {
			return res.status(404).json({ message: "Patient non trouvé" });
		}
		res.status(200).json(patient);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Supprimer un patient
patientRouter.delete('/deletePatient/:id', async (req, res) => {
	try {
		await Patient.findByIdAndDelete(req.params.id);
		res.status(200).json({ message: "Patient supprimé avec succès" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Modifier un patient
patientRouter.put('/updatePatient', authenticateToken, async (req, res) => {
  try {
    const { email, $push } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email requis' });
    }

    const patient = await Patient.findOneAndUpdate(
      { email },
      { $push },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }

    res.status(200).json(patient);
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour du patient',
      error: error.message 
    });
  }
});

export default patientRouter;