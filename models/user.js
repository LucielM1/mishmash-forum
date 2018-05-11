// Packages
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

userSchema.plugin(passportLocalMongoose);

// Exports
module.exports = mongoose.model('User', userSchema);
