var express = require('express');
var router = express.Router();
var trello = require('trello');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/boards', function(req, res, next) {
	var Trello = new trello('2b914ba388cf2f53ab67ae0e4f59cb80', req.user.token);
	Trello.getBoards('me').then(boards => {
		res.render('boards', {boards: boards});
	}).catch(err => {
		console.log('error', err);
	})
})

module.exports = router;
