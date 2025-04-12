import mongoose from 'mongoose';

const { Schema } = mongoose;

const hopitalSchema = new Schema({
    nom: { type: String, required: true },
    Adresse: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telephone: { type: String, required: true },
    password: { type: String, required: true },
    photo: { type: String }, // URL de la photo
    });

const Hopital = mongoose.model('Hopital', hopitalSchema);

export default Hopital;