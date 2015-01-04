var logger = require('../utils/logger');

module.exports = function (app) {
    // Generic handler for unmapped routes
    app.use(function(req, res) {
        logger.info('Not found: ' + req.path);

        res.status(404).render('404', {
            url: req.originalUrl,
            error: 'Not found'
        });
    });

    // Generic handler for internal server errors
    app.use(function(err, req, res, next) {
        logger.error('Internal server error: ' + err);
        res.status(500).render('500', {
            url: req.originalUrl,
            error: 'Internal server error: ' + err
        });
    });
};
