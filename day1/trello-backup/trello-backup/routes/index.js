var express = require('express');
var router = express.Router();
var passport = require('passport');

var Trello = require('trello');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/auth/trello', 
	passport.authenticate('trello'));

router.get('/auth/trello/callback', 
	passport.authenticate('trello', {failureRedirect: '/login'}),
	function(req, res) {
		res.redirect('/');
	}
);

router.get('/boards', function(req, res) {
	var trello = new Trello(process.env.TRELLO_KEY, req.user.token);
	trello.getBoards('me').then(boards => {
		res.render('boards', {
			boards: boards
		}).catch(err => {
			res.render('boards', {
				err: err
			})
		})
	})
});

router.get('/boards/:id', function(req, res, next) {
	var trello = new Trello(process.env.TRELLO_KEY, req.user.token);
	trello.getBoards("me").then(board => {
		console.log("board", board);
		res.render('singleBoard', {
			board: board
		}).catch(err => {
			next(err);
		})
	})
});

module.exports = router;
