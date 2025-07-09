const express = require('express');
const { saveVehicle } = require('../controllers/vehicleController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/vehicle', authMiddleware, saveVehicle);

module.exports = router;