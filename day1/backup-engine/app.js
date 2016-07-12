var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var routes = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');
var app = express();
var TrelloStrategy = require('passport-trello').Strategy;
var session = require('express-session');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

app.use(session({
    secret: "lol",
    name: 'Catscoookie',
    // store: new MongoStore({ mongooseConnection: mongoose.connection }),
    proxy: true,
    resave: true,
    saveUninitialized: true
}));

passport.serializeUser(function(user, done) {
            done(null, JSON.stringify(user));
      });

passport.deserializeUser(function(input, done) {
            done(null, JSON.parse(input));
      });

passport.use(new TrelloStrategy({
    consumerKey: '3a062b799e8b3d4f766e4ee08f7bc924',
    consumerSecret: '8a7bb405ae46b3c495ba9c04d48b1f87e6adbf5d83352112871013f17a2c7d17',
    callbackURL: '/auth/trello/callback',
    passReqToCallback: true,
    trelloParams: {
      scope: "read,write",
      name: "backup-engine",
      expiration: "never"
    }
  },
  function(req, token, tokenSecret, profile, done) {
   
    var fakeUser = {
      token: token,
      profile: profile
    }

    if (token === null) {
      console.log("error");
      return done('error: user not found');
    }
    else {
      console.log("great");
      return done(null, fakeUser);
    }
  }
));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/users', users);
app.use('/', auth(passport));
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
