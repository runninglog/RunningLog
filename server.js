// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var expressLoad = require('express-load');
var https = require('https');
var fs = require('fs');
var passport = require('passport');
var basicStrategy = require('passport-http').BasicStrategy;

var logger = require('./utils/logger');

// Mongo database support
mongoose.connect('mongodb://localhost:27017/runninglog', function(err) {
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

// Create our Express application
var app = express();

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json({
  extended: true
}));

passport.use(new basicStrategy(
    function(username, password, callback) {
        app.models.users.findOne({ username: username }, function (err, user) {
            if (err) { return callback(err); }

            // No user found with that username
            if (!user) { return callback(null, false); }

            // Make sure the password is correct
            user.verifyPassword(password, function(err, isMatch) {
                if (err) { return callback(err); }

                // Password did not match
                if (!isMatch) { return callback(null, false); }

                // Success
                return callback(null, user);
            });
        });
    }
));

app.use(passport.initialize());

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

// HTTPS only, certificates should not be self-signed in production
var options = {
  key: fs.readFileSync('certs/key.pem'),
  cert: fs.readFileSync('certs/cert.pem')
};

// Use environment defined port or 8443 
var serverPort = process.env.SERVER_PORT || 8443;

// Start the server
https.createServer(options, app).listen(serverPort, function() {
    logger.info("HTTPS Server listening on " + serverPort);
});
