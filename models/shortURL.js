const mongoose = require('mongoose');

//mongoose.connect(process.env.MONGOLAB_URI);

const Schema = mongoose.Schema;

var urlSchema = new Schema({
	originalURL: String, //original URL
	shortenedURL: String
}, {timestamp: true});

module.exports = mongoose.model('shortURL', urlSchema);;