var bodyParser = require('body-parser');
var morgan = require('morgan');
var cors = require('cors');
var logger = require('../utils/logger');

module.exports = function (app, passport) {
    // Use the body-parser package in our application
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json({ extended: true }));

    app.use(morgan('combined', { "stream": logger.stream }));

    app.use(passport.initialize());

    // Cross-domain requests support
    app.use(cors);

    // Pretty print
    app.set('json spaces', 2);
};
