// init project
//const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const shortURL = require('./models/shortURL');
const shortid = require('shortid'); //alphanumeric characters only, all url -friendly
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
const port = process.env.PORT || 3000;
const regex = /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm;
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '/public')));

//connect to database
mongoose.connect(process.env.MONGODB_URI, function(err, db){
  
  if(err){
    console.log("mongodb connection error", err);
    process.exit(1);
  }//else...
  console.log('connected to mongodb with URI: ' +process.env.MONGODB_URI);
  
  //show index page
  app.get("/", (req, res, next) => {
  res.sendFile(__dirname + '/views/index.html');
  });
  
  //Get to obtain original URL as entry for database (* means accept all the url)
  app.get('/new/:originalURL(*)', (req, res) => {
    const { originalURL } = req.params;
    //use regex to check url is valid, regex const taken from http://stackoverflow.com/questions/   
    if (regex.test(originalURL)===true) { //save as constant in database
      const data = new shortURL({
        originalURL: originalURL,
        shortenedURL: shortid.generate()
      }); //end const data
      console.log(data); //works
      
      data.save(err => {
        if(err) {
          console.log(err);
          return res.send('error: unable to save to database');
        }
        console.log('all OK');
      }); //end of function save
      res.send(data);
      //return res.json(data); 
    } //end of regex if condition, else return error
    else{
      return res.json //if url is not the correct format
      ({ 
      originalURL: 'failed the formatting test - try another URL' //works
      });
    } //end else
  }); //end function get
  
  //Query Horuko-mLab database and return original URL
  app.get('/:shortURLID', (req, res, next) => {
    var short = req.params.shortURLID; //store param value obtained from user input
    shortURL.findOne({'shortenedURL': short}, (err, data) => {
      if(err) throw err;
    
      if(data){
        var regex = new RegExp("^(http|https)://", "i");
        var stringToCheck = data.originalURL; 
        if (regex.test(stringToCheck)){ //if test passes redirect to the original URL
          res.redirect(301, data.originalURL);
        } else { //otherwise add https in front
        res.redirect(301, 'https://' + data.originalURL);
        } 
      } //end if(data)
    
      else{
        console.log('no match found try re-entering the shortID');
        res.sendFile(__dirname + '/views/error.html');
      }
    }); //end findOne
  }); //end app.get
    
}); //end connect

var listener = app.listen(port, () =>{
  console.log('Your app is listening on port ' + listener.address().port);
});