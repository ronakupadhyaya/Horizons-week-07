var express = require('express');
var session = require('express-session');
var router = express.Router();
//MODELS
var Board = require('../models/board');
var List = require('../models/list');
var Card = require('../models/card');

var Trello = require("trello");
var trello = new Trello("419e1fd8e0b30830e158a368177ee4ad", "e2c5a7f11b8ce731bb48cb06b4dfc81391cd2c43d5c61ec3999bcc298442922d");

module.exports = function(passport){

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/auth/trello', passport.authenticate('trello'), function(req, res, next){	//passport.authenticate... is middlewear (run before the function)
	console.log('HERE');
	res.redirect('/boards');
});

router.get('/boards', function(req, res, next){
	trello.getBoards("me").then(boards => {
		console.log("boards",boards);
		res.render('boards', {boards:boards});		
	}).catch(err => {
		if (Array.isArray(err)){
			res.render("boards",{boards:err})
		}
		return next(err)
	});
});

router.get('/boards/:id', function(req, res, next){
	var a = trello.getListsOnBoard(req.params.id).then(function(lists) {
		//map boards into mongo models and save to monog
		//return the .save
		return lists.map(function(list) {
				//array of promisess
			return new List({title: list.name}).save() //save return promise (something you can call then on)
		})
	})
	//this will get called when save compltes
	var b = trello.getCardsOnBoard(req.params.id).then(function(cards){
		return cards.map(function(card){
			// card.save()
			return new Card({title: card.name}).save()	//callback of save is a promise
		})
	})
	// var c = trello.getBoards('me')

	Promise.all([Promise.all(a), Promise.all(b)])
	.then(function(asdf){

		console.log("FIN")
		res.render('boards',{boards:asdf[0], list:asdf[1]})
		console.log(asdf[0],"asdf[0]", asdf[1]+"asdf[1]")

	})
	.catch(function(err){
		return next(err)
	})
})


router.get('/auth/trello/callback', passport.authenticate('trello', {failureRedirect:'/login'}), function(req, res, next){ //middlewear
	res.render('index', { title: JSON.stringify(req.user) });
})








return router;
};