require('dotenv').config()
const createError = require('http-errors')
const express = require('express')
const passport = require('passport')

const server = express()
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const compression = require('compression')
const logger = require('morgan')

const process = require('process')
const mongoose = require('mongoose')
const usersRouter = require('./routes/users')
const authRouter = require('./routes/auth')

// Database connection

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true,
	useUnifiedTopology: true })
	.then(() => console.log('Connected'))
	.catch(err => console.log('Caught', err.stack))

const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to database!'))

// Middleware
server.use(logger('dev'))
server.use(compression())
server.use(helmet())
server.use(express.json())
server.use(cookieParser())
server.use(cors())

require('./middleware/auth')

// Routes
server.use('/', authRouter)
server.use('/users', passport.authenticate('jwt', { session: false }), usersRouter)

// catch 404 and forward to error handler
server.use((req, res, next) => {
	next(createError(404, 'Page does not exist'))
})

// error handler
server.use((err, req, res, next) => {
	// set locals, only providing error in development
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'development' ? err : {}

	// render the error page
	res.status(err.status || 500)
	res.send(err.message)
})

process.on('SIGTERM', () => {
	debug('SIGTERM signal received: closing HTTP server')
	server.close(() => {
		debug('HTTP server closed')
	})
})

// TODO: Add health check
server.listen(3000, () => console.log('Server started!'))
