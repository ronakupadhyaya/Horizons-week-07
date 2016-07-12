var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var TrelloStrategy = require('passport-trello').Strategy

var routes = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');

var app = express();

var mongoose = require('mongoose');
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);


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
app.use(session({secret: 'kitchinaiscraycray'}));

//Passport
passport.serializeUser(function(user, done) {
  console.log("ASH", user)
  done(null, JSON.stringify(user));
});
 
passport.deserializeUser(function(user, done) {
  done(null, JSON.parse(user))
});

app.use(passport.initialize());
app.use(passport.session());
app.use('/', routes(passport));
app.use('/', auth(passport));


passport.use("trello", new TrelloStrategy({
    consumerKey: "419e1fd8e0b30830e158a368177ee4ad",
    consumerSecret: "e3f471429bbf34461f2e4285aa6800de3cc9fa31645d20a68a233013977f0e6e",
    callbackURL: "http://localhost:3000/auth/trello/callback",
    passReqToCallback: true,
    trelloParams:
        {scope: "read,write",
        name: "Ashley",
        expiration: "never"}
    },
    function(req, token, tokenSecret, profile, done){
      var user = {
        token: token,
        profile: profile
      };
      console.log("AHSLEY", profile);
      done (null, user);
    }
        // if not req.user
        //     # user is not authenticated, log in via trello or do something else
        // else
        //     # authorize user to use Trello api
))

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
