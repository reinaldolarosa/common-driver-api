const Trip = require('../models/Trip');
const mongoose = require('mongoose');


exports.createTrip = async (req, res) => {
  const { origin, destination, date, time } = req.body;
  const driverId = req.authData.id;

  if (!origin || !destination || !date || !time) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const [day, month, year] = date.split('/');
  const parsedDate = new Date(year, month - 1, day);

  if (isNaN(parsedDate)) {
    return res.status(400).json({ error: 'Fecha inválida. Formato esperado: dd/MM/yyyy' });
  }

  try {
    const newTrip = new Trip({
      origin,
      destination,
      date: parsedDate,
      time,
      driver: driverId
    });

    await newTrip.save();

    // Ejemplo de respuesta con createdAt y updatedAt
    res.status(201).json({ 
      message: 'Viaje creado exitosamente', 
      trip: {
        ...newTrip.toObject(),
        formattedDate: newTrip.formattedDate
      }
    });
  } catch (error) {
    console.error('Error al crear viaje:', error.message);
    res.status(500).json({ error: 'Error al crear el viaje' });
  }
};

// Actualizar un viaje
exports.updateTrip = async (req, res) => {
  const tripId = req.params.id;
  const { origin, destination, date, time } = req.body;
  const userId = req.authData.id;

  // Validación de ObjectId
  if (!mongoose.Types.ObjectId.isValid(tripId)) {
    return res.status(400).json({ error: 'ID de viaje inválido' });
  }

  try {
    const trip = await Trip.findById(tripId);

    // Verifica que el viaje exista
    if (!trip) {
      return res.status(404).json({ error: 'Viaje no encontrado' });
    }

    // Verifica que el usuario sea el conductor del viaje
    if (trip.driver.toString() !== userId) {
      return res.status(403).json({ error: 'No autorizado para actualizar este viaje' });
    }

    // Parsear fecha si se proporciona
    if (date) {
      const [day, month, year] = date.split('/');
      const parsedDate = new Date(year, month - 1, day);
      if (!isNaN(parsedDate)) {
        trip.date = parsedDate;
      } else {
        return res.status(400).json({ error: 'Fecha inválida. Formato esperado: dd/MM/yyyy' });
      }
    }

    // Actualiza solo los campos proporcionados
    trip.origin = origin || trip.origin;
    trip.destination = destination || trip.destination;
    trip.time = time || trip.time;

    const now = new Date();
    trip.updatedAt = now;

    await trip.save();

    res.status(200).json({ message: 'Viaje actualizado', trip });
  } catch (error) {
    console.error('Error al actualizar viaje:', error.message);
    res.status(500).json({ error: 'Error al actualizar el viaje' });
  }
};