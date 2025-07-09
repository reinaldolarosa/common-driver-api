const express = require('express');
const { saveVehicle,deleteVehicle } = require('../controllers/vehicleController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/add', authMiddleware, saveVehicle);
router.delete('/delete/:id', authMiddleware, deleteVehicle);

module.exports = router;