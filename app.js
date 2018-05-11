// Packages
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// App config
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));
const port = process.env.PORT || 3000;

// Db config
mongoose.connect('mongodb://localhost/yelpcampdb');

// Project imports
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const seedDB = require('./seeds');

// Seed the database
seedDB();

// ROUTES
app.get('/', (req, res) => res.render('landing'));

// Campgrounds Index route
app.get('/campgrounds', (req, res) => {
  // get campgrounds from DB
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', {campgrounds: campgrounds});
    }
  });
});

// Campgrounds New route
app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new.ejs');
});

// Campgrounds Create route
app.post('/campgrounds', (req, res) => {
  if (!req.body) {
    return res.sendStatus('400');
  }
  let name = req.body.name;
  let image = req.body.image;
  let description = req.body.description;
  // add new campground to the DB
  Campground.create({name, image, description}, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('campgrounds');
    }
  });
});

// Campgrounds Show route
app.get('/campgrounds/:id', (req, res) => {
  // get campground from db
  Campground.findById(req.params.id).populate('comments').exec((err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/show', {campground: campground});
    }
  });
});

// ==================
// Comments routes
// ==================
// Comments New route
app.get('/campgrounds/:id/comments/new', (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new.ejs', {campground});
    }
  });
});

// Comments Create route
app.post('/campgrounds/:id/comments', (req, res) => {
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
          // add comment to campground and save
          campground.comments.push(comment);
          campground.save();
          res.redirect(`/campgrounds/${campground._id}`);
        }
      });
    }
  });
});

// Start server
app.listen(3000, () => console.log(`Yelp Camp server listening on port ${port}`));
