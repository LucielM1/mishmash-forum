const express = require('express');
const router = express.Router({mergeParams: true});
const Question = require('../models/question');
const Comment = require('../models/comment');
const middleware = require('../middleware');

// New
router.get('/new', middleware.ensureAuthenticated, (req, res) => {
  Question.findById(req.params.id, (err, question) => {
    if (err || !question) {
      req.flash('error', 'Couldn\'t retrieve question.');
      res.redirect('/questions');
    } else {
      res.render('comments/new', {question});
    }
  });
});

// Create
router.post('/', middleware.ensureAuthenticated, (req, res) => {
  // get question to add comment to
  Question.findById(req.params.id, (err, question) => {
    if (err || !question) {
      req.flash('error', 'Couldn\'t retrieve question.');
      res.redirect('/questions');
    } else {
      // question found so add new comment to the DB
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          req.flash('error', 'Couldn\'t add comment.');
          res.redirect('back');
        } else {
          // associate user with comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // save comment to db
          comment.save();
          // add comment to question and save to db
          question.comments.push(comment);
          question.save();
          req.flash('success', 'Comment added successfully.');
          res.redirect(`/questions/${question._id}`);
        }
      });
    }
  });
});

// Edit
router.get('/:comment_id/edit', middleware.ensureAuthenticated, middleware.ensureQuestionExists, middleware.ensureCommentAuthor, (req, res) => {
  // first call to ensureQuestionExists to avoid question id tampering in url
  // ensureCommentAuthor places retrieved comment in req.question so no need for 2nd db roundtrip
  res.render('comments/edit', {questionId: req.params.id, comment: req.comment});
});

// Update
router.put('/:comment_id', middleware.ensureAuthenticated, middleware.ensureCommentAuthor, (req, res) => {
  // req.body.question.description = req.sanitize(req.body.question.description);
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, comment) => {
    if (err) {
      req.flash('error', 'Couldn\'t update comment.');
      res.redirect('back');
    } else {
      req.flash('success', 'Comment updated successfully.');
      res.redirect(`/questions/${req.params.id}`);
    }
  });
});

// Destroy
router.delete('/:comment_id', middleware.ensureAuthenticated, middleware.ensureQuestionExists, middleware.ensureCommentAuthor, (req, res) => {
  // remove comment refs
  Question.findByIdAndUpdate(req.params.id, {
    $pull: {
      comments: req.comment.id
    } // use $pull to remove comment id from comments array
  }, err => {
    if (err) {
      req.flash('error', `Error removing association from question`);
    } else {
      // remove comment from db. req.comment loaded by ensureCommentAuthor
      req.comment.remove(err => {
        if (err) {
          req.flash('error', 'Couldn\'t delete comment.');
        } else {
          req.flash('success', 'Comment deleted successfully.');
        }
        res.redirect(`/questions/${req.params.id}`);
      });
    }
  });
});

module.exports = router;
