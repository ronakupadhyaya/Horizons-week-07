var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session')

var auth = require('./routes/auth');
var routes = require('./routes/index');
var users = require('./routes/users');
var TrelloStrategy = require('passport-trello').Strategy
var app = express();

// The only trick is that you need to supply passport.serializeUser and 
// passport.deserializeUser callbacks as well, which convert the user object 
// to a string and restore it from a string, respectively. How do we convert 
// a simple JavaScript object to a string? You guessed it... JSON! Your serializeUser 
// callback should call its done callback with the output of JSON.stringify on the user 
// object, and your deserializeUser callback should call its done callback with the 
// output of JSON.parse on the input object.
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(session({secret: 'SECRET'}))
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, JSON.stringify(user));
});

passport.deserializeUser(function(user, done) {
  done(null, JSON.parse(user));
});
 
passport.use('trello', new TrelloStrategy( {
    consumerKey: 'd6958e4c1430e4e87b8f08e0a8275c94',
    consumerSecret: '1cc9c1484ed6c767a116da07fec0a747ec284b9078e0ae0aa0d8404bc27ddd6d',
    callbackURL: '/auth/trello/callback',
    passReqToCallback: true,
    trelloParams:{
        scope: "read,write",
        name: "MyApp",
        expiration: "never",
      },
    }, (req, token, tokenSecret, profile, done) => {
            return done(null, {token: token, profile: profile})
    }))


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));




app.use('/', auth(passport));

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
