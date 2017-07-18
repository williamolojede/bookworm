const express = require('express');
const router = express.Router();
const User =  require('../models/user');
const mid = require('../middleware');
const validateSignUp = require('../helpers/validateSignUp');
const validateLogin = require('../helpers/validateLogIn');

// GET /profile
router.get('/profile', mid.requiresLogin, function(req, res, next) {
  User.findById(req.session.userId)
    .exec(function (err, user) {
      if (err) {
        return next(err);
      } else {
        return res.render('profile', { title: 'Profile', name: user.name, favorite: user.favoriteBook });
      }
    });
});

// GET /logout
router.get('/logout', function(req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

// GET /login
router.get('/login', mid.loggedOut, (req, res) => {
  return res.render('login', { title: 'Log In' });
});

// POST /login
router.post('/login', (req, res, next) => {
  const validation = validateLogin(req.body);

  if (validation.valid ) {
    const { email, password } = req.body;

    User.authenticate(email, password, (err, user) => {
      if ( err || !user ) {
        const err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });
  } else {
    const err = new Error(validation.message);
    err.status = validation.status;
    next(err);
  }
});

// GET /register
router.get('/register', mid.loggedOut, (req, res) => {
  return res.render('register', { title: 'Sign Up' });
});


// POST /register
router.post('/register', (req, res, next) => {
  const validation = validateSignUp(req.body);

  if( validation.valid ){
    // create object with form input
    const { name, email, favoriteBook, password, } = req.body;
    const userData = { name, email, favoriteBook, password };

    // insert userData into mongo as document
    User.create(userData, (err, user) => {
      if (err) {
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });

  } else {
    const err = new Error(validation.message);
    err.status = 400;
    return next(err);
  }
});

// GET /
router.get('/', function(req, res, next) {
  return res.render('index', { title: 'Home' });
});

// GET /about
router.get('/about', function(req, res, next) {
  return res.render('about', { title: 'About' });
});

// GET /contact
router.get('/contact', function(req, res, next) {
  return res.render('contact', { title: 'Contact' });
});

module.exports = router;
