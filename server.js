const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const routes = require('./routes');
const googleRoutes = require('./routes/googleRoutes');
const errorHandler = require('./middleware/error');
const session = require('express-session');
const passport = require('./config/passport'); // Archivo que acabamos de crear

// Configuración
const app = express();
const env = require('./config/env');

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Cambiar a true en producción con HTTPS
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Conectar a MongoDB
connectDB();

// Rutas
app.use('/api', routes);

app.use('/', googleRoutes);

// Manejo de errores
app.use(errorHandler);

// Iniciar servidor
const PORT = env.PORT;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));