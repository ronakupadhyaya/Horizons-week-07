var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var trelloStrategy = require('passport-trello');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
// var User = require('/models/user.js');

var connect = process.env.MONGODB_URI || require('./models/connect');
  mongoose.connect(connect);

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
 
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Passport stuff here

app.use(session({
  secret: process.env.SECRET,
  // name: 'Catscoookie',
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  proxy: true,
  resave: true,
  saveUninitialized: true
}));


app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, JSON.stringify(user));
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, JSON.parse(user));
  });
});

//trello passport
passport.use(new trelloStrategy({
  consumerKey: process.env.TRELLO_KEY,
  consumerSecret: process.env.TRELLO_SECRET,
  callbackURL: process.env.TRELLO_CALLBACK,
  passReqToCallback: true,
  trelloParams: {
      scope: "read,write",
      name: "3916",
      expiration: "never",
    },
}, function (req, token, tokenSecret, profile, done) {
      if (req.user)
         return done(null, {
            token: token,
            profile: profile
          })

      else
         return done(err, null);
 }))


app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
