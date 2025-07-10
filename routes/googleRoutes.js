const express = require('express');
const googleController = require('../controllers/googleController');
const passport = require('../config/passport');
const router = express.Router();

router.get('/auth/google', googleController.saveAuthRole, (req, res, next) =>
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next)
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login/failed',
  }),
  googleController.authCallback
);

router.get('/auth/google/success', googleController.successRedirect);
router.get('/auth/logout', googleController.logout);

module.exports = router;