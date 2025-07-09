const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const routes = require('./routes');
const errorHandler = require('./middleware/error');

// Configuración
const app = express();
const env = require('./config/env');

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Conectar a MongoDB
connectDB();

// Rutas
app.use('/api', routes);

// Manejo de errores
app.use(errorHandler);

// Iniciar servidor
const PORT = env.PORT;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));