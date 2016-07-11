var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('hbs');
var passport = require('passport');
var TrelloStrategy = require('passport-trello').Strategy;
var auth = require('./routes/auth');
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

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null,JSON.stringify(user));
});

passport.deserializeUser(function(input, done) {
  done(null,JSON.parse(input));
  });

// Passport strategy
passport.use('trello', new TrelloStrategy({
    consumerKey: '63aa587ffd2bc71922dbbbdf72958ded',
    consumerSecret:  'a347b3f17d5ca9479ee565757c0e5a80661b163dd7e2e67aaa7af535e4cd73f7',
    callbackURL: '/auth/trello/callback',
    passReqToCallback: true,
    trelloParams: {
      scope: "read,write",
      name: "MyApp",
      expiration: "never"
    }
  },
  function(req, token, tokenSecret, profile, done) {
      var user = {
      token: token,
      profile: profile
      }

     if (!req.user) {
      return done("Error, no user found");
     }
            //user is not authenticated, log in via trello or do something else 
        else{
          return done(null, user);
        }
            //authorize user to use Trello api 

  }
));

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
