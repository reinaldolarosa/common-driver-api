const express = require('express');
const authRoutes = require('./authRoutes');
const vehicleRoutes = require('./vehicleRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/api', vehicleRoutes);

module.exports = router;