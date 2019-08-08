const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();
const {alreadyLoggedIn} = require('../helpers/auth');

// Load User Model
require('../models/User');
const User = mongoose.model('users');

// User Login Route
router.get('/login', alreadyLoggedIn, (req, res) => {
  res.render('users/login');
});

// Login Form POST
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// User Register Route
router.get('/register', alreadyLoggedIn, (req, res) => {
  res.render('users/register');
});

// Register Form POST
router.post('/register', (req, res) => {
  let errors = [];

  if(req.body.password != req.body.password2){
    errors.push({text:'Passwords do not match'});
  }

  if(req.body.password.length < 4){
    errors.push({text:'Password must be at least 4 characters'});
  }

// The reason we're passing these back in is so the form doesn't have to clear if they're wrong - back in the view you have to set the values to each of these properties we are sending back (e.g. value="name" on the name input)
// Lastly create an errors partial and put it as part of the main layout so we get the errors at the top
  if(errors.length > 0){
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    // Make password lowercase to avoid case sensitivity
    const lowerCaseEmail = (req.body.email).toLowerCase();

    //Make sure we are not registering the same email
    User.findOne({email: lowerCaseEmail})
      .then(user => {
        if(user){
          req.flash('error_msg', 'Email already regsitered');
          res.redirect('/users/register');
        } else {
          const newUser = new User({
            name: req.body.name,
            email: lowerCaseEmail,
            password: req.body.password
          });
          
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if(err) throw err;
              newUser.password = hash;
              newUser.save()
                .then(user => {
                  //req.flash('success_msg', 'You are now registered and can log in');
                  res.redirect('/users/login');
                })
                .catch(err => {
                  console.log(err);
                  return;
                });
            });
          });
        }
      });
  }
});

// Logout User
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;