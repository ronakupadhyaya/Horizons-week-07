var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var TrelloStrategy = require('passport-trello').Strategy;
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);

var auth = require('./routes/auth');
var routes = require('./routes/index');

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

var connect = process.env.MONGODB_URI || require('./models/connect');
mongoose.connect(connect);

// Passport Stuff
app.use(session({
    secret: 'lol',
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new TrelloStrategy({
  consumerKey: '68154753bc7729bf63832281e73f485e',
  consumerSecret: 'a2a740cfc77b4b0c6a19bcf4b4f5ed7955744091838c9ea914d20c6072a0143f',
  callbackURL: 'http://localhost:3000/auth/trello/callback',
  passReqToCallback: true,
  trelloParams: {
      scope: "read,write",
      name: "MyApp",
      expiration: "never"
    }
  },
  (req, token, tokenSecret, profile, done) => {

    console.log("token", token);
    if (!token) {
      return done('No token provided');
    }
    done(null, {
      token,
      profile
    })
  })
);

passport.serializeUser(function(user, done) {
  console.log(user.token)
  done(null, JSON.stringify(user));
});

passport.deserializeUser(function(id, done) {
  done(null, JSON.parse(id));
});

app.use('/', auth(passport));
app.use('/', routes);

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
