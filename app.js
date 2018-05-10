// Packages
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// App config
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
const port = process.env.PORT || 3000;

// Db config
mongoose.connect('mongodb://localhost/yelpcampdb');

// Project imports
const Campground = require('./models/campground');
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
      res.render('index', {campgrounds: campgrounds});
    }
  });
});

// Campgrounds New route
app.get('/campgrounds/new', (req, res) => {
  res.render('new.ejs');
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
      res.render('show', {campground: campground});
    }
  });
});

// Start server
app.listen(3000, () => console.log(`Yelp Camp server listening on port ${port}`));
