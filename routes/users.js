const express = require('express');
const passport = require('passport');

const router = express.Router();
const user = require('../models/users.model');

router.get(
  '/',
  passport.authenticate('jwt', { session: false }, () => {}),
  (req, res) => {
    res.send('respond with a resource');
  },
);

router.get(
  '/a',
  (req, res) => {
    user.find({}).exec((err, users) => {
      res.json(users);
    });
  },
);

module.exports = router;
