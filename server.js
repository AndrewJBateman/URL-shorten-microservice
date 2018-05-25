// init project
//const fs = require('fs');
//const path = require('path'); //utilities for working with file and directory paths
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
//const mongodb = require('mongodb');
const shortURL = require('./models/shortURL');
const MongoClient = require('mongodb').MongoClient;
const shortid = require('shortid');
//alphanumeric characters only, all url -friendly
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname, +'/public'));

  //connect to database
  MongoClient.connect(process.env.MONGOLAB_URI);
  //Get to obtain original URL as entry for database (* means accept all the url)
  app.get('/new/:originalURL(*)', (req, res, next) => {
    const { originalURL } = req.params;
  
    //use regex to check url is valid, from http://stackoverflow.com/questions/
    const regex = /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm;
    
    if (regex.test(originalURL)===true) {
      
      const data = new shortURL({
        originalURL: originalURL,
        shortenedURL: shortid.generate()
        });
      console.log(data);
      
      data.save((err) => {
        
        if(err) {
          res.send('error ' +err)
        }
      }); //end of function save
      return res.json(data); 
    } //end regex if
    
    else{
      console.log('regex error');
    }
  
  }); //end function get
  
  //Query database and return original URL using key value short
  app.get('/:shortURLId', (req, res, next) => {
    //store param value
    var short = req.params.shortURLId;
  
    shortURL.findOne({
      'shortenedURL': short
    }, (err, data) => {
      
      if(err) {
        res.send('Error reading database' +err);
      } else {
        var regex = new RegExp("^(http|https)://", "i");
        var strToCheck = data.originalURL;
        
        if (regex.test(strToCheck)){
          res.redirect(301, data.originalURL);
        } else {
          return res.redirect(301, 'https://' + data.originalURL);
        }
      } 
    }); //end findOne
  }); //end app.get
  
app.get("/", (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

var listener = app.listen(port, () =>{
  console.log('Your app is listening on port ' + listener.address().port);
});