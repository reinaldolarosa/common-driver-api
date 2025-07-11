const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  brand: {type: String, required: true},
  model: {type: String, required: true},
  placa: {type: String, required: true, unique: true},
  color: {type: String, required: true},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: {type:String, required:true},
  numberOfSeats: {type:Number,required:true},
  numberOfSuitcases: {type:Number,required:true}, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vehicle', VehicleSchema);