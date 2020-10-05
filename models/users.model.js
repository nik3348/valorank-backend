const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
// Define schema
const { Schema } = mongoose

const UserSchema = new Schema({
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

UserSchema.statics.checkExistingField = function (field, value) {
	User.findOne({ [`${ field }`]: value }).exec()
}

UserSchema.methods.isValidPassword = async function (password) {
	console.log(password + '              +                       ' + this.password)
	return await bcrypt.compare(password, this.password)
}

UserSchema.pre(
	'save',
	async function (next) {
		this.password = await bcrypt.hash(this.password, 10)
		next()
	})

// Compile model from schema
const User = mongoose.model('User', UserSchema)

module.exports = User
