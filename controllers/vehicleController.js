const Vehicle = require('../models/Vehicle');

exports.saveVehicle = async (req, res) => {
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
        res.status(201).json({ message: "Vehiculo creado exitosamente" });
    } catch (error) {
        // Manejo explícito del error de duplicado de MongoDB
        if (error.code === 11000 && error.keyPattern && error.keyPattern.placa === 1) {
            return res.status(400).json({ error: 'Placa del vehiculo ya existe' });
        }

        console.error('Error al crear usuario:', error.message);
        res.status(500).json({ error: 'Error al crear vehiculo a un conductor' });
    }

};