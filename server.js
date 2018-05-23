// init project
const fs = require('fs');
const path = require('path'); //utilities for working with file and directory paths
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongolab = require('mongolab-provider');
const shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

app.use(express.static(__dirname, +'/public'));

//Get to obtain longURL as entry for database (* means accept all the url)
app.get('/new/:longURL(*)', (req, res, next) => {
  var { longURL } = req.params;
  
  //use regex to check url is validrom http://stackoverflow.com/questions/
  const regex = /^((ftp|http|https
  // this regex info f):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm;

  if (regex.test(longURL)===true) {
     return res.json({longURL});
  }
  return res.json({longURL: 'invalid url'});
 
});


// listen for requests :)
var listener = app.listen(port, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
