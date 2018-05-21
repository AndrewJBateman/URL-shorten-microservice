// init project
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));




app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// listen for requests :)
var listener = app.listen(port, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
