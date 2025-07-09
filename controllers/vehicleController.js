const Vehicle = require('../models/Vehicle');
let vehiculos

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

exports.deleteVehicle = async (req, res) => {
    const id = req.params.id; // Get the ID from the URL parameters

    console.log('ID del vehículo a eliminar:', id);

    try {
        // Find the vehicle by its ID and delete it directly
        // findByIdAndDelete is a common Mongoose method for this.
        // It returns the deleted document if found, or null if not found.
        const deletedVehicle = await Vehicle.findByIdAndDelete(id);

        if (deletedVehicle) {
            // If deletedVehicle is not null, it means a document was found and deleted
            return res.status(200).json({ message: `Vehículo con ID ${id} eliminado exitosamente.`, deletedVehicle });
        } else {
            // If deletedVehicle is null, no document with that ID was found
            return res.status(404).json({ message: `Vehículo con ID ${id} no encontrado.` });
        }
    } catch (error) {
        // Catch any errors that occur during the database operation
        console.error('Error al eliminar el vehículo:', error);
        // Send a 500 status for server errors
        return res.status(500).json({ error: 'Error del servidor al eliminar el vehículo.', details: error.message });
    }
};


