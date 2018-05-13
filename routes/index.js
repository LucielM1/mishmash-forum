const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const middleware = require('../middleware');

// Root
router.get('/', (req, res) => res.render('landing'));

// Register
router.get('/register', middleware.ensureNotAuthenticated, (req, res) => res.render('register'));

router.post('/register', middleware.ensureNotAuthenticated, (req, res) => {
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
router.get('/login', middleware.ensureNotAuthenticated, (req, res) => res.render('login'));

router.post('/login', middleware.ensureNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/campgrounds',
  failureRedirect: '/login'
}), (req, res) => {
  // do nothing for now
});

// Logout
router.get('/logout', middleware.ensureAuthenticated, (req, res) => {
  req.logout();
  res.redirect('/campgrounds');
});

module.exports = router;
