// Packages
const mongoose = require('mongoose');

// Schema
const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

// Exports
module.exports = mongoose.model('Campground', campgroundSchema);
