import mongoose from 'mongoose';

const { Schema } = mongoose;


const PatientSchema = new Schema({
  id: { type: String, required: true },
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true },
  telephone: { type: Number, required: true },
  password: { type: String, required: true },
  dateNaissance: { type: Date, required: true },
  sexe: { type: String, required: true },
  role: { type: String, default: "patient" }
});

const Patient = mongoose.model('Patient', PatientSchema);

export default Patient;