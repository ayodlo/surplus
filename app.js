const express = require('express');
const path = require('path');
const exphbs  = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
//const methodOverride = require('method-override');

// Load Express application
const app = express();

// Load routes
const index = require('./routes/index');
const users = require('./routes/users');
const costsOther = require('./routes/costsOther');
const costsMonthly = require('./routes/costsMonthly');
const themes = require('./routes/themes');
const initialize = require('./routes/initialize');

// Passport Config
require('./config/passport')(passport);

// Map global promise - get rid of warning - Using global promise instead of mongoose promise which is deprecated
mongoose.Promise = global.Promise;

// Connect to mongoose
mongoose.connect("mongodb+srv://ayodlo:PhNrB6JXfsRIhFGw@cluster0-0hpwg.mongodb.net/surplus_db?retryWrites=true&w=majority", { useNewUrlParser: true })
  .then(() => {
	  console.log('Connected to database!')
  })
  .catch((error) => {
	  console.log(error);
  });

// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Method override middleware
/*
In order to use this we have to add the ?_method=DELETE to the form and also need to add a hidden input value declaring the type of request. 
<form method="POST" action="/resource?_method=DELETE">
  <input type="hidden" name="_method" value="DELETE">
  <button type="submit">Delete Resource</button>
</form>
*/
//app.use(methodOverride('_method'));

// Express session midleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash Middleware
app.use(flash());

// Global variables
app.use(function(req, res, next){
  res.locals.theme = '';
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Get Surplus Route
app.use('/', index)
app.use('/themes', themes);
app.use('/users', users);
app.use('/costsOther', costsOther);
app.use('/costsMonthly', costsMonthly);
app.use('/initialize', initialize);

const port = process.env.PORT || 5000;

app.listen(port, () =>{
  console.log(`Server started on port ${port}`);
});