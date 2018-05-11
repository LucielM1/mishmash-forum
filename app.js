// Packages
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');

// Project imports
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const User = require('./models/user');
const seedDB = require('./seeds');

// App config
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));
const port = process.env.PORT || 3000;

// Db config
mongoose.connect('mongodb://localhost/yelpcampdb');

// Passport config
app.use(require('express-session')({
  secret: 'Change me later!', // TODO: process.env.SESSIONSECRET
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware to make currentUser available to all routes
app.use((req, res, next) => {
  res.locals.currentUser = req.user; // req.user is an authenticated user
  next();
});

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
app.get('/campgrounds/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

// Campgrounds Create route
app.post('/campgrounds', isLoggedIn, (req, res) => {
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
      res.redirect('/campgrounds');
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
app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', {campground});
    }
  });
});

// Comments Create route
app.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
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

// ==================
// Auth routes
// ==================
// Register
app.get('/register', (req, res) => res.render('register'));

app.post('/register', (req, res) => {
  let user = new User({username: req.body.username});
  User.register(user, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render('register');
    }
    passport.authenticate('local')(req, res, () => res.redirect('/campgrounds'));
  });
});

// Login
app.get('/login', (req, res) => res.render('login'));

app.post('/login', passport.authenticate('local', {
  successRedirect: '/campgrounds',
  failureRedirect: '/login'
}), (req, res) => {
  // do nothing for now
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/campgrounds');
});

// middleware to check if user is authenticated
function isLoggedIn (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// Start server
app.listen(port, () => console.log(`Yelp Camp server listening on port ${port}`));
