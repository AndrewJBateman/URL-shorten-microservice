const mongoose = require('mongoose');

mongoose.connect(process.env.MONGOLAB_URI);

const Schema = mongoose.Schema;

var urlSchema = new Schema({
	originalURL: String, //original URL
	shorterURL: String
}, {timestamp: true});

const modelClass = mongoose.model('shortURL', urlSchema);

module.exports = modelClass;