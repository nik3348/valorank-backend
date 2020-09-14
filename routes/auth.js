const express = require('express');
const passport = require('passport');

const router = express.Router();
const jwt = require('jsonwebtoken');

// When the user sends a post request to this route, passport authenticates the user based on the
// middleware created previously
router.post(
  '/signup',
  (req, res, next) => {
    passport.authenticate('signup', { session: false }, async (err, user, message) => {
      if (err) {
        console.error(err);
      }

      if (message !== undefined) {
        console.log(message);
        res.status(message.statusCode).json(message.message);
      } else {
        res.json({
          message: 'Signup successful',
          user: req,
        });
      }
    })(req, res, next);
  },
);

router.get(
  '/login',
  (req, res, next) => {
    passport.authenticate('login', { session: false }, async (err, user) => {
      try {
        if (err || !user) {
          const error = new Error('An Error occurred');
          return next(error);
        }
        req.login(user, { session: false }, async (error) => {
          if (error) return next(error);
          // We don't want to store the sensitive information such as the
          // user password in the token so we pick only the email and id
          const body = { _id: user._id, email: user.email };
          // Sign the JWT token and populate the payload with the user email and id
          const token = jwt.sign({ user: body }, 'top_secret');
          // Send back the token to the user
          return res.json({ token });
        });
      } catch (error) {
        return next(error);
      }
    })(req, res, next);
  },
);

module.exports = router;
