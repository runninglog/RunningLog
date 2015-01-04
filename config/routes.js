var logger = require('../utils/logger');

module.exports = function (app) {
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
};
