const LocalStrategy  = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load user model
const User = mongoose.model('users');

module.exports = function(passport){
  //the usernameField: 'name' option is used to tell passport that the name of our username field is name - otherwise we would have to name it usernameField which is the passport default
  passport.use(new LocalStrategy({usernameField: 'name'}, (name, password, done) => {
    // Match user
    User.findOne({
      name:name
    }).then(user => {
      if(!user){
        return done(null, false, {message: 'No User Found'});
      } 

      // Match password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if(err) throw err;
        if(isMatch){
          return done(null, user);
        } else {
          return done(null, false, {message: 'Password Incorrect'});
        }
      })
    })
  }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}