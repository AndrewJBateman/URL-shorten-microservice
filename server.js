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

//when a GET request is made to the homepage, respond with the index.html file, 
//If error, log an error, else log 'sent'
app.get('/', (req,res) => {
  var fileName = path.join(__dirname, 'index.html');
  res.sendFile(fileName, (err) => {
    if (err){
     console.log(err);
      res.status(err.status).end();
    }
    else {
     console.log('Sent:', fileName); 
    }
  });
});

//Get to obtain longURL as entry for database (* means accept all the url)
app.get('/new/:longURL(*)', (req, res, next) => {
  var { longURL } = req.params;
  
  //use regex to check url is valid
  // this regex info from http://stackoverflow.com/questions/
  const regex = /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm;

  if (regex.test(longURL)===true) {
     return res.json({longURL});
  }
  return res.json({longURL: 'invalid url'});
 
});


// listen for requests :)
var listener = app.listen(port, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
