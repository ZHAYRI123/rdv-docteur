import Patient from "../models/Patient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}

function generateToken(user, role) {
	return jwt.sign({ userId: user._id, email: user.email, role: role }, JWT_SECRET, { expiresIn: '1h' });
}

function authenticateToken(req, res, next) {
	const token = req.headers['authorization'];

	if (!token) {
		return res.status(401).send('Token not provided');
	}

	const tokenParts = token.split(' ');
	const jwtToken = tokenParts[1];

	jwt.verify(jwtToken, JWT_SECRET, (err, decoded) => {
		if (err) {
			return res.status(403).send('Invalid token');
		}
		req.user = decoded;
		next();
	});
}

export const loginPatient = async (req, res) => {
  try {
		const { email, password } = req.body;
		const patient = await Patient.findOne({ email: email });
		if (!patient) return res.status(404).send('No account found with this email address. Please sign up!');
		const isPasswordCorrect = await bcrypt.compare(password, patient.password);
		if (!isPasswordCorrect) return res.status(400).send('Incorrect password');

		const token = generateToken(patient, 'patient');
		return res.json({ token });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Internal server error' });
	}
}

//Ajouter un patient
export const addPatient = async (req, res) => {
  try {
		const patientData = req.body;
		const patient = await Patient.findOne({ email: patientData.email });
		if (patient) return res.status(400).send('Email déjà utilisé');

		const password = patientData.password;
		const hashedPassword = await bcrypt.hash(password, 10);
		const newPatientData = {
			...patientData,
			password: hashedPassword,
		};
		const newPatient = new Patient(newPatientData);
		await newPatient.save();

		const token = generateToken(newPatient, 'patient');
		return res.json({ token });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Internal server error' });
	}
}
//Afficher tous les patients
export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des patients" });
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
	  if (req.body.password) {
		req.body.password = await bcrypt.hash(req.body.password, 10);
	  }
	  const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
	  if (!patient) {
		return res.status(404).json({ message: "Patient non trouvé" });
	  }
	  res.status(200).json(patient);
	} catch (error) {
	  res.status(500).json({ message: error.message });
	}
  };