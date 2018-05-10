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

// Model imports
const Campground = require('./models/campground');

// Campground.create({
//   name: 'Lima Escape',
//   image: 'https://assets.bedful.com/images/6fd79c8c1b3b86f027e63828d0bd23ded43bf7ef/large/image.jpg',
//   description: 'A Portuguese paradise for explorers, tree-lovers and anyone who likes the fresh air and sweet smell of an evergreen forest.'
// }, (err, campground) => console.log(campground));

// const campgrounds = [
//   {name: 'Lima Escape', image: 'https://assets.bedful.com/images/6fd79c8c1b3b86f027e63828d0bd23ded43bf7ef/large/image.jpg', description: 'A Portuguese paradise for explorers, tree-lovers and anyone who likes the fresh air and sweet smell of an evergreen forest.'},
//   {name: 'Quinta de Odelouca', image: 'https://assets.bedful.com/images/1f41572ff57832b06dc41c328bf65932fb56b5e4/large/image.jpg', description: 'Low-key camping in the Algarve’s forested mountain range, with excellent options for walking, biking and canoeing'},
//   {name: 'Le Clos du Lac', image: 'http://mb.web.sapo.io/c6b2e340412aab2a4a70738c7458f9c68b51ec56.jpg&W=1680&H=790&delay_optim=1&tv=2', description: 'A popular destination in France thanks to its high levels of sunshine, the diversity of its landscapes and its cultural heritage.'},
//   {name: 'Camp Liza', image: 'http://mb.web.sapo.io/87d91086a354b7763146cacc935fbc67e0b9957b.jpg&W=1024&H=683&delay_optim=1&tv=2', description: 'Among the mountain peaks and green alpine pastures, you will find the Bovec Valley with the wonderful, emerald Soča river, joint by the crystal clear and wild Koritnica.'}
// ];

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
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('show', {campground: campground});
    }
  });
});

// Start server
app.listen(3000, () => console.log(`Yelp Camp server listening on port ${port}`));
