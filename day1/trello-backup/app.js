var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var express = require('express');
var session = require('express-session');
var passport = require('passport');
var TrelloStrategy = require('passport-trello').Strategy;
//var models = require('./models/models')
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
var routes = require('./routes/index');
var auth = require('./routes/auth');
var flash = require('connect-flash');

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

var connect = process.env.connect;
mongoose.connect(connect);

app.use(session({
    secret: process.env.SECRET,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    proxy: true,
    resave: true,
    saveUninitialized: true
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, JSON.stringify(user));
});

passport.deserializeUser(function(user, done) {
    done(null, JSON.parse(user));
});


passport.use(new TrelloStrategy({
    consumerKey: process.env.TRELLO_ID,
    consumerSecret: process.env.TRELLO_SECRET,
    callbackURL: 'http://localhost:3000/auth/trello/callback',
    passReqToCallback: true,
    trelloParams: {
        scope: "read,write",
        name: "MyApp",
        expiration: "never"
      }
    },
    function (req, token, tokenSecret, profile, done)  {
          console.log("got here")
      if (!token) {
        done("No token provided");
      } else {
        done(null, {
          token: token,
          profile: profile
        })
      }
    }
))


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
