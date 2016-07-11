var express = require('express');
var router = express.Router();
var passport=require('passport');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



router.get('/auth/trello', passport.authenticate('trello'))
router.get('/auth/trello/callback', passport.authenticate('trello', {failureRedirect: '/login'}), 
	function(req,res){
		res.redirect('/')
	})

module.exports = router;
