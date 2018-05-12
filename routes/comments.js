const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const Comment = require('../models/comment');

// New
router.get('/new', ensureAuthenticated, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', {campground});
    }
  });
});

// Create
router.post('/', ensureAuthenticated, (req, res) => {
  // get campground to add comment to
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      // campground found so add new comment to the DB
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          // associate user with comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // save comment to db
          comment.save();
          // add comment to campground and save to db
          campground.comments.push(comment);
          campground.save();
          res.redirect(`/campgrounds/${campground._id}`);
        }
      });
    }
  });
});

// middleware to check if user is authenticated
function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
