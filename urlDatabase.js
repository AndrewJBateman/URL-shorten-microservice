
const mongolab = require('mongolab-provider');
const dBase = mongolab.dBase;

const urlDatabase = new dBase({
  longURL: String,
  shortURL: String
}, {timestamp: true});

const modelClass = mongolab.model('shortURL', urlDatabase);

module.exports = modelClass;