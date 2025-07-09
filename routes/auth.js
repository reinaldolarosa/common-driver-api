
const path = require('path');
const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Registro
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword, role });
  try{
    await user.save();
    res.status(201).send('Usuario creado');
  } catch (error) {
    // Manejo explícito del error de duplicado de MongoDB
    if (error.code === 11000 && error.keyPattern && error.keyPattern.username === 1) {
      return res.status(400).json({ error: 'Nombre de usuario ya existe' });
    }

    console.error('Error al crear usuario:', error.message);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
  
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

module.exports = router;