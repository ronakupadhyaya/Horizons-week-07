var express = require('express');
var session = require('express-session');
var router = express.Router();
var Trello = require("trello");
var trello = new Trello(process.env.TRELLO_KEY, req.user.token);

/* GET home page. */
router.get('/boards', function(req, res, next) {

  trello.getBoards(req.user.token).then(boards => {
	  if(Array.isArray(boards))
	  	return res.render('boards')
	  else
	  	return res.render('error', {
	  		error: boards
	  	})
	}).catch(err => {
	  return res.render('error', {
	  	error: err
	  });
	});
});

router.get('/boards/:bid', (req, res, next) =>

	Promise.all[
	trello.getBoards(req.user.token),
	trello.getListsOnBoard(req.user.token),
	trello.getCardsOnBoard(req.user.token)
	].then((results) => console.log(results))
	.catch(err => {
	  return res.render('error', {
	  	error: err
	  });
	}));

	// res.render('oneBoard', {
	// 	board: 
	// })


module.exports = router;
