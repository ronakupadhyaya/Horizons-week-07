var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();
var passport = require('passport');
var TrelloStrategy = require('passport-trello').Strategy
var session = require('express-session');


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

app.use(session({
  secret: "secret"
}));

passport.serializeUser(function(user, done) {
  done(null, JSON.stringify(user));
});

// how express sets req.user = undefined for logout
passport.deserializeUser(function(user, done) {
    done(null, JSON.parse(user));
});

var TRELLO_ID = '2c835df60c347ec5fb715ae71c0c64b2';
var TRELLO_SECRET = 'a3b0c873e3135f237ce560fec7f7df98519fc8a2125445ab887690db2eb966f1';
var TRELLO_CALLBACK = 'http://localhost:3000/auth/trello/callback';
var TRELLO_TOKEN = '02e0cdc4769e0540d7323265f02b854167834e215f04ec14a3b63868181ccd2c'; 

passport.use(new TrelloStrategy({
    consumerKey: TRELLO_ID,
    consumerSecret: TRELLO_SECRET,
    callbackURL: TRELLO_CALLBACK,
    passReqToCallback: true,
    trelloParams: {
        scope: "read,write",
        expiration: "never",
        name: "trello-backup"
      }
  }, 
  function (req, token, tokenSecret, profile, done) {   //callback
    console.log('User is authenticated');
    var user = {
      profile: profile,
      // token: token
      token: "02e0cdc4769e0540d7323265f02b854167834e215f04ec14a3b63868181ccd2c"
    }
    req.token = "02e0cdc4769e0540d7323265f02b854167834e215f04ec14a3b63868181ccd2c"
    console.log(user);
    return done(null, user);
  })
);

app.use(passport.initialize());
app.use(passport.session());

var routes = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');

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
