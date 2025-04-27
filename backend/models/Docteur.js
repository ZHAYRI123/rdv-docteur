import mongoose from 'mongoose';

const { Schema } = mongoose;

const docteurSchema = new Schema({
	nom: { type: String, required: true },
	prenom: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	telephone: { type: String, required: true },
	photo: { type: String }, // URL de la photo
	specialite: { 
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'Specialite', //Référence de la collection des spécialités
		required: true 
	  },
	disponibilites: [{ 
		date: String, 
		heure: String 
	}],
	role: { type: String, default: 'docteur' },
	patients: [
		{
			email: { type: String, required: true },
			status: { type: String, required: true },
			symptoms: { type: String, default: '' },
			id: {
				type: mongoose.Schema.Types.ObjectId,
				required: true,
			},
			completionDate: { type: Date },
			feedback: { type: String, default: '' },
		},
	],
	});



const Docteur = mongoose.model('Docteur', docteurSchema);

export default Docteur;