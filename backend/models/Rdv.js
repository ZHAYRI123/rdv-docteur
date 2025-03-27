const mongoose = require('mongoose');

const Schema = mongoose.Schema;
import Patient from './Patient.js';
import Docteur from './Docteur.js';

export const RdvSchema = new Schema({
  id: { type: String, required: true },
  date: { type: Date, required: true },
  heure: { type: String, required: true },
  patient_id: { type: Patient, required: true },
  docteur_id: { type: Docteur, required: true }
});

modules.exports = mongoose.model('Rdv', RdvSchema);