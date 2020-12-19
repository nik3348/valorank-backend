const express = require('express')

const router = express.Router()
const auth = require('../controllers/auth.controller')

// When the user sends a post request to this route, passport authenticates the user
router.post('/signup', auth.signup)
router.post('/login', auth.login)

module.exports = router
