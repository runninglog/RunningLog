exports.index = function(req, res, next) {
    // Gracefully accepts requests on site root
    res.send(200);
};

exports.version = function(req, res, next) {
    // API version
    res.send('1');
};
