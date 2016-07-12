var express = require('express');
var router = express.Router();
var Trello = require("trello");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/boards', function(req, res, next) {
	
	var trello = new Trello("3a062b799e8b3d4f766e4ee08f7bc924", req.user.token);
	trello.getBoards("me").then(boards => {
		console.log(boards);
  		// do something with boards data
  		return res.render('boards', {
  			boards: boards
  		});
		}).catch(err => {
  			// handle the error
  			console.log(err);
	});
})

router.get('/boards/:id', function(req, res, next) {
	
	Promise.all([trello.getBoards('me'), trello.getListsOnBoard(req.params._id), trello.getCardsOnBoard(req.params._id)])
  	.then(results => { return res.render('single_board', {
  		board: results.board,
  		lists: results.lists,
  		cards: results.cards
  })}) 
  .catch(errors => { /* handle errors */ });
})

module.exports = router;
