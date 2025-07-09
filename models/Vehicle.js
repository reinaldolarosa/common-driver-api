const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  marca: {type: String, required: true},
  modelo: {type: String, required: true},
  placa: {type: String, required: true, unique: true},
  color: {type: String, required: true},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vehicle', VehicleSchema);