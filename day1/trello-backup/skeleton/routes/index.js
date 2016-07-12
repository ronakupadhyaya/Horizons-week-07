var express = require('express');
var router = express.Router();
var Trello = require('trello');
var Board = require('../models/models');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/boards', function(req, res, next) {
	var trello = new Trello(process.env.TRELLO_KEY, req.user.token);
	trello.getBoards("me").then(boards => {
  // do something with boards data
  	console.log("LOOK HERE", boards);
  	if (!Array.isArray(boards)) {
  		throw "error"
  	}
  res.render('boards', { boards: boards });
	}).catch(err => {
  	return next(err);
	});
	
});

router.get('/boards/:bid', function(req, res, next) {
	var trello = new Trello(process.env.TRELLO_KEY, req.user.token);
	var bid = req.params.bid;
	Promise.all([trello.getBoards("me"), trello.getListsOnBoard(bid), trello.getCardsOnBoard(bid)])
  .then(results => { /* handle results */
  	var bname;
  	var lists = [];
  	
  
  	results[0].forEach(board => {
  		if (board.id === bid) {
  			bname = board.name
  		}
  	})
  	results[1].forEach(list => {
  		lists.push({
  			name: list.name,
  			id: list.id,
  			cards: results[2].filter(card => card.idList===list.id)

  		})
  	})
  	
  	var backup = new Board({
  		name: bname,
		id: bid,
		list: lists
  	})
  	return backup.save();
   })
  .catch(errors => { /* handle errors */ 
  	console.log(errors);
  	return next(errors);
  });
})

router.get('/restore/:bid', function(req, res, next) {
	var bid = req.params.bid;
	var trello = new Trello(process.env.TRELLO_KEY, req.user.token);
	Board.findOne({id: bid}, (err, board) => {
		// console.log('error', err);
		// console.log('board', board);
  /* Create the board using Trello API, save its lists (board.lists),
  and save the cards for each of those lists (e.g., board.lists[0].cards) */
  var newbname = board.name + "_copy"
		  trello.addBoard(newbname).then(newBoard => {
		  	console.log("YO ", board.list);
		  	board.list.forEach(list => {
		  		trello.addListToBoard(newBoard.id, list.name).then(newList => {
		  			 console.log('newlist', newList);
		  			list.cards.forEach(card => {
		  				console.log('card', card);
		  				trello.addCard(card.name, card.desc, newList.id)
		  			})
		  		})
		  	})
		  	
		  })
			}).catch(err => { /* handle error */ 
				console.log(err);
			});

})

module.exports = router;
