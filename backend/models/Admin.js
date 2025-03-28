const mongoose = require('mongoose');

const Schema = mongoose.Schema;

export const AdminSchema = new Schema({
  id: { type: String, required: true },
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model('Admin', AdminSchema);