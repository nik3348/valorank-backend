const mongoose = require('mongoose')

// Define schema
const { Schema } = mongoose

const userSchema = new Schema({
	id: String,
	username: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
})

userSchema.statics.checkExistingField = (field, value) => User.findOne({ [`${ field }`]: value }).exec()

// Compile model from schema
const User = mongoose.model('User', userSchema)

module.exports = User
