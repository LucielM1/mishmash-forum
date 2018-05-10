// Packages
const mongoose = require('mongoose');

// Schema
const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
});

// Exports
module.exports = mongoose.model('Campground', campgroundSchema);
