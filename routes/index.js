const express = require('express');
const authRoutes = require('./authRoutes');
const vehicleRoutes = require('./vehicleRoutes');
const tripRoutes = require('./tripRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/vehicle', vehicleRoutes);
router.use('/trip', tripRoutes);

module.exports = router;