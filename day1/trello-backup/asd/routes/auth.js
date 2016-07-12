var router = require('express').Router();
	module.exports = function(passport){
		router.get("/register", function(req,res,next){
			res.render("index")
		})
		return router
	}