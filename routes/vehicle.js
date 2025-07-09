const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const jwt = require('jsonwebtoken');

// Middleware para verificar token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: "Token requerido"});
  jwt.verify(token.split(' ')[1], 'secret_key', (err, authData) => {
    if (err) return res.status(401).json({ error: "Token inválido"});
    req.authData = authData;
    next();
  });
};

// Guardar formulario
router.post('/add', verifyToken, async (req, res) => {
  const { marca, modelo, placa, color } = req.body;
  const vehicle = new Vehicle({
    marca,
    modelo,
    placa,
    color,
    userId: req.authData.id
  });
try {  
  await vehicle.save();
  res.status(201).json({message :"Vehiculo creado exitosamente"});
} catch (error) {
  // Manejo explícito del error de duplicado de MongoDB
  if (error.code === 11000 && error.keyPattern && error.keyPattern.placa === 1) {
    return res.status(400).json({ error: 'Placa del vehiculo ya existe' });
  }

  console.error('Error al crear usuario:', error.message);
  res.status(500).json({ error: 'Error al crear vehiculo a un conductor' });
}
  
});

module.exports = router;