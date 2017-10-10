'use strict'
// call the packages we need
var express         = require('express');
var session         = require('express-session');
var bodyParser      = require('body-parser');
var cookieParser    = require('cookie-parser');
var methodOverride  = require('method-override');
var app             = express();
var http 			      = require('http');
var https           = require('https');
var config          = require('./config/index');

var fileUpload = require('express-fileupload');

// configure body parser
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({limit: '500mb', extended: true })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json({limit: '500mb'}));
app.use(fileUpload());
app.use(express.static('public'));


// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
// app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

// Use the session middleware
app.use(session({
  secret: 'UPalexLTD',
  resave: false,
  saveUninitialized: true
}));

// CREATE OUR ROUTER
var router = express.Router();
require('./modules/routes.js')(router);
app.use('/', router);

// start app ===============================================
app.listen(config.port);
console.log('Magic happens on port ' + config.port); // shoutout to the user
exports = module.exports = app;               // export app