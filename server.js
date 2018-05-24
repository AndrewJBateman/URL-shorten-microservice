// init project
const fs = require('fs');
const path = require('path'); //utilities for working with file and directory paths
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require("mongoose");
const mongolab = require('mongolab-provider');
const shortURL = require('./models/shortURL');

//connect to database
mongoose.connect(process.env.MONGODB_URL, {useMongoClient: true});

const shortid = require('shortid');
//alphanumeric characters only, all url -friendly
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

const port = process.env.PORT || '3000';
var listener = app.listen(port, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});

app.use(bodyParser.json());
app.use(cors());

app.use(express.static(__dirname, +'/public'));

//Get to obtain longURL as entry for database (* means accept all the url)
app.get('/new/:longURL(*)', (req, res, next) => {
  var { longURL } = req.params;
  
  //use regex to check url is valid, from http://stackoverflow.com/questions/
  const regex = /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm;

  if (regex.test(longURL)===true) {
    var short = shortid.generate();
    
    var data = new shortURL(
      {
        originalURL: longURL,
        shorterURL: shortURL
      }
    );
    
    shortURL.save(err => {
      if(err){
        return res.send('error in saving to database')
      }
    }); //end of function save
  } //end if
  return res.json({longURL: 'invalid url'});
}); //end function get

//Query database and return original URL using shortid
app.get('/:URLtoReturn', (req, res, next) => {
  var short_URL = req.params.URLtoReturn; 
});