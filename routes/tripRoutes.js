const express = require('express');
const { createTrip,updateTrip} = require('../controllers/TripController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/add', authMiddleware, createTrip);
router.delete('/delete/:id', authMiddleware, createTrip);
router.put('/update/:id', authMiddleware, updateTrip);
router.get('/all', authMiddleware, createTrip);
router.get('/by-user-id',authMiddleware, createTrip); 


module.exports = router;