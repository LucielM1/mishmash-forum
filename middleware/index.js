const Question = require('../models/question');
const Comment = require('../models/comment');

// Middleware functions
module.exports.ensureAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'You need to sign in before doing that.');
  res.redirect('/login');
};

module.exports.ensureNotAuthenticated = function (req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'You need to sign out before doing that.');
  res.redirect('questions');
};

module.exports.ensureQuestionExists = function (req, res, next) {
  Question.count({_id: req.params.id}, (err, count) => {
    if (!err && count > 0) {
      return next();
    }
    req.flash('error', 'Couldn\'t retrieve question.');
    res.redirect('/questions');
  });
};

module.exports.ensureQuestionAuthor = function (req, res, next) {
  Question.findById(req.params.id, (err, question) => {
    if (err || !question) {
      req.flash('error', 'Couldn\'t retrieve question.');
      res.redirect('/questions');
    } else {
      // is user the question's author or is user an admin?
      if (req.user.isAdmin || question.author.id.equals(req.user._id)) {
        // set request obj to retrieved question to use in routes
        req.question = question;
        return next();
      }
      req.flash('error', 'You don\'t have permission to do that.');
      res.redirect(`/questions/${req.params.id}`);
    }
  });
};

module.exports.ensureCommentAuthor = function (req, res, next) {
  Comment.findById(req.params.comment_id, (err, comment) => {
    if (err || !comment) {
      req.flash('error', 'Couldn\'t retrieve comment.');
      res.redirect(`/questions/${req.params.id}`);
    } else {
      // is user the comment's author or is user an admin?
      if (req.user.isAdmin || comment.author.id.equals(req.user._id)) {
        // set request obj to retrieved question to use in routes
        req.comment = comment;
        return next();
      }
      req.flash('error', 'You don\'t have permission to do that.');
      res.redirect(`/questions/${req.params.id}`);
    }
  });
};

// can be used on create/update/delete routes to enforce read only to non-admin users
module.exports.ensureAdmin = function (req, res, next) {
  if (req.user.isAdmin) {
    next();
  } else {
    req.flash('error', 'This site is read only for the moment.');
    res.redirect('back');
  }
};
