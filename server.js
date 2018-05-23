// init project
const fs = require('fs');
const path = require('path'); //utilities for working with file and directory paths
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongolab = require('mongolab-provider');
//connect to database
//mongolab.connect(process.env.MONGO_URL || 'mongolab://localhost/shortURLs');

const shortid = require('shortid');
//alphanumeric characters only, all url -friendly
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

app.use(express.static(__dirname, +'/public'));

//Get to obtain longURL as entry for database (* means accept all the url)
app.get('/new/:longURL(*)', (req, res, next) => {
  var { longURL } = req.params;
  
  //use regex to check url is valid, from http://stackoverflow.com/questions/
  const regex = /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm;

  if (regex.test(longURL)===true) {
    var shortURL = shortid.generate();
    return res.json({
      original_URL: longURL,
      short_URL: shortURL
    });
    
    shortURL.save(err => {
      if(err){
        return res.send('error in saving to database')
      }
    }); //end of function save
  }
  return res.json({longURL: 'invalid url'});
 
});


// listen for requests :)
var listener = app.listen(port, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
