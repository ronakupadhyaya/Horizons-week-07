var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var app = express();
var passport=require('passport');
var TrelloStrategy = require('passport-trello').Strategy;
var Trello = require('trello');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

var sess = {
  secret: 'xyz'
}


app.use(session(sess))
app.use(passport.initialize())
app.use(passport.session())

//throw in passport-trello

passport.use(new TrelloStrategy({
   consumerKey: "4426aaac3e3ddf941ff93930255038d8",
    consumerSecret: "24eb10906b9186cbdceb64f56597e41061c9aa0e91135f6eb07fa23e61b1724e",
    callbackURL: "http://localhost:3000/auth/trello/callback",
    passReqToCallback: true,
    trelloParams:{
        scope: "read,write",
        name: "MyApp",
        expiration: "never"
    }
        
},
function(req,token, tokenSecret, profile, done){
  // console.log(token,'token')
  // console.log(profile,'profile')
  done(null,{token: token,
          profile: profile})
}));

passport.serializeUser(function(user, done) {
  done(null, JSON.stringify(user));
});

passport.deserializeUser(function(user, done) {
//  console.log(user,'51')
    done(null, JSON.parse(user))
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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
