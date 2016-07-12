// Add Passport-related auth routes here.

var express = require('express');
var router = express.Router();


module.exports = function(passport) {
  // console.log(passport);

router.get('/auth/trello', passport.authenticate('trello'));
router.get('/auth/trello/callback', passport.authenticate('trello', 
           {failureRedirect: '/'}), function(req, res) {
            res.redirect('/board');
           });






  return router;
};
