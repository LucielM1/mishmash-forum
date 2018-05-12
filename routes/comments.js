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

// Edit
router.get('/:comment_id/edit', ensureCommentAuthor, (req, res) => {
  Comment.findById(req.params.comment_id, (err, comment) => {
    if (err) {
      res.redirect('back');
    } else {
      res.render('comments/edit', {campgroundId: req.params.id, comment: comment});
    }
  });
});

// Update
router.put('/:comment_id', ensureCommentAuthor, (req, res) => {
  // TODO: sanitize possible html input?
  // req.body.campground.description = req.sanitize(req.body.campground.description);
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, comment) => {
    if (err) {
      res.redirect('back');
    } else {
      res.redirect(`/campgrounds/${req.params.id}`);
    }
  });
});

// Destroy
router.delete('/:comment_id', ensureCommentAuthor, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, err => {
    if (err) {
      res.send(err);
    } else {
      res.redirect(`/campgrounds/${req.params.id}`);
    }
  });
});

// middleware functions
function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

function ensureCommentAuthor (req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, comment) => {
      if (err) {
        res.redirect('back');
      } else {
        // is user the comment's author?
        if (comment.author.id.equals(req.user._id)) {
          return next();
        } else {
          res.redirect('back');
        }
      }
    });
  // not authenticated
  } else {
    res.redirect('back');
  }
}

module.exports = router;
