const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

// Root
router.get('/', (req, res) => res.render('landing'));

// Register
router.get('/register', (req, res) => res.render('register'));

router.post('/register', (req, res) => {
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
router.get('/login', (req, res) => res.render('login'));

router.post('/login', passport.authenticate('local', {
  successRedirect: '/campgrounds',
  failureRedirect: '/login'
}), (req, res) => {
  // do nothing for now
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/campgrounds');
});

// middleware to check if user is authenticated
function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
