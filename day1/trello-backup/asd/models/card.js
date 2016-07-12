var mongoose = require('mongoose');

var cardSchema = mongoose.Schema({
	title:{
		type: String,
		required:true
	}
})

var Card = mongoose.model('Card', cardSchema)
module.exports = Card