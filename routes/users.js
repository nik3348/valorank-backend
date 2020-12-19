const express = require('express')

const router = express.Router()
const user = require('../models/users.model')

router.get(
	'/',
	(req, res) => {
		user.find({}).exec((err, users) => {
			res.json(users)
		})
	},
)

module.exports = router
