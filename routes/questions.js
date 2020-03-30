const express = require('express');
const router = express.Router();
const Question = require('../models/question');
const Comment = require('../models/comment');
const middleware = require('../middleware');
const NodeGeocoder = require('node-geocoder');
const multer = require('multer');
const cloudinary = require('cloudinary');

// Regex sanitizer function
const escapeRegex = text => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

// Index
router.get('/', (req, res) => {
  // search was used
  if (req.query.search) {
    let regex = new RegExp(escapeRegex(req.query.search), 'gi');
    Question.find({name: regex}, (err, questions) => {
      if (err || !questions) {
        req.flash('error', 'There was a problem with the search.');
      }
      // if no results found, send a message to display in the view
      let message = 'Couldn\'t find a matching question.';
      questions.length === 0
        ? res.render('questions/index', {questions: questions, currentPage: 'questions', searchMessage: message})
        : res.render('questions/index', {questions: questions, currentPage: 'questions'});
    });
  } else {
  // get all questions from DB
    Question.find({}, (err, questions) => {
      if (err) {
        throw err;
      } else {
        res.render('questions/index', {questions: questions, currentPage: 'questions'});
      }
    });
  }
});

// New
router.get('/new', middleware.ensureAuthenticated, (req, res) => res.render('questions/new'));

// Create
router.post('/', middleware.ensureAuthenticated, (req, res) => {
  let name = req.body.name;
  //let cost = req.body.cost;
  //let image;
  let description = req.body.description;
  let author = {
    id: req.user._id,
    username: req.user.username
  };
        Question.create({name, description, author}, (err, question) => {
          if (err) {
            req.flash('error', 'Couldn\'t add question.');
          } else {
            req.flash('success', 'Question added successfully.');
          }
          res.redirect('/questions');
        });
      });
    // } else { (console.log('no file to upload!!')); }
  // });
// });

// Show
router.get('/:id', (req, res) => {
  // get question from db
  Question.findById(req.params.id).populate('comments').exec((err, question) => {
    if (err || !question) {
      req.flash('error', 'Couldn\'t retrieve question.');
      return res.redirect('/questions');
    }
    res.render('questions/show', {question: question});
  });
});

// Edit
router.get('/:id/edit', middleware.ensureAuthenticated, middleware.ensureQuestionAuthor, (req, res) => {
  // ensureQuestionAuthor places retrieved question in req.question so no need for 2nd db roundtrip
  res.render('questions/edit', {question: req.question});
});

// Update
router.put('/:id', middleware.ensureAuthenticated, middleware.ensureQuestionAuthor, (req, res) => {
  // req.question, with pre-save values, loaded by ensureQuestionAuthor
  // start with geocoder
  geocoder.geocode(req.body.location, (err, data) => {
    if (err || data.length === 0) {
      req.flash('error', err.message);
      return res.redirect(`/questions/${req.params.id}/edit`);
    }
    let updateData = {
      name: req.body.name,
      cost: req.body.cost,
      description: req.body.description,
      location: data[0].formattedAddress,
      lat: data[0].latitude,
      lng: data[0].longitude
    };
    // new file update, upload to cloudinary and delete old one
    if (req.file) {
      cloudinary.v2.uploader.upload(req.file.path, {transformation: [{ width: 2048 }]}, (err, result) => {
        if (err) {
          req.flash('error', err.message);
          return res.redirect('back');
        }
        // update cloudinary image props
        updateData.image = {
          id: result.public_id,
          url: result.secure_url
        };
        // delete old picture
        cloudinary.v2.uploader.destroy(req.question.image.id, (err, result) => console.log(result));
        // save question
        Question.findByIdAndUpdate(req.params.id, {$set: updateData}, (err, question) => {
          if (err) {
            req.flash('error', 'Couldn\'t update question.');
          } else {
            req.flash('success', 'Question updated successfully.');
          }
          res.redirect(`/questions/${question._id}`); // or req.params.id
        });
      });// cloudinary
    } else { // no new file to upload
      // save question
      Question.findByIdAndUpdate(req.params.id, {$set: updateData}, (err, question) => {
        if (err) {
          req.flash('error', 'Couldn\'t update question.');
        } else {
          req.flash('success', 'Question updated successfully.');
        }
        res.redirect(`/questions/${question._id}`); // or req.params.id
      });
    }
  });// geocoder
});

// Destroy
router.delete('/:id', middleware.ensureAuthenticated, middleware.ensureQuestionAuthor, (req, res) => {
  // req.question loaded by ensureQuestionAuthor
  // delete associated comments
  Comment.remove({
    _id: {
      $in: req.question.comments
    }
  }, err => {
    if (err) {
      req.flash('error', `Error removing associated comments.`);
      res.redirect('back');
    } else {
      // delete question
      req.question.remove(err => {
        if (err) {
          req.flash('error', 'Couldn\'t delete question.');
        } else {
          req.flash('success', 'Question deleted successfully.');
        }
        res.redirect('/questions');
      });
    }
  });
});

module.exports = router;
