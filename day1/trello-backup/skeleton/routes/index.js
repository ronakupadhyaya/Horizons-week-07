var express = require('express');
var router = express.Router();
var Trello = require('trello');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/boards', function(req, res, next) {
	var trello = new Trello(process.env.TRELLO_KEY, req.user.token);
	trello.getBoards("me").then(boards => {
  // do something with boards data
  	console.log(boards);
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
	Promise.all([trello.getBoards(bid), trello.getListsOnBoard(bid), trello.getCardsOnBoard(bid)])
  .then(results => { /* handle results */
  	console.log(results);
   })
  .catch(errors => { /* handle errors */ 
  	console.log(errors);
  });
})

module.exports = router;
