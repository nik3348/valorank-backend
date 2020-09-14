const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const createError = require('http-errors');
const User = require('../models/users.model');

passport.use(
  'signup',
  new LocalStrategy(
    {
      username: 'username',
      password: 'password',
      sessions: false,
    },
    async (username, password, done) => {
      try {
        const checkUsername = await User.checkExistingField('username', username);
        if (checkUsername) {
          return done(null, false, {
            statusCode: 409,
            message: 'Email already registered, log in instead',
          });
        }

        // Save the information provided by the user to the the database
        const user = await User.create({ username, password });
        // Send the user information to the next middleware
        return done(null, user, {});
      } catch (error) {
        return done(error, false, {
          statusCode: 400,
          message: error.message,
        });
      }
    },
  ),
);

passport.use(
  'login',
  new LocalStrategy({
    username: 'username',
    password: 'password',
  },
  async (username, password, done) => {
    try {
      // Find the user associated with the username provided by the user
      const user = await User.findOne({ username });
      if (!user) {
        // If the user isn't found in the database, return a message
        return done(null, false, { message: 'User not found' });
      }
      // Validate password and make sure it matches with the corresponding hash stored in the database
      // If the passwords match, it returns a value of true.
      const validate = await user.isValidPassword(password);
      if (!validate) {
        return done(null, false, { message: 'Wrong Password' });
      }
      // Send the user information to the next middleware
      return done(null, user, { message: 'Logged in Successfully' });
    } catch (error) {
      return done(error);
    }
  }),
);

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'secret',
};
passport.use(
  'jwt',
  new JwtStrategy(opts, (jwt_payload, done) => {
    User.findOne({ id: jwt_payload.sub }, (err, user) => {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      }
      return done(null, false);
      // or you could create a new account
    });
  }),
);

module.exports = passport;