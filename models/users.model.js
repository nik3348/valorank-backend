const mongoose = require('mongoose');

// Define schema
const { Schema } = mongoose;

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
});

// We'll use this later on to make sure that the user trying to log in has the correct credentials
userSchema.methods.isValidPassword = async (password) => {
  const user = this;
  // Database matches the one sent. Returns true if it does else false.
  return password === user.password;
};

userSchema.statics.checkExistingField = (field, value) => User.findOne({ [`${field}`]: value }).exec();

// Compile model from schema
const User = mongoose.model('User', userSchema);

module.exports = User;
