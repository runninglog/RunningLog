module.exports = function (passport, app, config) {
    var basic = require('./passport/basic')(app, config);

    // Use these strategies
    passport.use(basic);
};
