'use strict';
const dotenv = require('dotenv').config();
const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const shortURL = require('./models/shortURL');
const url = require('url');
const dns = require('dns');
const shortid = require('shortid'); //alphanumeric characters only, all url -friendly
shortid.characters(
	'0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@'
);
const port = process.env.PORT || 3000;
const httpRegex = /^(?:f|ht)tps?\:\/\//;
const regex = /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm;
//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static(path.join(__dirname, '/public')));

// MongoDB Atlas Database Access Credentials
const dbUserName = process.env.USER_NAME;
const dbUserPass = process.env.USER_PASSWORD;
const dbName = process.env.DB_NAME;
const dbCluster = process.env.DB_CLUSTER;
const dbUrl = `mongodb+srv://${dbUserName}:${dbUserPass}@${dbCluster}/${dbName}?retryWrites=true&w=majority`;

//connect to database
mongoose.connect(
	dbUrl,
	{ useNewUrlParser: true, useUnifiedTopology: true },
	(err, db) => {
		if (err) {
			console.log('mongodb connection error ', err);
			process.exit(1);
		} else {
			console.log(
				'Successful database connection to Mongoose Atlas database named: ',
				dbName
			);
		}

		//show index page
		app.get('/', (req, res, next) => {
			res.sendFile(__dirname + '/views/index.html');
		});

		//Get to obtain original URL as entry for database (* means accept all the url)
		app.post('/api/shorturl/new', (req, res) => {
			const originalURL = req.body.url;
			//add http if not there already using prependHttp function
			const parsedURL = url.parse(prependHttp(originalURL));
			console.log('parsedURL is: ', parsedURL);

			//use dns lookup function to check url is valid
			dns.lookup(parsedURL.host, (err, address) => {
				if (address === undefined) {
					res.json({
						error:
							'This url failed the formatting test - check and try again. ' +
							err,
					});
				} else {
					const data = new shortURL({
						originalURL: prependHttp(originalURL),
						shortenedURL: shortid.generate(),
					});
					console.log(data);

					data.save((err) => {
						if (err) {
							console.log(err);
							return res.send('error: unable to save to database');
						}
						console.log('all OK');
					});
					res.send(data);
				}
			});
		});

		//Query mongoDB database and return original URL
		app.get('/api/shorturl/:shortURLID', (req, res, next) => {
			var short = req.params.shortURLID; //store param value obtained from user input
			shortURL.findOne({ shortenedURL: short }, (err, data) => {
				if (err) throw err;

				if (data) {
					var httpRegex = new RegExp('^(http|https)://', 'i');
					var stringToCheck = data.originalURL;
					if (httpRegex.test(stringToCheck)) {
						//if test passes redirect to the original URL
						res.redirect(301, data.originalURL);
					} else {
						res.redirect(301, 'https://' + data.originalURL);
					}
				} else {
					console.log('no match found try re-entering the shortID');
					res.sendFile(__dirname + '/views/error.html');
				}
			}); //end findOne
		}); //end app.get

		function prependHttp(url) {
			let fullURL = url;
			//if it does not pass the regex test then prepend http
			if (!httpRegex.test(url)) {
				fullURL = 'http://'.concat(url);
			}
			return fullURL;
		}
	}
); //end connect

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
	res.sendFile(process.cwd() + '/views/index.html');
});

app.listen(port, function () {
	console.log('Node.js listening on port ' + port);
});
