// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var expressLoad = require('express-load');
var https = require('https');
var passport = require('passport');
var basicStrategy = require('passport-http').BasicStrategy;

var config = require('config');
var logger = require('./utils/logger');

// Create our Express application
var app = express();

// Connect to mongodb
var connect = function () {
    var options = { server: { socketOptions: { keepAlive: 1 } } };
    mongoose.connect(config.db, options);
};
connect();

mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);
mongoose.connection.once('open', function() {
    logger.info('Connected to database');
});

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

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json({
  extended: true
}));

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

// Start the server
https.createServer(config.serverOptions, app).listen(config.serverPort, function() {
    logger.info("HTTPS Server listening on " + config.serverPort);
});
