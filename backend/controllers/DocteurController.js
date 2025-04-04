import Docteur from "../models/Docteur";
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
//loginDoctor
export const loginDoctor = async (req, res) => {
  try {
		const { email, password } = req.body;
		const docteur = await Docteur.findOne({ email: email });
		if (!docteur) return res.status(404).send('No account found with this email address. Please sign up!');
		const isPasswordCorrect = await bcrypt.compare(password, docteur.password);
		if (!isPasswordCorrect) return res.status(400).send('Incorrect password');

		const token = generateToken(docteur, 'doctor');
		return res.json({ token });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Internal server error' });
	}
}


//Ajouter un docteur
export const createDocteur = async (req, res) => {
  try {
    const docteurData = req.body;
		const docteur = await Doctor.findOne({ email: docteurData.email });
		if (docteur) return res.status(400).send('Doctor already exists');

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