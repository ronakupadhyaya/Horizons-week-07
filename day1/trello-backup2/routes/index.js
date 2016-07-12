var express = require('express');
var router = express.Router();
var Trello = require("trello");
// var trello = new Trello("MY APPLICATION KEY", "MY USER TOKEN");
var TRELLO_ID = '2c835df60c347ec5fb715ae71c0c64b2';



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/boards', function(req, res) {
	var trello = new Trello(TRELLO_ID, req.user.token);
	// var trello = new Trello(TRELLO_ID, req.token);
	trello.getBoards("me").then(boards => {
		if(Array.isArray(boards)) {
			console.log('Got boards ', boards);
			req.user.boards = boards
			res.render('boards', {
				data: req.user.boards
			})
		} 
		else {
			console.log('Error getting boards ', boards)
		}
	}).catch(err => {
	  console.log('Error getting boards ', err)
	})
})

module.exports = router;
