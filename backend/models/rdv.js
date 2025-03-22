const mongoose = require('mongoose');

const Schema = mongoose.Schema;
import { patientSchema } from './patient.js';

export const rdvSchema = new Schema({
  id: { type: Number, required: true },
  date: { type: Date, required: true },
  heure: { type: String, required: true },
  patient_id: { type: patientSchema, required: true },
});