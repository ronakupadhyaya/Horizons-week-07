var mongoose = require('mongoose');

var boardSchema = mongoose.Schema({
	title:{
		type: String,
		required:true
	},
	lists:{
		type: Array
	}
})

var Board = mongoose.model('Board', boardSchema);
module.exports = Board