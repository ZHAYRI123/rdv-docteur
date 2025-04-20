import mongoose from 'mongoose';

const { Schema } = mongoose;

const RdvSchema = new Schema({
  id: { type: String, required: true },
  date: { type: Date, required: true },
  heure: { type: String, required: true },
  patient_id: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  docteur_id: { type: Schema.Types.ObjectId, ref: 'Docteur', required: true }
});

const Rdv = mongoose.model('Rdv', RdvSchema);
export default Rdv;