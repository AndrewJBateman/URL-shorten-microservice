//Structure for shortURL
const mongoose = require('mongoose');

//mongoose.connect(process.env.MONGOLAB_URI);

const Schema = mongoose.Schema;

var urlSchema = new Schema({
	originalURL: String, //original URL
	shortenedURL: String
}, {timestamp: true});

const ModelClass = mongoose.model('shortURL', urlSchema);
module.exports = ModelClass;