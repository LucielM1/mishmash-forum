// Packages
const mongoose = require('mongoose');

// Schema
const commentSchema = new mongoose.Schema({
  text: String,
  author: String
});

// Exports
module.exports = mongoose.model('Comment', commentSchema);
