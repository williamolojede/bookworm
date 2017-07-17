const express = require('express');
const router = express.Router();
const User =  require('../models/user');
const validateReq = require('../helpers/validateReq');

// GET /login
router.get('/login', (req, res) => {
  return res.render('login', { title: 'Log In' });
});

// GET /register
router.get('/register', (req, res) => {
  return res.render('register', { title: 'Sign Up' });
});


// POST /register
router.post('/register', (req, res, next) => {
  const validation = validateReq(req.body);

  if( validation.valid ){
    // create object with form input
    const { name, email, favoriteBook, password, } = req.body;
    const userData = { name, email, favoriteBook, password };

    // insert userData into mongo as document
    User.create(userData, (err, user) => {
      if (err) {
        return next(err);
      } else {
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
