const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Acceso denegado. Token requerido.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.authData = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Token inválido' });
  }
};

module.exports = authMiddleware;