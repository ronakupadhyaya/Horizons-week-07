var mongoose = require('mongoose');


var boardSchema = mongoose.Schema ({
	name: String,
	id: String,
	list: [{
		name: String,
		id: String,
		cards: [{
			name: String,
			id: String,
			desc: String
		}]
	}]
});



module.exports = mongoose.model('Board', boardSchema);