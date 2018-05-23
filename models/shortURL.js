const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var urlSchema = new Schema({
	longURL: String, //original URL
	shorterURL: String
}, {timestamp: true});

const modelClass = mongoose.model('shortURL', urlSchema);

module.exports = modelClass;