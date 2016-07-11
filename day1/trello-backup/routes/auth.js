var express = require('express');
var router = express.Router();
var trello = require('trello');

/* GET home page. */
router.get('/auth/trello', function(req, res, next) {
  passport.authenticate('trello')
});

router.get('/auth/trello/callback', function(req, res, next) {
  passport.authenticate('trello', {sucessRedirect: '/boards', failureRedirect: '/login'});
});
module.exports = router;
