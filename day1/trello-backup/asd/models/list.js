var mongoose = require('mongoose');

var listSchema = mongoose.Schema({
	title:{
		type: String,
		required:true
	},
	cards:{
		type: Array
	}
})

var List = mongoose.model('List', listSchema)
module.exports = List