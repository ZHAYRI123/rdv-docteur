const mongoose = require('mongoose');

const Schema = mongoose.Schema;


export const PatientSchema = new Schema({
  id: { type: Number, required: true },
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true },
  telephone: { type: Number, required: true },
  password: { type: String, required: true },
  date_naissance: { type: Date, required: true },
  sexe: { type: String, required: true },
});

module.exports = mongoose.model('Patient', PatientSchema);