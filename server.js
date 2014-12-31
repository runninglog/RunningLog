// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');

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

// Use environment defined port or 3000
var port = process.env.PORT || 3000;

// Create our Express router
var router = express.Router();

// Create our Express application
var app = express();

logger.debug("Overriding 'Express' logger");
app.use(require('morgan')('combined', { "stream": logger.stream }));

// MVC module config (after all the rest, otherwise it may fail)
var load = require('express-load');
//load('models').then('controllers').then('routes').into(app);
load('models').into(app);

// Register all our routes with /api
app.use('/api', router);

// Initial dummy route for testing
// http://localhost:3000/api
router.get('/', function(req, res) {
  res.json({ message: 'Burn the Witch!' });
});

// Start the server
app.listen(port, function() {
    logger.info("Listening on " + port);
});
