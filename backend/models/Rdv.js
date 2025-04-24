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
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Docteur',
      required: true
    },
    nom: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    specialisation: {
      type: String,
      required: true
    }
  },
  patient: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true
    },
    nom: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

const Rdv = mongoose.model('Rdv', RdvSchema);

export default Rdv;