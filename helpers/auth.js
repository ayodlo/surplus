module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    //req.flash('error_msg', 'Not Authorized');
    res.redirect('/users/login');
  },

  alreadyLoggedIn: function (req, res, next) {
    if (req.isAuthenticated()) {
      res.redirect('/');
    } else {
      //req.flash('error_msg', 'Not Authorized');
      return next();
    }
  }
}