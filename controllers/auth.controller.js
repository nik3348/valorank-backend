const passport = require('passport')
const jwt = require('jsonwebtoken')

exports.signup = (req, res, next) => {
	passport.authenticate('signup', { session: false }, async (err, user, message) => {
		if (err)
			console.error(err)

		if (!user)
			return res.status(message.statusCode || 400).json(message.message)

		return res.json({
			message: 'Signup successful',
			// TODO: Not safe
			user: req.body,
		})
	})(req, res, next)
}

exports.login = (req, res, next) => {
	passport.authenticate('login', { session: false }, async (err, user, message) => {
		if (err)
			console.error(err)

		if (!user)
			return res.status(message.statusCode || 400).json(message.message)

		req.login(user, { session: false }, async error => {
			if (error) return next(error)
			// We don't want to store the sensitive information such as the password
			// Sign the JWT token and populate the payload with the user email and id
			const token = jwt.sign({ user: user.username }, process.env.SECRET_KEY, {})
			// Send back the token to the user
			return res.json({
				token: token,
				user: user,
			})
		})
	})(req, res, next)
}
