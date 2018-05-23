
const mongoose = require('mongoose');
const mongolab = require("mongolab-provider");
const dBase = mongoose.dBase;

const urlDatabase = new dBase({
  longURL: String,
  shortURL: String
}, {timestamp: true});

const modelClass = mongoose.model('shortURL', urlDatabase);

module.exports = modelClass;