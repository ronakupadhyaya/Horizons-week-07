var express = require('express');
var router = express.Router();
// var models = require('../models/models');
var passport = require('passport')
var Trello = require("trello");
var session = require('express-session')

module.exports = function(passport) {

	router.get('/login', (req, res, next) => {
		res.send('<a href="/auth/trello">Log in with trello</a>');
	})

	router.get('/auth/trello', passport.authenticate('trello'));

	router.get('/auth/trello/callback', passport.authenticate('trello', {
		successRedirect: '/boards',
		failureRedirect: '/login',
	}))	

	  // GET registration page
	router.get('/signup', function(req, res) {
		res.render('signup');
	});


	// GET Logout page
	router.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/login');
	});
	router.get('/boards', function(req, res){
		var trello = new Trello('d6958e4c1430e4e87b8f08e0a8275c94', req.user.token);
		trello.getBoards("me").then(boards => { //trello treats me
			res.render('/boards', boards)

		}).catch(err => {
			return err;
		})
	});

	router.get('/boards/:bid', function(req, res){
		var trello = new Trello('d6958e4c1430e4e87b8f08e0a8275c94', req.user.token);
		Promise.all([
					trello.getBoards("me"),
					trello.getListsOnBoard(req.params.bid),
					trello.getCardsOnBoard(req.params.bid)
			])
		.then(results => { results})
		.catch(errors => {});
	})

	


  return router;
};
