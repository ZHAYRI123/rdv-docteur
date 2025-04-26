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
  role: { type: String, default: "patient" },
  doctor: [
    {
      email: { type: String, required: true },
      status: {
        type: String,
        enum: ['consultation', 'pending', 'completed', 'cancelled'],
        default: 'consultation'
      },
      symptoms: { type: String, default: '' },
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      completionDate: { type: Date },
      feedback: { type: String, default: '' },
    },
  ],
  symptoms: { type: String, default: '' }

});

const Patient = mongoose.model('Patient', PatientSchema);

export default Patient;