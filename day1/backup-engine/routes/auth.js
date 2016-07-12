var express = require('express');
var router = express.Router();
//var models = require('../models/models');
// var authToken = process.env.AUTH_TOKEN;
// var fromPhone = process.env.FROM_PHONE;

module.exports = function(passport) {

 router.get('/auth/trello',
    passport.authenticate('trello'));

  router.get('/auth/trello/callback',
    passport.authenticate('trello', { failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/boards');
    });

   return router;
};