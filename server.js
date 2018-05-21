// init project
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

//Get to obtain entry for database
app.get("/new/:longURL(·)", (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// listen for requests :)
var listener = app.listen(port, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
