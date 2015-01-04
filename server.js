// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var expressLoad = require('express-load');
var https = require('https');

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

// Passport settings
require('./config/passport')(passport, app, config);

// Application settings
require('./config/express')(app, passport);

// MVC module config (after all the rest, otherwise it may fail)
expressLoad('models').then('controllers').then('routes').into(app);

// Error handling routes settings
require('./config/routes')(app);

// Start the server
https.createServer(config.serverOptions, app).listen(config.serverPort, function() {
    logger.info("HTTPS Server listening on " + config.serverPort);
});
