//DECLARATION
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var session = require('express-session');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var MySQLStore = require('express-mysql-session')(session);
var expressLayouts = require('express-ejs-layouts');

var login = require('./controller/login');
var api = require('./controller/api');
var register = require('./controller/register');
var home = require('./controller/home');
var logout = require('./controller/logout');
var admin = require('./controller/admin');
var user = require('./controller/user');
var blogs = require('./controller/blogs');
var cars = require('./controller/cars');

require('dotenv').config(); //access point{.env}
require('./models/passport')(passport);// Passport Config

var port = process.env.PORT || 4545;

var app = express();


// //CONFIGURATION
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//MIDDLEWARE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressValidator());
app.use(express.static(path.join(__dirname, 'public')));// Set Static Path
//express-mysql-session
var options = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
}
var sessionStore = new MySQLStore(options);

app.use(session({
  secret: 'dont try to hack',
  resave: false,
  store: sessionStore,
  saveUninitialized: false,
  // cookie: { secure: true } //for https
}));

// passport
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// local variable
app.use(function (req, res, next) {
  res.locals.error = req.flash('error');
  res.locals.errors = [];
  res.locals.data = {};
  res.locals.tittle = "";
  res.locals.isAuth = req.isAuthenticated();
  res.locals.isAdmin = req.user || null;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

// switch to controller
app.use('/', home);
app.use('/api', api);
app.use('/login', login);
app.use('/register', register);
app.use('/logout', logout);
app.use('/admin', admin);
app.use('/user', user);
app.use('/blogs', blogs);
app.use('/cars', cars);

//SERVER STARTUP
app.listen(port, function () {
  return console.log('server started at http://localhost:' + port);
});