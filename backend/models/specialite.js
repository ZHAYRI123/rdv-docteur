import mongoose from 'mongoose';

const { Schema } = mongoose;

const specialiteSchema = new Schema({
  nom: { type: String, required: true, unique: true },
  description: { type: String },
});

export default mongoose.model('Specialite', specialiteSchema);
