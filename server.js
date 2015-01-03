// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var expressLoad = require('express-load');
var http = require('http');
var https = require('https');
var fs = require('fs');

var logger = require('./utils/logger');

// Mongo database support
var mongodb_port = process.env.MONGO_PORT_27017_TCP_PORT || '27017';
var mongodb_addr = process.env.MONGO_PORT_27017_TCP_ADDR || '127.0.0.1';
var mongodb_string = 'mongodb://' + mongodb_addr + ':' + mongodb_port + '/runninglog';

mongoose.connect(mongodb_string, function(err) {
    if (err) {
        logger.error('Database not ready! ' + err);
    }
});

// Generic database monitoring
var db = mongoose.connection;

db.on('error', function(err) {
  logger.error('Database connection error: ' + err);
});

db.once('open', function callback() {
  logger.info('Connected to database');
});

// Use environment defined port or 3000
var httpPort = process.env.PORT || 3000;
var httpsPort = process.env.HTTPSPORT || 8443;

// Create our Express application
var app = express();

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json({
  extended: true
}));


logger.debug("Overriding 'Express' logger");
app.use(morgan('combined', { "stream": logger.stream }));

// MVC module config (after all the rest, otherwise it may fail)
expressLoad('models').then('controllers').then('routes').into(app);

// Generic handler for unmapped routes
app.use(function(req, res) {
    logger.info('Not found: ' + req.path);
    res.sendStatus(404);
});

// Generic handler for internal server errors
app.use(function(err, req, res, next) {
    logger.error('Internal server error: ' + err);
    res.sendStatus(500);
});

var options = {
  key: fs.readFileSync('certs/key.pem'),
  cert: fs.readFileSync('certs/cert.pem')
};

// Start the server
http.createServer(app).listen(httpPort, function() {
    logger.info("HTTP Server listening on " + httpPort);
});

// Create an HTTPS service identical to the HTTP service.
https.createServer(options, app).listen(httpsPort, function() {
    logger.info("HTTPS Server listening on " + httpsPort);
});
