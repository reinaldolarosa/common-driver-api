const jwt = require('jsonwebtoken');

// En successRedirect:
const googleController = {
    // Middleware para guardar el rol en sesión
    saveAuthRole: (req, res, next) => {
        const { role } = req.query;
        req.session.authRole = role;
        next();
    },

    // Callback después de autenticación exitosa
    authCallback: (req, res) => {
        req.session.authRole = null;
        res.redirect('/auth/google/success');
    },

    // Ruta de éxito
    successRedirect: (req, res) => {
        if (!req.user) {
            return res.status(401).json({ error: 'No autenticado' });
        }

        const token = jwt.sign(
            { id: req.user._id, role: req.user.role },
            process.env.JWT_SECRET,
            { expiresIn: '72h' }
        );

        res.json({
            user: req.user,
            token: token
        });
    },

    // Logout
    logout: (req, res) => {
        req.logout((err) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Logout exitoso' });
        });
    }
};

module.exports = googleController;