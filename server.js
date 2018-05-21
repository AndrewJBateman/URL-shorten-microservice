// init project
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const shortid = require('shortid');
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

//Get to obtain longURL as entry for database (* means accept all the url)
app.get('/new/:longURL(*)', (req, res, next) => {
  var { longURL } = req.params;
  
  //use regex to check url is valid
  // Credit to http://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
  // Created by Diogo Cardoso, and Zemljoradnik
  const regex = /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm;

  if (regex.test(longURL)===true) {
     return res.json({longURL});
  }
  return res.json({longURL: 'invalid url'});
 
});

function shortURLNumberGen() {
  var randomChannel = Math.floor(Math.random() * 10000);
  return (randomChannel);
}

// listen for requests :)
var listener = app.listen(port, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
