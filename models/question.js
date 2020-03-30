// Packages
const mongoose = require('mongoose');

// Scehma 
const questionSchema = new mongoose.Schema({
  name: String,
  description: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ],
  created: {
    type: Date,
    default: Date.now
  }
});

// Exports
module.exports = mongoose.model('Question', questionSchema);
