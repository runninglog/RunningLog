var logger = require('../../utils/logger');
var basicStrategy = require('passport-http').BasicStrategy;

module.exports = function (app, config) {
    var basic = new basicStrategy(
        function(username, password, callback) {
            app.models.users.findOne({ username: username }, function (err, user) {
                if (err) {
                    logger.error('Access denied, general error: ' + err);
                    return callback(err);
                }

                // No user found with that username
                if (!user) {
                    logger.debug('Access denied, unknown: ' + username);
                    return callback(null, false);
                }

                // Make sure the password is correct
                user.verifyPassword(password, function(err, isMatch) {
                    if (err) {
                        logger.error('Access denied, verification error: ' + err);
                        return callback(err);
                    }

                    // Password did not match
                    if (!isMatch) {
                        logger.debug('Access denied, credentials error: ' + username);
                        return callback(null, false);
                    }

                    // Success
                    return callback(null, user);
                });
            });
        }
    );

    return basic;
};
