const Campground = require('../models/campground');
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
  res.redirect('back');
};

module.exports.ensureCampgroundAuthor = function (req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, campground) => {
      if (err) {
        req.flash('error', 'Couldn\'t retrieve campground.');
        res.redirect('back');
      } else {
        // is user the campground's author?
        if (campground.author.id.equals(req.user._id)) {
          return next();
        } else {
          req.flash('error', 'You don\'t have permission to do that.');
          res.redirect('back');
        }
      }
    });
  // not authenticated
  } else {
    req.flash('error', 'You need to sign in before doing that.');
    res.redirect('back');
  }
};

module.exports.ensureCommentAuthor = function (req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, comment) => {
      if (err) {
        req.flash('error', 'Couldn\'t retrieve comment.');
        res.redirect('back');
      } else {
        // is user the comment's author?
        if (comment.author.id.equals(req.user._id)) {
          return next();
        } else {
          req.flash('error', 'You don\'t have permission to do that.');
          res.redirect('back');
        }
      }
    });
  // not authenticated
  } else {
    req.flash('error', 'You need to sign in before doing that.');
    res.redirect('back');
  }
};
