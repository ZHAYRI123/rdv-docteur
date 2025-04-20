import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Hopital from '../models/Hopital.js'; // adapte le chemin

dotenv.config();
const hopitalRouter = express.Router();
const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET non défini");
}

// Route de login hôpital
hopitalRouter.post('/loginHopital', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hopital = await Hopital.findOne({ email });

    if (!hopital) {
      return res.status(404).json({ message: "Hôpital non trouvé" });
    }

    const isMatch = await bcrypt.compare(password, hopital.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign(
      { userId: hopital._id, email: hopital.email, role: 'hopital' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, role: "hopital" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default hopitalRouter;