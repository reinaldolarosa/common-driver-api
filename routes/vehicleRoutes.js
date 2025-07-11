const express = require('express');
const { saveVehicle,deleteVehicle, getAllVehicles,getVehiclesByUserId, updateVehicle} = require('../controllers/vehicleController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/add', authMiddleware, saveVehicle);
router.delete('/delete/:id', authMiddleware, deleteVehicle);
router.put('/update/:id', authMiddleware, updateVehicle);
router.get('/all', authMiddleware, getAllVehicles);
router.get('/by-user-id',authMiddleware, getVehiclesByUserId); 


module.exports = router;