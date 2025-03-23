const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const specialiteSchema = new Schema({
    nom: { type: String, required: true, unique: true },
    description: { type: String },
    });
module.exports = mongoose.model('Specialite', specialiteSchema);