var express = require('express');
var router = express.Router();


module.exports = function(passport) {

	// GET Login page
 	 router.get('/login', function(req, res) {
	    res.render('auth/login');
	  });

	//trello strategy
	router.get('/auth/trello',
	    passport.authenticate('trello'));

	router.get('/auth/trello/callback',
		passport.authenticate('trello', { failureRedirect: '/login' }),
		function(req, res) {
		  // Successful authentication, redirect home.
		  res.redirect('/');
	});

	return router;
};