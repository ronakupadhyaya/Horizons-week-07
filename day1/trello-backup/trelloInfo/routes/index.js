var express = require('express');
var router = express.Router();
var passport=require('passport');
var TrelloStrategy = require('passport-trello').Strategy;
var Trello = require('trello');
//var trello = new Trello("4426aaac3e3ddf941ff93930255038d8", req.user.token);
/* GET home page. */
router.get('/', function(req,res){
	res.render('index',{title: 'Express'})
})
// router.get('/new', passport.authenticate('trello', function(req, res, next) {
//   res.render('index', { title: 'Trello' });
// }));

router.get('/auth/trello', passport.authenticate('trello'));

router.get('/auth/trello/callback', passport.authenticate('trello', {successRedirect: '/boards', failureRedirect: '/login'}//), 
	// function(req,res){
	// 	res.redirect('/boards')
	//}
	));

router.use(function(req,res,next){
	//console.log(req.user,'23')
	if(!req.user){
		res.redirect('/')
	}
	else{
		// var trello = new Trello("4426aaac3e3ddf941ff93930255038d8", req.user.token);
		//console.log(req.user)
		next()
		//res.redirect('/board')
	}
})

// var trello = new Trello("4426aaac3e3ddf941ff93930255038d8", req.user.token);

router.get('/boards', function(req,res){
	var trello = new Trello("4426aaac3e3ddf941ff93930255038d8", req.user.token);
	trello.getBoards("me").then(
		function(boards){
			console.log(boards)
		}
  	// do something with boards data
	).catch(function(err){
		console.log(err)
	});
	// var trello = new Trello("4426aaac3e3ddf941ff93930255038d8", req.user.token);
	res.render('boards')
})
module.exports = router;
