import mongoose from 'mongoose';

const { Schema } = mongoose;

const RdvSchema = new Schema({
  date: {
    type: Date,
    required: true
  },
  heure: {
    type: String,
    required: true
  },
  docteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Docteur',
    required: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  symptoms: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

const Rdv = mongoose.model('Rdv', RdvSchema);

export default Rdv;