const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const routes = require('./routes');
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

// Rutas de autenticación
app.get('/auth/google',
  (req, res, next) => {
    // Guarda el rol en la sesión
    const { role } = req.query;
    req.session.authRole = role;
    next();
  },
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

app.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login/failed',
  }),
  (req, res) => {
    req.session.authRole = null;
    res.redirect('/auth/google/success');
  }
);

app.get('/auth/google/success', (req, res) => {
  
  let response = {user: req.user, token: "ey................."};

  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json(response);
});

app.get('/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Logout exitoso' });
  });
});

// Manejo de errores
app.use(errorHandler);

// Iniciar servidor
const PORT = env.PORT;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));