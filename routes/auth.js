const express = require('express')
const passport = require('passport')

const router = express.Router()
const jwt = require('jsonwebtoken')

// When the user sends a post request to this route, passport authenticates the user based on the
// middleware created previously
router.post(
	'/signup',
	(req, res, next) => {
		passport.authenticate('signup', { session: false }, async (err, user, message) => {
			if (err)
				console.error(err)

			if (!user)
				return res.status(message.statusCode || 400).json(message.message)

			return res.json({
				message: 'Signup successful',
				user: req,
			})
		})(req, res, next)
	},
)

router.post(
	'/login',
	(req, res, next) => {
		passport.authenticate('login', { session: false }, async (err, user, message) => {
			if (err)
				console.error(err)

			if (!user)
				return res.status(message.statusCode || 400).json(message.message)

			req.login(user, { session: false }, async error => {
				if (error) return next(error)
				// We don't want to store the sensitive information such as the password
				// Sign the JWT token and populate the payload with the user email and id
				console.log(user)
				const token = jwt.sign({ user: user.username }, 'top_secret')
				// Send back the token to the user
				return res.json({ token })
			})
		})(req, res, next)
	},
)

module.exports = router
