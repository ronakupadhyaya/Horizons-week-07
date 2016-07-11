var express = require('express');
var router = express.Router();
var passport=require('passport');
passport.authenticate('trello');
TrelloStrategy = require('passport-trello').Strategy

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});





passport.use 'trello', new TrelloStrategy(
    consumerKey: TRELLO_ID
    consumerSecret: TRELLO_SECRET
    callbackURL: TRELLO_CALLBACK
    passReqToCallback: true
    trelloParams:
        scope: "read,write"
        name: "MyApp"
        expiration: "never"
    (req, token, tokenSecret, profile, done) ->
        if not req.user
        {
        	console.log('not user')
        }
        	
            // user is not authenticated, log in via trello or do something else
        else{
        	console.log(req.user,'23')
            // authorize user to use Trello api
        }
)


module.exports = router;
