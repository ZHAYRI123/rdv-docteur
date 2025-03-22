const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const patientSchema = new Schema({
  id: { type: Number, required: true },
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true },
  telephone: { type: Number, required: true },
  password: { type: String, required: true },
  date_naissance: { type: Date, required: true },
  sexe: { type: String, required: true },
});

const rdvSchema = new Schema({
  id: { type: Number, required: true },
  date: { type: Date, required: true },
  heure: { type: String, required: true },
  patient_id: { type: patientSchema, required: true },
});

const AdminSchema = new Schema({
  id: { type: Number, required: true },
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});