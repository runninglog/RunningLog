var basicStrategy = require('passport-http').BasicStrategy;

module.exports = function (app, config) {
    return new basicStrategy(
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
    );
};
