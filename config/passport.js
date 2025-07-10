const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User');
const env = require('./env');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
      passReqToCallback: true
    },
    async (req, token, refreshToken, profile, done) => {
      try {
        // Busca o crea un usuario en tu base de datos
        let user = await User.findOne({ googleId: profile.id });
        // Recupera el rol desde la sesión
        console.log('profilito ',profile)
        
        const role = req.session.authRole || 'passenger';

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            username: profile.emails[0].value,
            email: profile.emails[0].value,
            photo: profile.photos[0].value,
            role: role
          });
        }

        done(null, user );
      } catch (err) {
        done(err, null);
      }
    }
  )
);

module.exports = passport;