import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Hopital from './models/Hopital.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("MONGO_URI n'est pas défini dans .env");
}

mongoose.connect(MONGO_URI)
  .then(() => console.log("Connexion à MongoDB réussie"))
  .catch(err => console.error("Erreur de connexion MongoDB :", err));

const run = async () => {
  try {
    const hashedPassword = await bcrypt.hash("motdepasse123", 10);

    const hopital = new Hopital({
      nom: "Basmah",
      email: "basmahbouch@gmail.com",
      password: hashedPassword,
      role: "hopital",
      telephone: 123456789,
      Adresse: "Fes"

    });

    await hopital.save();
    console.log("Hôpital créé avec succès !");
  } catch (err) {
    console.error("Erreur lors de la création :", err.message);
  } finally {
    mongoose.disconnect();
  }
};

run();