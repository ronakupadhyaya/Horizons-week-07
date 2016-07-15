var express = require('express');
var router = express.Router();
//var models = require('../models/models');

module.exports = function(passport) {
	// console.log(passport.authenticate('trello'))
	router.get('/auth/trello',
    	passport.authenticate('trello'));

	router.get('/auth/trello/callback', passport.authenticate('trello', { failureRedirect: '/login' }),
	    function(req, res) {
    		res.redirect('/board');
  	});

 return router;
}