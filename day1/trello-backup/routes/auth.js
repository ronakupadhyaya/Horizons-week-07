var express = require('express');
var router = express.Router();
var Trello = require('trello');

module.exports = function(passport) {
 
 // GET Login page
 router.get('/login', function(req, res) {
   res.render('login');
 });


 // GET Logout page
 router.get('/logout', function(req, res) {
   req.logout();
   res.redirect('/login');
 });

 // FACEBOOK

 router.get('/auth/trello',
   passport.authenticate('trello'));

 router.get('/auth/trello/callback',
   passport.authenticate('trello', { failureRedirect: '/login' }),
   function(req, res) {
     req.user.trello = new Trello('2b914ba388cf2f53ab67ae0e4f59cb80', req.user.token);
     console.log(req.user.trello);
     res.redirect('/boards');
   });

 return router;
};