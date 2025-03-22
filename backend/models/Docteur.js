const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const docteurSchema = new Schema({
	nom: { type: String, required: true },
	prenom: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	telephone: { type: String, required: true },
	password: { type: String, required: true },
	specialite: { type: String, required: true },
	photo: { type: String }, // URL de la photo
	});
module.exports = Docteur: mongoose.model('Docteur', docteurSchema);

