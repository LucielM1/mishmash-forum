const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');

// Index
router.get('/', (req, res) => {
  // get campgrounds from DB
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', {campgrounds: campgrounds});
    }
  });
});

// New
router.get('/new', ensureAuthenticated, (req, res) => res.render('campgrounds/new'));

// Create
router.post('/', ensureAuthenticated, (req, res) => {
  if (!req.body) {
    return res.sendStatus('400');
  }
  let name = req.body.name;
  let image = req.body.image;
  let description = req.body.description;
  let author = {
    id: req.user._id,
    username: req.user.username
  };
  // add new campground to the DB
  Campground.create({name, image, description, author}, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/campgrounds');
    }
  });
});

// Show
router.get('/:id', (req, res) => {
  // get campground from db
  Campground.findById(req.params.id).populate('comments').exec((err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/show', {campground: campground});
    }
  });
});

// Edit
router.get('/:id/edit', ensureCampgroundAuthor, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    res.render('campgrounds/edit', {campground: campground});
  });
});

// Update
router.put('/:id', ensureCampgroundAuthor, (req, res) => {
  // TODO: sanitize possible html input?
  // req.body.campground.description = req.sanitize(req.body.campground.description);
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, campground) => {
    if (err) {
      res.redirect('/campgrounds');
    } else {
      res.redirect(`/campgrounds/${campground._id}`); // or req.params.id
    }
  });
});

// Destroy
router.delete('/:id', ensureCampgroundAuthor, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, err => {
    if (err) {
      res.send(err);
    } else {
      res.redirect(`/campgrounds/`);
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

function ensureCampgroundAuthor (req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, campground) => {
      if (err) {
        res.redirect('back');
      } else {
        // is user the campground's author?
        if (campground.author.id.equals(req.user._id)) {
          return next();
        } else {
          res.send('No permission!');
        }
      }
    });
  // not authenticated
  } else {
    res.redirect('back');
  }
}

module.exports = router;
