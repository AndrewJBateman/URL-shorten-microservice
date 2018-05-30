//Structure for storing original URLs with shortenedURL key
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var urlSchema = new Schema({
	originalURL: String, //original URL
	shortenedURL: String //shortID generated for each original URL
}, {collection: 'links'}, {timestamp: true});

const ModelClass = mongoose.model('shortURL', urlSchema);
module.exports = ModelClass;