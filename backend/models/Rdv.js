const mongoose = require('mongoose');

const Schema = mongoose.Schema;
import { PatientSchema } from './Patient.js';

export const RdvSchema = new Schema({
  id: { type: Number, required: true },
  date: { type: Date, required: true },
  heure: { type: String, required: true },
  patient_id: { type: PatientSchema, required: true },
});

modules.exports = mongoose.model('Rdv', RdvSchema);