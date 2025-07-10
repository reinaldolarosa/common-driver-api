const Vehicle = require('../models/Vehicle');
const mongoose = require('mongoose'); // Importa Mongoose para usar ObjectId


exports.saveVehicle = async (req, res) => {
    const { marca, modelo, placa, color,status } = req.body;
    const vehicle = new Vehicle({
        marca,
        modelo,
        placa,
        color,
        userId: req.authData.id,
        status
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

// Nuevo método para obtener todos los vehículos
exports.getAllVehicles = async (req, res) => {
    console.log('Intentando obtener todos los vehículos...');

    try {
        // Usa Vehicle.find({}) para encontrar todos los documentos en la colección.
        // Un objeto vacío {} como filtro significa "no filtrar", es decir, trae todo.
        const vehicles = await Vehicle.find({});

        // Si se encuentran vehículos, envía una respuesta 200 OK con los datos
        if (vehicles.length > 0) {
            return res.status(200).json(vehicles);
        } else {
            // Si no se encuentran vehículos, puedes enviar un 200 OK con un array vacío
            // o un 404 Not Found si prefieres indicar que no hay recursos.
            // Un 200 con array vacío es más común para "GET all".
            return res.status(200).json([]);
            // Opcional: return res.status(404).json({ message: 'No se encontraron vehículos.' });
        }
    } catch (error) {
        // Captura cualquier error que ocurra durante la operación de la base de datos
        console.error('Error al obtener todos los vehículos:', error);
        // Envía un 500 Internal Server Error
        return res.status(500).json({ error: 'Error del servidor al obtener vehículos.', details: error.message });
    }
};

/**
 * @desc Get all vehicles for the authenticated user
 * @route GET /api/vehicles/myvehicles
 * @access Private (requires authentication)
 */
exports.getVehiclesBySpecificUserId = async (req, res) => {
    // 1. Obtener el ID de usuario desde la solicitud
    // Este ID podría venir de:
    // a) req.params.userId (si está en la URL como /vehicles/user/algúnID)
    // b) req.body.userId (si viene en el cuerpo de la solicitud)
    // c) req.authData.id (si viene de un token de autenticación, como en tu ejemplo anterior)

    // Vamos a usar un ejemplo donde viene de req.params.userId, pero el principio es el mismo.
    const userIdFromRequest = req.authData.id; // O req.authData.id si es autenticado

    console.log(`Intentando obtener vehículos para el userId: ${userIdFromRequest}`);

    // 2. Validar si el ID es un ObjectId de MongoDB válido (muy importante)
    if (!mongoose.Types.ObjectId.isValid(userIdFromRequest)) {
        return res.status(400).json({ message: 'ID de usuario inválido. Formato no válido de ObjectId.' });
    }

    try {
        // 3. Crear una instancia de ObjectId si es necesario (Mongoose lo hace implícitamente la mayoría de las veces)
        // Aunque Mongoose suele hacer la conversión automática si el campo en el esquema es ObjectId,
        // es una buena práctica y aclara la intención.
        const userObjectId = new mongoose.Types.ObjectId(userIdFromRequest);

        // 4. Realizar la búsqueda usando el filtro
        // Mongoose buscará documentos donde el campo 'userId' coincida exactamente con 'userObjectId'
        const vehicles = await Vehicle.find({ userId: userObjectId });

        // 5. Enviar la respuesta
        if (vehicles.length > 0) {
            return res.status(200).json(vehicles);
        } else {
            // Si no se encuentran vehículos para ese userId
            return res.status(200).json([]);
        }
    } catch (error) {
        console.error('Error al obtener vehículos por userId:', error);
        return res.status(500).json({ 
            error: 'Error del servidor al obtener vehículos.', 
            details: error.message 
        });
    }
};


