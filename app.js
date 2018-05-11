// Packages
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');

// Project imports
const User = require('./models/user');
const indexRoutes = require('./routes/index');
const campgroundsRoutes = require('./routes/campgrounds');
const commentsRoutes = require('./routes/comments');
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

// Routes
app.use('/', indexRoutes);
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/comments', commentsRoutes);

// Seed the database
seedDB();

// Start server
app.listen(port, () => console.log(`Yelp Camp server listening on port ${port}`));
